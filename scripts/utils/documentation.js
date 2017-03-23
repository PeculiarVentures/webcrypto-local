import sh from 'sh';

const print = require('./print')('documentation');

export default function documentation() {
  sh('rm -rf documentation').then(() => {
    sh('jsdoc -c config/jsdoc/config.json').then((result) => {
      print.log(result.stdout);
    }).catch((err) => {
      print.error(err);
    });

    print.log('Documentation generated succesfully.');
  });
}
