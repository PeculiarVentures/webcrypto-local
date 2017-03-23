import sh from 'sh';
import { OUTPUT_PATH } from '../config';

const print = require('./print')('clear');

export default () => sh(`rm -rf ${OUTPUT_PATH}`).then(() => {
  print.log('Build cleared succesfully.');
});
