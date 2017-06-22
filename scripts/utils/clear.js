import sh from 'sh';
import os from 'os';
import chalk from 'chalk';
import { OUTPUT_PATH } from '../config';
const exec = require('child_process').exec;

let clear;
if (os.type() === "Windows_NT") {
  clear = () => {
    return new Promise((resolve, reject) => {
      exec(`RD /S /Q ${OUTPUT_PATH}`, (error, stdout, stderr) => {
        resolve();
      })
    })
      .then(() => {
        console.log(chalk.blue('> Build cleared successfully.'));
      });
  }
} else {
  clear = () => sh(`rm -rf ${OUTPUT_PATH}`).then(() => {
    console.log(chalk.blue('> Build cleared successfully.'));
  });
}

export default clear;
