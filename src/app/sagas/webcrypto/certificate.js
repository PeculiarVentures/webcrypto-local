import { ws } from '../../controllers/webcrypto_socket';

export function* getCrypto(providerId) {
  try {
    const info = yield ws.info();
    const provider = info.providers[providerId];
    const crypto = yield ws.getCrypto(provider.id);
    const isLoggedIn = yield crypto.isLoggedIn();
    if (!isLoggedIn) {
      yield crypto.login();
    }
    return crypto;
  } catch (error) {
    console.log(error);
  }
  return false;
}

export function* getCertificates(providerId = 0) {
  const crypto = yield getCrypto(providerId);
  if (crypto) {
    return yield crypto.certStorage.keys();
  }
  return [];
}

export function* getCertificate({ providerId = 0, certId }) {
  const crypto = yield getCrypto(providerId);
  if (crypto) {
    try {
      return yield crypto.certStorage.getItem(certId);
    } catch (error) {
      console.log(error);
    }
  }
  return false;
}
