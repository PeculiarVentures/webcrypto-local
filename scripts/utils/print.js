import chalk from 'chalk';

class Print {
  constructor(prefix) {
    this.prefix = prefix ? `${prefix}:` : '>';
  }
  log(message) {
    console.log(this.prefix, chalk.green(message));
  }
  error(message) {
    console.log(this.prefix, chalk.red(message));
  }
}

const initialFunction = p => (
  new Print(p)
);

module.exports = initialFunction;
