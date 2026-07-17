import React from "react";

import styles from "./SectionHeader.module.css";

interface Props {
  title: string;
}

export default function SectionHeader({ title }: Props) {
  return (
    <div className={styles["section-header"]}>
      <h2>{title}</h2>
    </div>
  );
}
