#!/usr/bin/env node
// Pre-commit privacy gate: keeps secrets, secret-bearing files, and PII-shaped
// fixtures out of the repository. Only staged content is scanned, so the check
// stays fast enough to run on every commit.
//
// Suppress a single finding with a `privacy-gate:allow` comment on that line.

import { execFileSync } from 'node:child_process';

const ALLOW_MARKER = 'privacy-gate:allow';

// Paths that must never be committed.
const BLOCKED_PATH_PREFIXES = ['.wrangler/'];
const BLOCKED_PATH_SUFFIXES = ['.jks', '.key', '.p12', '.pem', '.pfx', '.ppk'];
const BLOCKED_PATH_BASENAMES = [
  'auth.json',
  'credentials.json',
  'id_dsa',
  'id_ecdsa',
  'id_ed25519',
  'id_rsa',
  'service-account.json',
];
const BLOCKED_PATH_PATTERNS = [/^\.dev\.vars(?:\.|$)/, /^\.env(?:\.|$)/];

// Template files exist precisely to be committed without secrets. The content
// patterns below still scan them, so a real key pasted into one is still caught.
const PATH_TEMPLATE_SUFFIXES = ['.example', '.sample', '.template'];

// Provider credentials. Deliberately high-confidence so ordinary code never trips.
const SECRET_PATTERNS = [
  { label: 'private key block', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { label: 'OpenAI API key', re: /\bsk-(?:proj-|ant-)?[A-Za-z0-9_-]{20,}/ },
  { label: 'GitHub token', re: /\b(?:gh[pousr]|github_pat)_[A-Za-z0-9_]{20,}/ },
  { label: 'AWS access key id', re: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/ },
  { label: 'Google API key', re: /\bAIza[0-9A-Za-z_-]{35}\b/ },
  { label: 'Slack token', re: /\bxox[baprs]-[A-Za-z0-9-]{10,}/ },
  { label: 'Stripe live key', re: /\b[rs]k_live_[A-Za-z0-9]{20,}/ },
];

// Cloudflare identifiers belong in the wrangler configs and nowhere else.
// Matches JSON (`"account_id": "…"`), JS/TS (`account_id: '…'`), and env
// (`CF_ACCOUNT_ID=…`) spellings; only hex/dash values count, so references like
// `account_id: process.env.CF_ACCOUNT_ID` stay clean.
const INFRA_KEY_RE =
  /\b([A-Z_]*?(?:ACCOUNT_ID|DATABASE_ID|NAMESPACE_ID|CF_ACCESS_AUD))\b['"]?\s*[:=]\s*['"]?([0-9a-fA-F][0-9a-fA-F-]{15,})/gi;
const INFRA_CONFIG_FILES = new Set(['wrangler.jsonc', 'wrangler.preview.jsonc']);
// Only a wholly-zero value counts as a placeholder: a real id may merely start
// with zeros (Cloudflare AUD tags often do). Accepts both the bare and the
// UUID-shaped all-zero forms.
const INFRA_PLACEHOLDER_RE = /^(?:0+(?:-0+)*$|REPLACE|CHANGE_?ME|<|\$\{)/i;

// Fixtures must use reserved documentation values, never real ones.
const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)\b/g;
const FIXTURE_PATH_RE =
  /(?:\.(?:test|spec)\.[cm]?[jt]sx?$|__tests__\/|\/fixtures?\/|\/mocks?\/|(?:^|\/)seed)/;
const DOC_EMAIL_DOMAINS = new Set(['example.com', 'example.net', 'example.org']);
const DOC_TLDS = ['.example', '.invalid', '.localhost', '.test'];

// Reported but never blocking.
const WARNING_PATTERNS = [
  { label: 'JWT-shaped string', re: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\./ },
  { label: 'SQL INSERT (possible data dump)', pathRe: /\.sql$/, re: /\bINSERT\s+INTO\b/i },
];

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

function stagedPaths() {
  return git(['diff', '--cached', '--name-only', '--diff-filter=ACM', '-z'])
    .split('\0')
    .filter(Boolean);
}

function stagedContent(path) {
  try {
    return git(['show', `:${path}`]);
  } catch {
    // Unmerged or already-deleted entries have no index blob to read.
    return null;
  }
}

function blockedPathReason(path) {
  const base = path.split('/').pop() ?? path;
  if (PATH_TEMPLATE_SUFFIXES.some((suffix) => base.endsWith(suffix))) return null;
  if (BLOCKED_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))) return 'secret-bearing path';
  if (BLOCKED_PATH_PATTERNS.some((re) => re.test(base))) return 'secret-bearing path';
  if (BLOCKED_PATH_SUFFIXES.some((suffix) => base.endsWith(suffix))) return 'secret-bearing path';
  if (BLOCKED_PATH_BASENAMES.includes(base)) return 'secret-bearing path';
  return null;
}

