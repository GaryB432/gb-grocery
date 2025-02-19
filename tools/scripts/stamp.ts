import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const projectKey = 'gb-grocery';

interface AngularJson {
  projects: {
    [projectKey]: {
      root: string;
      sourceRoot: string;
    };
  };
}

const ngProj = JSON.parse(readFileSync('angular.json', 'utf-8')) as AngularJson;

const gbg = ngProj.projects[projectKey];
const envFile = join(
  gbg.root,
  gbg.sourceRoot,
  'environments',
  'environment.prod.ts'
);

const stamp = new Date().toISOString();
const stampedEnv = readFileSync(envFile.concat('.template'), 'utf-8')
  .replace('{{ buildRef }}', process.env['GITHUB_REF_NAME'] ?? 'N/A')
  .replace('{{ buildStamp }}', stamp);

writeFileSync(envFile, stampedEnv);

console.log(`${envFile} updated: `);
console.log(`${process.env['GITHUB_HEAD_REF'] ?? 'N/A'} updated`);
