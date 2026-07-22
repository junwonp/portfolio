import React from "react";

import * as styles from "./SectionHeader.css";

interface Props {
  title: string;
}

export default function SectionHeader({ title }: Props) {
  return (
    <div className={`section-header ${styles.sectionHeader}`}>
      <h2>{title}</h2>
    </div>
  );
}
