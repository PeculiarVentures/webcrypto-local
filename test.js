// @ts-check
const { WebCrypto } = require("node-webcrypto-p11");

const config = {
  library: "/usr/local/lib/softhsm/libsofthsm2.so",
  name: "SoftHSM v2.0",
  slot: 0,
  readWrite: true,
  pin: "12345"
};
const data = new Buffer("You signed data");
const alg = { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" };
const signature = new Buffer("signature"); // :)

const crypto = new WebCrypto(config);

crypto.certStorage.keys()
  .then((indexes) => {
    // each index has template <type>-<handle>-<hash(spki)>
    const certID = indexes[0]; // take you cert
    return crypto.certStorage.getItem(certID, alg, ["verify"]);
  })
  .then((cert) => {
    console.log("Certificate:", cert.subjectName);
    // certificate contains publicKey, you can use it for signature verification
    return crypto.subtle.verify(alg, cert.publicKey, signature, data);
  })
  .then((ok) => {
    console.log("Verification:", ok);
  })
  .catch((err) => {
    console.error(err);
  });

  /*
  eToken 51xx – eTPKCS11.dll
  CardOS Smartcard - siecap11.dll
  AET Smartcard - aetpkss1.dll
  ML830 Smartcard - axaltocm.dll
  ML840 Smartcard - axaltocm.dll
  */