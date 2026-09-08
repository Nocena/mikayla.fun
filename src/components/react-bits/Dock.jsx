import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function DockItem({
  children,
  className = "",
  onClick,
  mouseY,
  spring = { mass: 0.1, stiffness: 160, damping: 14 },
  distance = 120,
  magnification = 52,
  baseItemSize = 38,
  label,
}) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseDistance = useTransform(mouseY, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      y: 0,
      height: baseItemSize,
    };
    return val - (rect.y + window.scrollY) - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  return (
    <div className="relative flex items-center justify-center">
      {/* Tooltip to the left */}
      {isHovered && label && (
        <motion.div
          initial={{ opacity: 0, x: 8, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 8, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute right-[calc(100%+14px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border border-white/15 bg-[#090b09]/95 px-3 py-1.5 text-xs font-mono text-white shadow-2xl pointer-events-none z-50 backdrop-blur-2xl flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4fc50]" />
          <span>{label}</span>
          <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-[#090b09]/95" />
        </motion.div>
      )}

      <motion.button
        ref={ref}
        style={{
          width: size,
          height: size,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        className={`relative inline-flex items-center justify-center rounded-full bg-white/[0.04] hover:bg-[#d4fc50] text-white hover:text-black border border-white/10 hover:border-[#d4fc50] transition-colors duration-200 shadow-md group ${className}`}
        aria-label={typeof label === "string" ? label : undefined}
      >
        <div className="flex items-center justify-center w-full h-full text-sm group-hover:scale-110 transition-transform">
          {children}
        </div>
      </motion.button>
    </div>
  );
}

export default function Dock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 160, damping: 14 },
  magnification = 50,
  distance = 120,
  baseItemSize = 38,
}) {
  const mouseY = useMotionValue(Infinity);

  return (
    <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 select-none hidden md:block">
      <motion.div
        onMouseMove={(e) => mouseY.set(e.pageY)}
        onMouseLeave={() => mouseY.set(Infinity)}
        className={`flex flex-col items-center gap-2 p-2 rounded-full bg-[#070907]/80 border border-white/10 backdrop-blur-2xl shadow-2xl shadow-black/80 hover:border-[#d4fc50]/30 transition-colors ${className}`}
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseY={mouseY}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            label={item.label}
          >
            {item.icon}
          </DockItem>
        ))}
      </motion.div>
    </div>
  );
}
