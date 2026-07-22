import React from "react";
import Link from "next/link";

import { arrowLink, linkBgHoverVar, linkColorVar } from "./ArrowLink.css";

interface Props {
  href: string;
  label: string;
  className?: string;
  color?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  reload?: boolean;
}

const getVarName = (variable: string) => String(variable).replace(/^var\(|\)$/g, '');

export default function ArrowLink({
  href,
  label,
  className = "",
  color = "var(--color-primary)",
  target = "_self",
  reload = false,
}: Props) {
  const linkBgHover = color.includes("var(--cat-color)")
    ? `color-mix(in srgb, var(--cat-color) 10%, transparent)`
    : "var(--color-primary-transparent)";

  const inlineStyles = {
    [getVarName(linkColorVar)]: color,
    [getVarName(linkBgHoverVar)]: linkBgHover,
  } as React.CSSProperties;

  const rel = target === "_blank" ? "noopener noreferrer" : undefined;
  const combinedClass = `${arrowLink} ${className}`.trim();

  // Next.js Link handles internal routing, external or reload use direct standard anchor
  const isExternal = href.startsWith("http") || target === "_blank" || reload;

  if (isExternal) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={combinedClass}
        style={inlineStyles}
      >
        {label} →
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={combinedClass}
      style={inlineStyles}
    >
      {label} →
    </Link>
  );
}
