import Link from 'next/link';

import * as styles from './not-found.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.description}>페이지를 찾을 수 없습니다.</p>
      <Link href="/" className={styles.homeLink}>
        홈으로 돌아가기
      </Link>
    </div>
  );
}
