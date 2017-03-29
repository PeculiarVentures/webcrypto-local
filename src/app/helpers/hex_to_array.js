export default function HexToArray(hexString) {
  const res = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    const c = hexString.slice(i, i + 2);
    res[i / 2] = parseInt(c, 16);
  }
  return res.buffer;
}
