export type ProjectDetailsMode = 'compact' | 'full';

export const shouldForceProjectContentOpen = (
  detailsMode: ProjectDetailsMode | undefined,
): boolean => detailsMode === 'compact';

export const shouldRenderProjectDetails = (
  detailsMode: ProjectDetailsMode | undefined,
  detail: string[],
  hasDetailLink: boolean,
): boolean => detail.length > 0 && (detailsMode !== 'compact' || !hasDetailLink);
