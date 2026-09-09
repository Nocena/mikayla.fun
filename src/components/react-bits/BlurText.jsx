import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";

const BlurText = ({
  text = "",
  delay = 120,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  active = true,
  onAnimationComplete,
}) => {
  const elements = useMemo(() => {
    return animateBy === "words" ? text.split(" ") : text.split("");
  }, [text, animateBy]);

  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  const shouldAnimate = inView && active;

  const defaultFrom = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(12px)", opacity: 0, y: -25 }
        : { filter: "blur(12px)", opacity: 0, y: 25 },
    [direction]
  );

  const defaultTo = useMemo(
    () => ({
      filter: "blur(0px)",
      opacity: 1,
      y: 0,
    }),
    []
  );

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {elements.map((segment, index) => {
        return (
          <motion.span
            key={`${segment}-${index}`}
            initial={defaultFrom}
            animate={shouldAnimate ? defaultTo : defaultFrom}
            transition={{
              duration: 0.5,
              delay: (index * delay) / 1000,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
            className="inline-block will-change-[transform,filter,opacity]"
          >
            {segment === " " ? "\u00A0" : segment}
            {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
          </motion.span>
        );
      })}
    </span>
  );
};

export default BlurText;
