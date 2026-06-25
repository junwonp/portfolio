const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../../svelte-version/src/lib/content/projects');
const destDir = path.resolve(__dirname, '../src/lib/content/projects');

const projects = [
  'agentic-workflow',
  'aira',
  'camerafi-studio',
  'election-aggregator',
  'mnd-excel-viewer',
  'oneline-bank',
  'sveltekit-portfolio',
  'today-weather'
];

const langs = ['en', 'ko'];

function migrateFile(project, lang) {
  const svxPath = path.join(srcDir, project, `detail.${lang}.svx`);
  const mdxPath = path.join(destDir, project, `detail.${lang}.mdx`);

  if (!fs.existsSync(svxPath)) {
    console.log(`File not found: ${svxPath}`);
    return;
  }

  let content = fs.readFileSync(svxPath, 'utf8');

  // 1. Remove Svelte script block and prepare MDX imports
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/i;
  const scriptMatch = content.match(scriptRegex);

  const mdxImports = [
    "import ProjectAchievements from '@/lib/components/ProjectAchievements';",
    "import ProjectLightbox from '@/lib/components/ProjectLightbox';",
    "import ProjectTechStack from '@/lib/components/ProjectTechStack';"
  ].join('\n');

  if (scriptMatch) {
    // Replace script block with react MDX imports
    content = content.replace(scriptRegex, mdxImports);
  } else {
    // If no script block, prepend imports after frontmatter
    const frontmatterEnd = content.indexOf('---', 4);
    if (frontmatterEnd !== -1) {
      const insertionIndex = frontmatterEnd + 3;
      content = content.slice(0, insertionIndex) + '\n\n' + mdxImports + content.slice(insertionIndex);
    }
  }

  // 2. Convert component prop bindings
  // e.g. <ProjectTechStack techStack={metadata.techStack} {locale} />
  // -> <ProjectTechStack techStack={props.metadata.techStack} locale={props.locale} />
  content = content.replace(
    /<ProjectTechStack\s+techStack=\{metadata\.techStack\}\s+\{locale\}\s*\/>/g,
    '<ProjectTechStack techStack={props.metadata.techStack} locale={props.locale} />'
  );
  
  content = content.replace(
    /<ProjectTechStack\s+techStack=\{metadata\.techStack\}\s+locale=\{locale\}\s*\/>/g,
    '<ProjectTechStack techStack={props.metadata.techStack} locale={props.locale} />'
  );

  // 3. Ensure destination directory exists
  const destProjectDir = path.dirname(mdxPath);
  if (!fs.existsSync(destProjectDir)) {
    fs.mkdirSync(destProjectDir, { recursive: true });
  }

  fs.writeFileSync(mdxPath, content, 'utf8');
  console.log(`Migrated: ${svxPath} -> ${mdxPath}`);
}

projects.forEach(project => {
  langs.forEach(lang => {
    migrateFile(project, lang);
  });
});
