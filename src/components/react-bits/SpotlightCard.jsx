import React, { useRef, useState } from "react";

const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(212, 252, 80, 0.12)",
  onClick,
}) => {
  const divRef = useRef(null);
  const rectRef = useRef(null);
  const rafIdRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseEnter = () => {
    if (divRef.current) {
      rectRef.current = divRef.current.getBoundingClientRect();
    }
    setOpacity(0.7);
  };

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused || rafIdRef.current) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    rafIdRef.current = requestAnimationFrame(() => {
      if (!rectRef.current && divRef.current) {
        rectRef.current = divRef.current.getBoundingClientRect();
      }
      if (rectRef.current) {
        setPosition({
          x: clientX - rectRef.current.left,
          y: clientY - rectRef.current.top,
        });
      }
      rafIdRef.current = null;
    });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.7);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    rectRef.current = null;
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative rounded-3xl border border-white/10 bg-[#0a0c0a]/90 md:bg-[#0a0c0a]/85 overflow-hidden transition-all duration-300 hover:border-white/20 backdrop-blur-sm md:backdrop-blur-xl ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out z-0 hidden sm:block"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};

export default SpotlightCard;
