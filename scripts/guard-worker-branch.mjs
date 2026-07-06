const VALID_TARGETS = new Set(['production', 'development'])

const target = process.argv[2]
const branch = process.env.WORKERS_CI_BRANCH
const isWorkersBuild = process.env.WORKERS_CI === '1' || process.env.WORKERS_CI === 'true'

if (!VALID_TARGETS.has(target)) {
  console.error('Usage: node scripts/guard-worker-branch.mjs <production|development>')
  process.exit(1)
}

if (!branch) {
  if (isWorkersBuild) {
    console.error('Refusing deploy from Workers Builds because WORKERS_CI_BRANCH is not set.')
    process.exit(1)
  }

  process.exit(0)
}

if (target === 'production' && branch !== 'main') {
  console.error(`Refusing production deploy from ${branch}. Production deploys must come from main.`)
  process.exit(1)
}

if (target === 'development' && branch !== 'develop') {
  console.error(`Refusing development deploy from ${branch}. Development deploys must come from develop.`)
  process.exit(1)
}
