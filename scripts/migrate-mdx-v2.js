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

  const defaultImports = new Set([
    "import ProjectAchievements from '@/lib/components/ProjectAchievements';",
    "import ProjectLightbox from '@/lib/components/ProjectLightbox';",
    "import ProjectTechStack from '@/lib/components/ProjectTechStack';"
  ]);

  if (scriptMatch) {
    const scriptBody = scriptMatch[1];
    // Find all imports in the Svelte script block
    const importRegex = /import\s+([a-zA-Z0-9_{},\s]+)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(scriptBody)) !== null) {
      const compName = match[1].trim();
      let importPath = match[2];
      
      // Convert Svelte path aliases to Next.js
      if (importPath.startsWith('$lib/')) {
        importPath = importPath.replace('$lib/', '@/lib/');
      }
      
      // Remove Svelte extensions if any
      importPath = importPath.replace(/\.svelte$/, '');

      // Avoid adding already defined default imports
      const newImport = `import ${compName} from '${importPath}';`;
      
      // Filter out redundant/duplicate base imports
      if (!compName.includes('ProjectAchievements') && 
          !compName.includes('ProjectLightbox') && 
          !compName.includes('ProjectTechStack')) {
        defaultImports.add(newImport);
      }
    }

    const mdxImports = Array.from(defaultImports).join('\n');
    content = content.replace(scriptRegex, mdxImports);
  } else {
    const frontmatterEnd = content.indexOf('---', 4);
    if (frontmatterEnd !== -1) {
      const insertionIndex = frontmatterEnd + 3;
      content = content.slice(0, insertionIndex) + '\n\n' + Array.from(defaultImports).join('\n') + content.slice(insertionIndex);
    }
  }

  // 2. Normalize and convert React-incompatible shorthand attributes
  // Convert techStack={metadata.techStack} -> techStack={props.metadata.techStack}
  content = content.replace(/techStack=\{metadata\.techStack\}/g, 'techStack={props.metadata.techStack}');

  // Convert locale={locale} -> locale={props.locale}
  content = content.replace(/locale=\{locale\}/g, 'locale={props.locale}');

  // Convert shorthand {locale} -> locale={props.locale}
  content = content.replace(/\s+\{locale\}/g, ' locale={props.locale}');

  // Convert shorthand {metadata} -> metadata={props.metadata}
  content = content.replace(/\s+\{metadata\}/g, ' metadata={props.metadata}');
  content = content.replace(/metadata=\{metadata\}/g, 'metadata={props.metadata}');

  // 3. Ensure destination directory exists
  const destProjectDir = path.dirname(mdxPath);
  if (!fs.existsSync(destProjectDir)) {
    fs.mkdirSync(destProjectDir, { recursive: true });
  }

  fs.writeFileSync(mdxPath, content, 'utf8');
  console.log(`Migrated v2: ${svxPath} -> ${mdxPath}`);
}

projects.forEach(project => {
  langs.forEach(lang => {
    migrateFile(project, lang);
  });
});
