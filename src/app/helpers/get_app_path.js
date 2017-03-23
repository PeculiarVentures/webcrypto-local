export default function getAppPath() {
  const href = window.location.href;

  if (href.indexOf('github.io') !== -1) {
    return '/webcrypto-local/'
  }
  return '/';
};
