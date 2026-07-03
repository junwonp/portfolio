import { skillsShared } from "@/lib/data/skills";

const orderMap = new Map<string, number>();
let index = 0;
for (const category of skillsShared) {
  for (const skill of category.list) {
    orderMap.set(skill, index++);
  }
}

export function sortSkills(skills: string[]): string[] {
  return [...skills].sort((a, b) => {
    const orderA = orderMap.get(a) ?? 999;
    const orderB = orderMap.get(b) ?? 999;
    return orderA - orderB;
  });
}
