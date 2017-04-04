import downloadURI from './download_uri';

export default function downloadCertFromURI(name, value) {
  const fileName = `${name}.csr`;
  const key = `data:application/pkcs10;charset=utf-8,${encodeURIComponent(value)}`;
  downloadURI(key, fileName);
}
