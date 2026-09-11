import Period from '@/components/ui/Period';
import type { EducationProps } from '@/lib/portfolio/homeTypes';

import * as styles from './EducationList.css';

interface Props {
  education: EducationProps[];
}

export default function EducationList({ education }: Props) {
  return (
    <ul className={styles.educationList}>
      {education.map((item) => (
        <li className={styles.item} key={item.school}>
          <div className={styles.info}>
            <h3 className={styles.school}>{item.school}</h3>
            {item.major && <p className={styles.major}>{item.major}</p>}
          </div>
          <div className={styles.dateWrapper}>
            <Period dateFrom={item.dateFrom} dateTo={item.dateTo} />
          </div>
        </li>
      ))}
    </ul>
  );
}
