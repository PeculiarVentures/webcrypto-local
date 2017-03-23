import sh from 'sh';

const print = require('./print')('test');

export default function runTests(list) {
  const handler = (p) => {
    sh(`mocha --require scripts/utils/jsdom.js --compilers js:babel-core/register ${p}`)
      .then((result) => {
        print.log('#########################################');
        print.log(p);
        print.log(result.stdout);
      }).catch((err) => {
        print.error(err);
      });
  };

  list.map(handler);
}
