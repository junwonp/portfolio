import React from "react";

interface Props {
  text: string;
  color?: "primary" | "green" | "orange" | "sub" | "android" | "ios" | "macos" | "web";
  className?: string;
}

export default function Badge({ text, color, className = "" }: Props) {
  const getResolvedColor = () => {
    if (color) return color;
    const t = text.toLowerCase();
    if (t === "android") return "android";
    if (t === "ios") return "ios";
    if (t === "macos") return "macos";
    if (t === "web") return "web";
    if (t === "현재" || t === "present") return "green";
    if (/^\d{4}$/.test(text)) return "green";
    return "orange";
  };

  const resolvedColor = getResolvedColor();
  const combinedClass = `badge ${resolvedColor} ${className}`.trim();

  return <span className={combinedClass}>{text}</span>;
}
