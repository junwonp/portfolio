'use client';

import { useEffect } from 'react';

import { projectNavLinks } from '@/lib/stores/bottomNav';

interface ProjectDetailClientEffectsProps {
  githubLink?: string;
  productLink?: string;
}

export default function ProjectDetailClientEffects({
  githubLink,
  productLink,
}: ProjectDetailClientEffectsProps) {
  useEffect(() => {
    projectNavLinks.set({
      githubLink,
      productLink,
    });

    return () => {
      projectNavLinks.set(null);
    };
  }, [githubLink, productLink]);

  return null;
}
