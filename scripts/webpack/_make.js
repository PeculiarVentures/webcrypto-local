import developmentConfig from './config.development';
import productionConfig from './config.production';
import basicConfig from './config.basic';

export default (mode) => {
  const config = basicConfig(mode);

  if (mode === 'development') {
    developmentConfig.plugins.map(plugin => (
      config.plugins.push(plugin)
    ));
    developmentConfig.module.loaders.map(loader => (
      config.module.loaders.push(loader)
    ));
    config.devtool = developmentConfig.devtool;
    config.entry = developmentConfig.entry;
  } else if (mode === 'production') {
    productionConfig.plugins.map(plugin => (
      config.plugins.push(plugin)
    ));
    productionConfig.module.loaders.map(loader => (
      config.module.loaders.push(loader)
    ));
    config.devtool = productionConfig.devtool;
    config.entry = productionConfig.entry;
  }

  return config;
};
