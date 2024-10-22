// src/components/ui/badge.jsx
import React from "react";

const Badge = ({ children, variant = "default", className = "", ...props }) => {
  const baseStyles =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    default: "bg-gray-100 text-gray-900",
    outline: "text-gray-900 border border-gray-200",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};

export { Badge };
