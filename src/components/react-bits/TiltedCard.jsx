import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const springConfig = { damping: 25, stiffness: 120, mass: 0.8 };

export default function TiltedCard({
  children,
  className = "",
  containerClassName = "",
  scaleOnHover = 1.03,
  rotateAmplitude = 12,
  glare = true,
  onClick,
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], [rotateAmplitude, -rotateAmplitude]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], [-rotateAmplitude, rotateAmplitude]),
    springConfig
  );

  const glareX = useTransform(mouseX, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [0, 1], ["0%", "100%"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div
      className={`perspective-[1000px] ${containerClassName}`}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: isHovered ? scaleOnHover : 1,
        }}
        transition={{ duration: 0.25 }}
        className={`relative will-change-transform ${className}`}
      >
        {children}

        {glare && isHovered && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden mix-blend-overlay opacity-30"
            style={{
              background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.8) 0%, rgba(212,252,80,0.2) 40%, transparent 80%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
