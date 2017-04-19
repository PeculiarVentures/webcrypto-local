import downloadURI from './download_uri';

export default function downloadCertFromURI(name, value, type, binary) {
  const extension = type === 'certificate' ? 'cer' : 'req';
  const mimetype = type === 'certificate' ? 'application/pkix-cert' : 'application/pkcs10';
  const fileName = `${name}.${extension}`;
  let key = '';

  if (binary) {
    const blob = new Blob(value, { type: mimetype });
    key = window.URL.createObjectURL(blob);
  } else {
    key = `data:${mimetype};charset=utf-8,${encodeURIComponent(value)}`;
  }

  downloadURI(key, fileName);
  window.URL.revokeObjectURL(key);
}
