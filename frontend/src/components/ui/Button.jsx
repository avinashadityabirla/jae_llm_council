function Button({
  children,

  variant = "primary",

  size = "md",

  onClick,

  disabled,

  icon,

  className = "",

  type = "button",
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-abc-red text-white hover:bg-abc-red-hover shadow-sm",

    secondary:
      "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50",

    success: "bg-success text-white hover:opacity-90 shadow-sm",

    danger: "bg-danger text-white hover:opacity-90 shadow-sm",

    info: "bg-info text-white hover:opacity-90 shadow-sm",

    purple: "bg-purple-600 text-white hover:opacity-90 shadow-sm",

    ghost: "text-neutral-600 hover:bg-neutral-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",

    md: "px-4 py-2 text-sm",

    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span>{icon}</span>}

      {children}
    </button>
  );
}

export default Button;
