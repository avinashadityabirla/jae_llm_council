function Card({
  children,
  title,
  subtitle,
  action,
  className = "",
  padding = "md",
}) {
  const paddings = { sm: "p-4", md: "p-6", lg: "p-8" };

  return (
    <div className={`card ${paddings[padding]} ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-neutral-900">
                {title}
              </h3>
            )}

            {subtitle && (
              <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>
            )}
          </div>

          {action && <div>{action}</div>}
        </div>
      )}

      {children}
    </div>
  );
}

export default Card;
