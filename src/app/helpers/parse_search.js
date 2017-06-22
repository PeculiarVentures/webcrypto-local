export default function parseSearch(path) {
  const result = {};

  if (path) {
    const params = window.decodeURIComponent(path).split('?');
    if (params.length === 2) {
      params[1].split('&').map((item) => {
        const parts = item.split('=');
        if (parts[0] in result) {
          if (typeof result[parts[0]] === 'object' && Array.isArray([])) {
            result[parts[0]].push(parts[1]);
          } else {
            result[parts[0]] = [result[parts[0]]];
            result[parts[0]].push(parts[1]);
          }
        } else {
          result[parts[0]] = parts[1];
        }
        return true;
      });
    }
  }

  return result;
}
