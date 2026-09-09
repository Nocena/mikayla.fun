import React from "react";

const ShinyText = ({
  text,
  disabled = false,
  speed = 2.4,
  className = "",
  color = "#b5b5b5",
  shineColor = "#d4fc50",
  spread = 120,
  pauseOnHover = false,
}) => {
  const gradientStyle = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: disabled ? "none" : `shiny-text ${speed}s linear infinite`,
  };

  return (
    <span
      className={`inline-block ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""} ${className}`}
      style={gradientStyle}
    >
      {text}
    </span>
  );
};

export default ShinyText;
