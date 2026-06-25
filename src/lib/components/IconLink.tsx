import React from "react";

import styles from "./IconLink.module.css";

interface Props {
  href: string;
  title: string;
  ariaLabel?: string;
  children: React.ReactNode;
  type?: "github" | "linkedin" | "normal";
  className?: string;
}

export default function IconLink({
  href,
  title,
  ariaLabel,
  children,
  type = "normal",
  className = "",
}: Props) {
  const rel = type === "github" ? "external noopener noreferrer" : "noopener noreferrer";
  const typeClass = styles[type] || "";
  const combinedClass = `${styles["icon-link"]} ${typeClass} ${className}`.trim();

  return (
    <a
      href={href}
      target="_blank"
      rel={rel}
      className={combinedClass}
      title={title}
      aria-label={ariaLabel || title}
    >
      {children}
    </a>
  );
}
