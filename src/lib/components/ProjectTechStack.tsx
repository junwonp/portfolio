import ReadonlySkillChip from "@/lib/components/ReadonlySkillChip";
import { getProjectTechStackGroups } from "@/lib/content/projects/techStack";
import type { Language } from "@/lib/utils/language";

import styles from "./ProjectTechStack.module.css";

interface Props {
  techStack: string[];
  locale: Language;
}

export default function ProjectTechStack({ techStack, locale }: Props) {
  const techStackByCategory = getProjectTechStackGroups(techStack, locale);

  return (
    <div className={styles["project-tech-stack"]}>
      <div className={styles["tech-category-grid"]}>
        {techStackByCategory.map((group) => (
          <div key={group.id} className={styles["tech-category"]}>
            <span className={styles["category-title"]}>{group.title}</span>
            <div className={styles["tech-grid"]}>
              {group.skills.map((tech) => (
                <ReadonlySkillChip key={tech} skill={tech} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
