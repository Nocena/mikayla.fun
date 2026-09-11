import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function TrueFocus({
  sentence = "BUILT DIFFERENT",
  separator = " ",
  manualMode = false,
  blurAmount = 4,
  borderColor = "#d4fc50",
  glowColor = "rgba(212, 252, 80, 0.65)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1.0,
  className = "",
}) {
  const words = sentence.split(separator);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState(null);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!manualMode && words.length > 1) {
      const interval = setInterval(
        () => {
          setCurrentIndex((prev) => (prev + 1) % words.length);
        },
        (animationDuration + pauseBetweenAnimations) * 1000
      );
      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  const updateRect = () => {
    if (currentIndex === null || currentIndex === -1) return;
    if (!wordRefs.current[currentIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex].getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    });
  };

  useEffect(() => {
    updateRect();
    const t1 = setTimeout(updateRect, 60);
    const t2 = setTimeout(updateRect, 200);
    if (document.fonts?.ready) {
      document.fonts.ready.then(updateRect);
    }
    window.addEventListener("resize", updateRect);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", updateRect);
    };
  }, [currentIndex, words.length]);

  const handleMouseEnter = (index) => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex !== null ? lastActiveIndex : 0);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-wrap items-center leading-none ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={(el) => (wordRefs.current[index] = el)}
            onMouseEnter={() => handleMouseEnter(index)}
            className="relative cursor-pointer transition-all select-none inline-block px-1.5"
            style={{
              filter: isActive ? "blur(0px)" : `blur(${blurAmount}px)`,
              opacity: isActive ? 1 : 0.45,
              transition: "filter 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {word}
          </span>
        );
      })}

      {focusRect.width > 0 && (
        <motion.div
          className="absolute pointer-events-none rounded border-2 z-10"
          animate={{
            x: focusRect.x - 4,
            y: focusRect.y - 2,
            width: focusRect.width + 8,
            height: focusRect.height + 4,
            opacity: currentIndex !== null ? 1 : 0,
          }}
          transition={{
            type: "spring",
            damping: 24,
            stiffness: 280,
          }}
          style={{
            borderColor: borderColor,
            boxShadow: `0 0 24px ${glowColor}, inset 0 0 12px ${glowColor}`,
          }}
        >
          {/* Corner Notch Accents */}
          <span
            className="absolute -top-1.5 -left-1.5 w-2 h-2"
            style={{ backgroundColor: borderColor }}
          />
          <span
            className="absolute -top-1.5 -right-1.5 w-2 h-2"
            style={{ backgroundColor: borderColor }}
          />
          <span
            className="absolute -bottom-1.5 -left-1.5 w-2 h-2"
            style={{ backgroundColor: borderColor }}
          />
          <span
            className="absolute -bottom-1.5 -right-1.5 w-2 h-2"
            style={{ backgroundColor: borderColor }}
          />
        </motion.div>
      )}
    </div>
  );
}
