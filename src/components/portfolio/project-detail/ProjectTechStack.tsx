import ReadonlySkillChip from "@/components/ui/ReadonlySkillChip";
import { getProjectTechStackGroups } from "@/lib/portfolio/techStack";
import type { Language } from "@/lib/utils/language";

import * as styles from "./ProjectTechStack.css";

interface Props {
  techStack: string[];
  locale: Language;
}

export default function ProjectTechStack({ techStack, locale }: Props) {
  const techStackByCategory = getProjectTechStackGroups(techStack, locale);

  return (
    <div className={styles.projectTechStack}>
      <div className={styles.techCategoryGrid}>
        {techStackByCategory.map((group) => (
          <div key={group.id} className={styles.techCategory}>
            <span className={styles.categoryTitle}>{group.title}</span>
            <div className={styles.techGrid}>
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
