import React, { useEffect, useRef, useState, useCallback } from "react";

const TOTAL_FRAMES = 193;
const INITIAL_BATCH_SIZE = 8;
const BATCH_SIZE = 6;

export default function HeroScrollCanvas({ progress = 0 }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef(new Array(TOTAL_FRAMES));
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafIdRef = useRef(null);
  const lastRenderedRef = useRef(-1);
  const isVisibleRef = useRef(true);
  const isLoadedRef = useRef(false);
  const [, setForceUpdate] = useState(0);

  const renderImage = (ctx, canvas, img) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvas.width / canvas.height;

    let drawW, drawH, drawX, drawY;

    if (canvasRatio > imgRatio) {
      drawW = canvas.width;
      drawH = canvas.width / imgRatio;
      drawX = 0;
      drawY = (canvas.height - drawH) / 2;
    } else {
      drawH = canvas.height;
      drawW = canvas.height * imgRatio;
      drawX = (canvas.width - drawW) / 2;
      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  };

  const drawFrame = useCallback((frameIdx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images = imagesRef.current;
    const img = images[frameIdx];

    if (!img || !img.complete || img.naturalWidth === 0) {
      // Fallback to closest loaded frame
      let fallback = null;
      for (let delta = 1; delta < TOTAL_FRAMES; delta++) {
        const prev = images[frameIdx - delta];
        if (prev?.complete && prev.naturalWidth > 0) {
          fallback = prev;
          break;
        }
        const next = images[frameIdx + delta];
        if (next?.complete && next.naturalWidth > 0) {
          fallback = next;
          break;
        }
      }
      if (!fallback) return;
      renderImage(ctx, canvas, fallback);
      return;
    }

    renderImage(ctx, canvas, img);
  }, []);

  // Progressive staged frame loading
  useEffect(() => {
    let isCancelled = false;
    const images = imagesRef.current;

    const loadSingleFrame = (index) => {
      if (images[index]) return Promise.resolve(images[index]);
      return new Promise((resolve) => {
        const img = new Image();
        img.src = `/hero-frames/frame_${String(index).padStart(3, "0")}.webp`;
        img.onload = () => {
          if (!isCancelled) {
            images[index] = img;
            resolve(img);
          }
        };
        img.onerror = () => resolve(null);
      });
    };

    // 1. Initial critical batch (instant paint of first frame and immediate scrub headroom)
    loadSingleFrame(0).then(() => {
      if (!isCancelled) {
        drawFrame(0);
        isLoadedRef.current = true;
        setForceUpdate((v) => v + 1);
      }
    });

    const initialPromises = [];
    for (let i = 1; i < INITIAL_BATCH_SIZE; i++) {
      initialPromises.push(loadSingleFrame(i));
    }

    // 2. Progressive background batching during idle time
    let nextIndex = INITIAL_BATCH_SIZE;

    const loadNextBatch = () => {
      if (isCancelled || nextIndex >= TOTAL_FRAMES) return;

      const currentBatchEnd = Math.min(nextIndex + BATCH_SIZE, TOTAL_FRAMES);
      const batchPromises = [];
      for (let i = nextIndex; i < currentBatchEnd; i++) {
        batchPromises.push(loadSingleFrame(i));
      }
      nextIndex = currentBatchEnd;

      Promise.all(batchPromises).then(() => {
        if (!isCancelled && nextIndex < TOTAL_FRAMES) {
          if ("requestIdleCallback" in window) {
            window.requestIdleCallback(loadNextBatch, { timeout: 120 });
          } else {
            setTimeout(loadNextBatch, 50);
          }
        }
      });
    };

    Promise.all(initialPromises).then(() => {
      if (!isCancelled) {
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(loadNextBatch, { timeout: 150 });
        } else {
          setTimeout(loadNextBatch, 80);
        }
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [drawFrame]);

  // On-demand animation loop (sleeps when settled or off-screen)
  const startAnimationLoop = useCallback(() => {
    if (rafIdRef.current || !isVisibleRef.current) return;

    const animate = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * 0.15;
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      const currentIdx = Math.round(currentFrameRef.current);
      if (currentIdx !== lastRenderedRef.current) {
        drawFrame(currentIdx);
        lastRenderedRef.current = currentIdx;
      }

      // Check if settled
      if (
        Math.abs(targetFrameRef.current - currentFrameRef.current) < 0.01 &&
        currentIdx === targetFrameRef.current
      ) {
        rafIdRef.current = null;
        return;
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);
  }, [drawFrame]);

  // Update target frame from scroll progress
  useEffect(() => {
    const frameIndex = Math.max(
      0,
      Math.min(TOTAL_FRAMES - 1, Math.round(progress * (TOTAL_FRAMES - 1)))
    );
    if (frameIndex !== targetFrameRef.current) {
      targetFrameRef.current = frameIndex;
      startAnimationLoop();
    }
  }, [progress, startAnimationLoop]);

  // IntersectionObserver to pause rendering when hero is off-screen
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          drawFrame(Math.round(currentFrameRef.current));
          startAnimationLoop();
        } else if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [drawFrame, startAnimationLoop]);

  // Responsive canvas resizing with DPR capped for performance
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const isMobile = window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      drawFrame(Math.round(currentFrameRef.current));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover transition-opacity duration-700"
      />

      {/* 1. Left Editorial Scrim */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/85 via-45% to-transparent pointer-events-none" />

      {/* 2. Atmospheric Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 75% 50%, rgba(8,8,8,0.1) 0%, rgba(8,8,8,0.6) 60%, #080808 95%)",
        }}
      />

      {/* 3. Subtle Film Grain (lightweight CSS repeating texture) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none hidden sm:block"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 50% 50%, #fff 0, #fff 1px, transparent 1px, transparent 100%)",
          backgroundSize: "8px 8px",
        }}
      />

      {/* 4. Fine Hairline Scanline Texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* 5. Top & Bottom Depth Fades */}
      <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#080808] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-[#080808] via-[#080808]/90 to-transparent pointer-events-none" />
    </div>
  );
}
