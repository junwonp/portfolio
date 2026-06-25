import React from "react";

import type { TextPart } from "@/lib/utils/markdown";

interface Props {
  parts: TextPart[];
}

export default function RichText({ parts }: Props) {
  return (
    <>
      {parts.map((part, i) => {
        if (part.type === "bold") {
          return <strong key={i}>{part.text}</strong>;
        }
        if (part.type === "code") {
          return <code key={i}>{part.text}</code>;
        }
        return <React.Fragment key={i}>{part.text}</React.Fragment>;
      })}
    </>
  );
}
