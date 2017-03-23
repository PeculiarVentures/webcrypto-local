// Compile environment must be the first call
import compileEnvironment from './compileEnvironment';
import { URL } from './config';
import { clear, bundle } from './utils';
import makeConfig from './webpack/_make';
// import runTest from './utils/test';
import runServer from './server';

const print = require('./utils/print')('run');

const MODE = process.env.NODE_ENV;
const CONFIG = makeConfig(MODE);
const CLEAR = process.argv.includes('--clear');
const TEST = process.argv.includes('--test');

if (CLEAR || TEST) {
  if (CLEAR) {
    clear();
  }

  if (TEST) {
    // runTest(TESTS_LIST);
  }
} else {
  if (MODE === 'production') {
    clear().then(() => bundle(CONFIG)).then(() => {
      runServer(MODE, CONFIG).then((result) => {
        print.log(`> ${result}`);
        print.log(`> Production Server Running on - ${URL}`);
        print.log('>');
        print.log('>');
      });
    });
  }

  if (MODE === 'development') {
    clear();
    runServer(MODE, CONFIG).then(() => {
      print.log(`> Development Server Running on - ${URL}`);
    });
  }

  if (MODE === 'server') {
    runServer(MODE, CONFIG).then((result) => {
      print.log(`> ${result}`);
      print.log(`> Production Server Running on - ${URL}`);
      print.log('>');
      print.log('>');
    });
  }

  if (MODE === 'build') {
    clear().then(() => bundle(CONFIG));
  }
}
