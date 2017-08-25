const Browser = {
  IE: 'IE',
  Safari: 'Safari',
  Edge: 'Edge',
  Chrome: 'Chrome',
  Firefox: 'Firefox',
};

/**
 * Detect browser name
 * @returns {string} - browser name
 */
export default function browserInfo() {
  const userAgent = window.navigator.userAgent;

  switch (true) {
    case (/edge\/([\d\.]+)/i.test(userAgent)):
      return Browser.Edge;
    case (/msie/i.test(userAgent)):
      return Browser.IE;
    case (/Trident/i.test(userAgent)):
      return Browser.IE;
    case (/chrome/i.test(userAgent)):
      return Browser.Chrome;
    case (/safari/i.test(userAgent)):
      return Browser.Safari;
    case (/firefox/i.test(userAgent)):
      return Browser.Firefox;
    default:
      console.log('UNKNOWN BROWSER');
      return '';
  }
}
