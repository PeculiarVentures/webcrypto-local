import downloadURI from './download_uri';

export default function downloadCertificate(name, value) {
  const fileName = `${name}.cer`;
  const key = `data:application/pkix-cert;charset=utf-8,${encodeURIComponent(value)}`;
  downloadURI(key, fileName);
}
