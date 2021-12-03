import { promises } from 'fs';
import { posix } from 'path';

interface AngularJson {
  projects: {
    'gb-grocery': {
      root: string;
      sourceRoot: string;
    };
  };
}

promises.readFile('angular.json').then((buff) => {
  const ngProj = JSON.parse(buff.toString()) as AngularJson;

  const gbg = ngProj.projects['gb-grocery'];
  const envFile = posix.join(
    gbg.root,
    gbg.sourceRoot,
    'environments/environment.prod.ts'
  );

  promises
    .readFile(envFile + '.template')
    .then((c) => {
      const stampedEnv = c
        .toString()
        .replace('{{ buildStamp }}', new Date().toISOString());
      promises.writeFile(envFile, stampedEnv).then(() => {
        console.log(`${envFile} updated`);
      });
    })
    .catch((c) => console.error(c));
});
