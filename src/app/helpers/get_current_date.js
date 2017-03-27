export default function getCurrentDate() {
  const now = new Date();

  const yyyy = now.getFullYear();
  let mm = now.getMonth() + 1;
  if (mm.toString().length === 1) {
    mm = `0${mm}`;
  }
  let dd = now.getDate();
  if (dd.length === 1) {
    dd = `0${dd}`;
  }

  return `${yyyy}-${mm}-${dd}`;
}
