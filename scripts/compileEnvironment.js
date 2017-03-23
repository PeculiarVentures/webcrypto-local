import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const debug = require('debug')('environment-compiler');

const compileEnviorment = () => {
  const ENV_FILE_PATH = path.resolve(process.env.ENV_FILE || './env/development');

  debug(`Reading configuration for '${ENV_FILE_PATH}'`);
  const rawConfig = fs.readFileSync(ENV_FILE_PATH);
  debug(`Finished reading configuration for '${ENV_FILE_PATH}'`);

  // Parse the raw file
  const configData = dotenv.parse(rawConfig);
  const configKeys = Object.keys(configData);
  debug(`Parsed configuration and got ${configKeys.length} keys...`);

  // Allow overriding env values through ENV vars
  const keysChanged = [];
  for (let i = 0; i <= configKeys.length; i += 1) {
    const k = configKeys[i];
    if (!process.env[k]) continue;
    keysChanged.push(k);
    configData[k] = process.env[k];
  }
  debug(`Updated ${keysChanged.length} keys with overridden values...`);

  // Update process.env with values also.
  for (let i = 0; i <= configKeys.length; i += 1) {
    process.env[configKeys[i]] = configData[configKeys[i]];
  }

  // Write the file so that the browser can read the compiled variables.
  const compiledDestination = path.resolve(__dirname, 'compiled_env.json');
  debug(`Writing config to ${compiledDestination}`);
  fs.writeFileSync(compiledDestination, JSON.stringify(configData, null, 2));

  debug('Finished compiling environment file!');
};

compileEnviorment();
