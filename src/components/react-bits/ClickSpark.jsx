import React, { useRef, useEffect, useCallback } from "react";

const ClickSpark = ({
  sparkColor = "#d4fc50",
  sparkSize = 12,
  sparkRadius = 24,
  sparkCount = 10,
  duration = 450,
  easing = "ease-out",
  extraScale = 1.0,
  children,
}) => {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const isRunningRef = useRef(false);
  const animationIdRef = useRef(null);

  // Resize canvas strictly to viewport
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const easeFunc = useCallback(
    (t) => {
      switch (easing) {
        case "linear":
          return t;
        case "ease-in":
          return t * t;
        case "ease-in-out":
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing]
  );

  const startAnimationLoop = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    const draw = (timestamp) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        isRunningRef.current = false;
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        isRunningRef.current = false;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) {
          return false;
        }

        const progress = elapsed / duration;
        const eased = easeFunc(progress);

        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      if (sparksRef.current.length > 0) {
        animationIdRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        isRunningRef.current = false;
        animationIdRef.current = null;
      }
    };

    animationIdRef.current = requestAnimationFrame(draw);
  }, [duration, easeFunc, sparkRadius, extraScale, sparkSize, sparkColor]);

  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      isRunningRef.current = false;
    };
  }, []);

  const handleClick = (e) => {
    const x = e.clientX;
    const y = e.clientY;

    const now = performance.now();
    const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
      x,
      y,
      angle: (2 * Math.PI * i) / sparkCount + (Math.random() - 0.5) * 0.4,
      startTime: now,
    }));

    sparksRef.current.push(...newSparks);
    startAnimationLoop();
  };

  return (
    <div className="relative w-full h-full" onClick={handleClick}>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />
      {children}
    </div>
  );
};

export default ClickSpark;