// Never echo a matched value back: the report itself must not leak the secret.
function mask(value) {
  return `${value.slice(0, 6)}…[redacted]`;
}

function scanLine(findings, path, lineNumber, line) {
  const base = path.split('/').pop() ?? path;

  for (const { label, re } of SECRET_PATTERNS) {
    const match = line.match(re);
    if (match) {
      findings.push({ detail: mask(match[0]), label, line: lineNumber, path, severity: 'block' });
    }
  }

  const isInfraConfig = INFRA_CONFIG_FILES.has(base);
  for (const match of line.matchAll(INFRA_KEY_RE)) {
    if (INFRA_PLACEHOLDER_RE.test(match[2])) continue;
    if (isInfraConfig) {
      findings.push({
        detail: mask(match[2]),
        label: 'real Cloudflare id committed — placeholderize before sharing a copy',
        line: lineNumber,
        path,
        severity: 'warn',
      });
      continue;
    }
    findings.push({
      detail: mask(match[2]),
      label: `Cloudflare ${match[1]} outside the wrangler config`,
      line: lineNumber,
      path,
      severity: 'block',
    });
  }

  if (FIXTURE_PATH_RE.test(path)) {
    for (const match of line.matchAll(EMAIL_RE)) {
      const domain = match[1].toLowerCase();
      if (DOC_EMAIL_DOMAINS.has(domain)) continue;
      if (DOC_TLDS.some((tld) => domain.endsWith(tld))) continue;
      findings.push({
        detail: mask(match[0]),
        label: 'non-documentation email in a fixture',
        line: lineNumber,
        path,
        severity: 'block',
      });
    }
  }

  for (const { label, re, pathRe } of WARNING_PATTERNS) {
    if (pathRe && !pathRe.test(path)) continue;
    const match = line.match(re);
    if (match) {
      findings.push({ detail: mask(match[0]), label, line: lineNumber, path, severity: 'warn' });
    }
  }
}

function collectFindings() {
  const findings = [];

  for (const path of stagedPaths()) {
    const pathReason = blockedPathReason(path);
    if (pathReason) {
      findings.push({ detail: path, label: pathReason, line: 0, path, severity: 'block' });
      continue;
    }

    const content = stagedContent(path);
    if (content === null || content.includes('\0')) continue;

    const lines = content.split('\n');
    for (const [index, line] of lines.entries()) {
      if (line.includes(ALLOW_MARKER)) continue;
      scanLine(findings, path, index + 1, line);
    }
  }

  return findings;
}

function format(finding) {
  const location = finding.line > 0 ? `${finding.path}:${finding.line}` : finding.path;
  const tag = finding.severity === 'block' ? 'BLOCK' : 'WARN ';
  return `  ${tag}  ${location}  ${finding.label}\n         ${finding.detail}`;
}

function main() {
  const findings = collectFindings();
  const blocking = findings.filter((finding) => finding.severity === 'block');
  const warnings = findings.filter((finding) => finding.severity === 'warn');

  if (findings.length === 0) {
    console.log('privacy-gate: clean');
    return 0;
  }

  console.log('privacy-gate: findings\n');
  for (const finding of [...blocking, ...warnings]) {
    console.log(format(finding));
  }

  if (warnings.length > 0) {
    console.log(`\n${warnings.length} warning(s), not blocking.`);
  }

  if (blocking.length === 0) {
    console.log('No blocking findings.');
    return 0;
  }

  console.log(
    `\n${blocking.length} blocking finding(s). Fix them, or add a \`${ALLOW_MARKER}\` comment on the offending line to confirm a false positive.`,
  );
  return 1;
}

process.exit(main());
