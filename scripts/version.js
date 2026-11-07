import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = resolve(fileURLToPath(import.meta.url), '..', '..');
const SEMVER = /^\d+\.\d+\.\d+$/;
const BUMP_TYPES = ['patch', 'minor', 'major'];
const USAGE = 'Usage: node scripts/version.js <sync | check | bump <patch|minor|major|X.Y.Z>>';

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

function readWorkspacePatterns() {
  const lines = readFileSync(join(ROOT_DIR, 'pnpm-workspace.yaml'), 'utf8').split('\n');
  const patterns = [];
  let inPackages = false;
  for (const line of lines) {
    if (/^packages:\s*$/.test(line)) {
      inPackages = true;
    } else if (inPackages && /^\s*-\s*/.test(line)) {
      patterns.push(
        line
          .replace(/^\s*-\s*/, '')
          .trim()
          .replace(/^['"]|['"]$/g, ''),
      );
    } else if (inPackages && line.trim() !== '') {
      inPackages = false;
    }
  }
  return patterns;
}

function expandPattern(pattern) {
  if (!pattern.endsWith('/*')) {
    throw new Error(`Unsupported workspace pattern: ${pattern}`);
  }
  const parent = join(ROOT_DIR, pattern.slice(0, -2));
  if (!existsSync(parent)) return [];
  return readdirSync(parent, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(parent, entry.name, 'package.json'))
    .filter((file) => existsSync(file));
}

function findWorkspaceManifests() {
  return readWorkspacePatterns().flatMap(expandPattern);
}

const rootManifest = () => join(ROOT_DIR, 'package.json');
const displayPath = (file) => relative(ROOT_DIR, file);

function setVersion(file, version) {
  const data = readJson(file);
  data.version = version;
  writeJson(file, data);
}

function sync() {
  const version = readJson(rootManifest()).version;
  for (const file of findWorkspaceManifests()) setVersion(file, version);
  console.log(`Synced workspace packages to ${version}`);
}

function check() {
  const expected = readJson(rootManifest()).version;
  const mismatches = findWorkspaceManifests()
    .map((file) => ({ file, actual: readJson(file).version }))
    .filter(({ actual }) => actual !== expected);
  if (mismatches.length === 0) {
    console.log(`All package versions match ${expected}`);
    return;
  }
  for (const { file, actual } of mismatches) {
    console.error(`${displayPath(file)}: ${actual} (expected ${expected})`);
  }
  console.error('Run "pnpm version:sync" to fix.');
  process.exit(1);
}

function computeNextVersion(current, arg) {
  if (!SEMVER.test(current)) {
    throw new Error(`Root version "${current}" is not plain X.Y.Z`);
  }
  if (SEMVER.test(arg)) return arg;
  if (!BUMP_TYPES.includes(arg)) {
    throw new Error(`Invalid bump argument "${arg}"`);
  }
  const [major, minor, patch] = current.split('.').map(Number);
  if (arg === 'major') return `${major + 1}.0.0`;
  if (arg === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

const git = (args, options = {}) =>
  execFileSync('git', args, { cwd: ROOT_DIR, stdio: 'inherit', ...options });

function tagExists(tag) {
  try {
    git(['rev-parse', '--verify', '--quiet', `refs/tags/${tag}`], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function bump(arg) {
  const next = computeNextVersion(readJson(rootManifest()).version, arg);
  const tag = `v${next}`;
  if (tagExists(tag)) {
    throw new Error(`Tag ${tag} already exists`);
  }
  const files = [rootManifest(), ...findWorkspaceManifests()];
  for (const file of files) setVersion(file, next);
  git(['commit', '-m', `chore: bump version to ${next}`, '--', ...files.map(displayPath)]);
  git(['tag', '-a', tag, '-m', tag]);
}

function main(command, arg) {
  if (command === 'sync') return sync();
  if (command === 'check') return check();
  if (command === 'bump' && arg) return bump(arg);
  console.error(USAGE);
  process.exit(1);
}

try {
  main(process.argv[2], process.argv[3]);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
