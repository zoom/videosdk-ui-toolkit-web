#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const sourceDir = join(__dirname, '..', 'skills');

// Each supported AI tool loads skills from its own directory. We install the
// same skill tree into whichever targets the user selects.
const targets = [
  { tool: 'claude', label: 'Claude Code', dir: join('.claude', 'skills') },
  { tool: 'cursor', label: 'Cursor', dir: join('.cursor', 'skills') },
  { tool: 'codex', label: 'Codex', dir: join('.agents', 'skills') },
];

const flags = process.argv
  .slice(2)
  .filter((arg) => arg.startsWith('--'))
  .map((arg) => arg.slice(2));
const unknown = flags.filter((flag) => !targets.some((target) => target.tool === flag));
if (unknown.length > 0) {
  console.error(`Error: unknown option(s): ${unknown.map((flag) => `--${flag}`).join(', ')}`);
  console.error(`Usage: uitoolkit-skill-setup [${targets.map((target) => `--${target.tool}`).join('] [')}]`);
  process.exit(1);
}

// No flags means install to every supported tool; flags narrow to a subset.
const selected = flags.length === 0 ? targets : targets.filter((target) => flags.includes(target.tool));

if (!existsSync(sourceDir)) {
  console.error('Error: skills directory not found in this package.');
  process.exit(1);
}

const skills = readdirSync(sourceDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

if (skills.length === 0) {
  console.log('No skills found to install.');
  process.exit(0);
}

for (const target of selected) {
  const targetDir = join(process.cwd(), target.dir);
  mkdirSync(targetDir, { recursive: true });

  console.log(`\n${target.label} → ${targetDir}`);
  for (const skill of skills) {
    const skillSource = join(sourceDir, skill);
    const skillTarget = join(targetDir, skill);
    const alreadyExists = existsSync(skillTarget);

    rmSync(skillTarget, { recursive: true, force: true });
    cpSync(skillSource, skillTarget, { recursive: true });
    console.log(`  ${alreadyExists ? '↺ Replaced' : '✓ Installed'} skill: ${skill}`);
  }
}

console.log('\nSkills ready. Restart your AI tool(s) to activate them.');
