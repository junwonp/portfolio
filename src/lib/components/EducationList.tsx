import React from "react";

import type { EducationProps } from "@/lib/types/about";

import styles from "./EducationList.module.css";
import Period from "./Period";

interface Props {
  education: EducationProps[];
}

export default function EducationList({ education }: Props) {
  return (
    <div className={styles["education-list"]}>
      {education.map((item) => (
        <div className={styles.item} key={item.school}>
          <div className={styles.info}>
            <h3 className={styles.school}>{item.school}</h3>
            {item.major && <p className={styles.major}>{item.major}</p>}
          </div>
          <div className={styles["date-wrapper"]}>
            <Period dateFrom={item.dateFrom} dateTo={item.dateTo} />
          </div>
        </div>
      ))}
    </div>
  );
}
