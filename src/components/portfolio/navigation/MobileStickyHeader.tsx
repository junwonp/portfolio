import * as styles from "./MobileStickyHeader.css";
import MobileStickyHeaderActions from "./MobileStickyHeaderActions";

interface Props {
  githubLink?: string;
  linkedinLink?: string;
  name: string;
}

export default function MobileStickyHeader({
  githubLink,
  linkedinLink,
  name,
}: Props) {
  return (
    <header className={styles.stickyHeader} aria-label="Quick navigation header">
      <MobileStickyHeaderActions
        githubLink={githubLink}
        linkedinLink={linkedinLink}
        name={name}
      />
    </header>
  );
}
