import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";

export default function DecryptedText({
  text,
  speed = 40,
  maxIterations = 8,
  sequential = false,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = "0123456789ABCDEF!@#$%&*<>",
  className = "",
  parentClassName = "",
  encryptedClassName = "text-[#d4fc50]/50 font-mono",
  animateOn = "hover",
  clickMode = "once",
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(animateOn !== "click");

  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  const availableChars = useMemo(() => {
    return useOriginalCharsOnly
      ? Array.from(new Set(text.split(""))).filter((char) => char !== " ")
      : characters.split("");
  }, [useOriginalCharsOnly, text, characters]);

  const shuffleText = useCallback(
    (originalText, currentRevealed) => {
      return originalText
        .split("")
        .map((char, i) => {
          if (char === " " || char === "$" || char === ".") return char;
          if (currentRevealed.has(i)) return originalText[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join("");
    },
    [availableChars]
  );

  const triggerDecrypt = useCallback(() => {
    setRevealedIndices(new Set());
    setIsAnimating(true);
  }, []);

  useEffect(() => {
    if (!isAnimating) return;

    let iteration = 0;
    intervalRef.current = setInterval(() => {
      iteration++;
      setRevealedIndices((prev) => {
        const next = new Set(prev);
        const countToAdd = Math.max(1, Math.floor(text.length / maxIterations));
        for (let i = 0; i < countToAdd; i++) {
          next.add(next.size);
        }
        setDisplayText(shuffleText(text, next));

        if (next.size >= text.length || iteration >= maxIterations) {
          clearInterval(intervalRef.current);
          setIsAnimating(false);
          setIsDecrypted(true);
          setDisplayText(text);
        }
        return next;
      });
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [isAnimating, text, speed, maxIterations, shuffleText]);

  useEffect(() => {
    if (animateOn !== "view" && animateOn !== "inViewHover") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            triggerDecrypt();
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [animateOn, hasAnimated, triggerDecrypt]);

  const handleMouseEnter = () => {
    if (animateOn === "hover" || animateOn === "inViewHover") {
      triggerDecrypt();
    }
  };

  return (
    <motion.span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap cursor-pointer select-none ${parentClassName}`}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      <span aria-hidden="true">
        {displayText.split("").map((char, index) => {
          const isRevealed = revealedIndices.has(index) || (!isAnimating && isDecrypted);
          return (
            <span key={index} className={isRevealed ? className : encryptedClassName}>
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}
