import downloadURI from './download_uri';

export default function downloadCertFromURI(name, value, type) {
  const extension = type === 'certificate' ? 'cer' : 'req';
  const mimetype = type === 'certificate' ? 'application/pkix-cert' : 'application/pkcs10';
  const fileName = `${name}.${extension}`;
  const key = `data:${mimetype};charset=utf-8,${encodeURIComponent(value)}`;
  downloadURI(key, fileName);
}
