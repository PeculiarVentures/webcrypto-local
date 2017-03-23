/* eslint-disable */
if (!Object.prototype.omit) {
  Object.defineProperty(Object.prototype, 'omit', {

    writable: true,
    value(arr) {
      let args;

      if (!Array.isArray(arr)) {
        args = Array.prototype.slice.call(arguments);
      } else {
        args = arr;
      }

      const result = {};
      const keys = Object.keys(this);

      for (let i = keys.length - 1; i >= 0; i -= 1) {
        const k = keys[i];

        if (args.indexOf(k) === -1) {
          result[k] = this[k];
        }
      }

      return result;
    },

  });
}

if (!Object.prototype.pluck) {
  Object.defineProperty(Object.prototype, 'pluck', {

    writable: false,
    value() {
      const result = {};

      for (let i = 0; i < arguments.length; i += 1) {
        const k = arguments[i];

        if (this[k] !== undefined) {
          result[k] = this[k];
        }
      }

      return result;
    },

  });
}
