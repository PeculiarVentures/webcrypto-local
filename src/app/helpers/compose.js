/* eslint prefer-rest-params: 0 */
export default function () {
  return (state, payload) => {
    let _s = state;
    for (const f of arguments) {
      _s = f(_s, payload);
    }
    return _s;
  };
}
