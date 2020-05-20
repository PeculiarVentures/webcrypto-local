module.exports = {
  mode: 'modules',
  out: 'docs',
  exclude: [
    '**/node_modules/**',
    '**/*.spec.ts',
    '**/scripts/**',
    '**/test/**',
  ],
  name: 'webcrypto-local',
  excludePrivate: true,
  excludeNotExported: true,
};
