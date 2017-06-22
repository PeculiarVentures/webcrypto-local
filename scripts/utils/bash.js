import { exec } from 'child_process';

const print = require('./print')('bash');

export default function sh(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        print.error(err);
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}
