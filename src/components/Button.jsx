import ButtonSvg from "../assets/svg/ButtonSvg";

const Button = ({ className, href, onClick, children, px, white }) => {
  const classes = `button relative inline-flex items-center justify-center h-11 transition-colors hover:text-color-1 ${
    px || "px-7"
  } ${white ? "text-n-8" : "text-n-1"} ${className || ""}`;
  const spanClasses = "relative z-10";

  const renderButton = () => (
    <div className="relative inline-block group">
      {/* Enhanced gradient glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-color-1 via-color-2 to-color-3 rounded-lg opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
      
      <button className={classes} onClick={onClick}>
        <span className={spanClasses}>{children}</span>
        {ButtonSvg(white)}
      </button>
    </div>
  );

  const renderLink = () => (
    <div className="relative inline-block group">
      {/* Enhanced gradient glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-color-1 via-color-2 to-color-3 rounded-lg opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
      
      <a href={href} className={classes}>
        <span className={spanClasses}>{children}</span>
        {ButtonSvg(white)}
      </a>
    </div>
  );

  return href ? renderLink() : renderButton();
};

export default Button;