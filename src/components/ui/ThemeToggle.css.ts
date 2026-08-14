import { style } from "@vanilla-extract/css";

// Bare minimum — hosts pass their own surface style as className
export const toggle = style({
  alignItems: "center",
  background: "transparent",
  border: "none",
  color: "var(--color-sub)",
  cursor: "pointer",
  display: "inline-flex",
  fontFamily: "inherit",
  justifyContent: "center",
  transition: "background-color 0.15s, color 0.15s, transform 0.1s",

  ":hover": {
    color: "var(--color-bold)",
  },

  ":active": {
    transform: "scale(0.9)",
  },
});
