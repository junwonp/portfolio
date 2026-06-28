import styles from "./MobileStickyHeader.module.css";
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
    <header className={styles["sticky-header"]} aria-label="Quick navigation header">
      <MobileStickyHeaderActions
        githubLink={githubLink}
        linkedinLink={linkedinLink}
        name={name}
      />
    </header>
  );
}
