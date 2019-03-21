import * as client from "@webcrypto-local/client";
import * as assert from "assert";
import { Convert } from "pvtsutils";
import { PROVIDER_NAME, SERVER_ADDRESS } from "../config";

context("WebCrypto Socket", () => {

  context("Subtle", () => {

    const ws = new client.SocketProvider({ storage: new client.MemoryStorage() });
    let subtle: SubtleCrypto;

    const RSA_S256_ALG: RsaHashedKeyGenParams = {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
      publicExponent: new Uint8Array([1, 0, 1]),
      modulusLength: 2048,
    };
    const RSA_OAEP_SHA1_ALG: RsaHashedKeyGenParams & RsaOaepParams = {
      name: "RSA-OAEP",
      hash: "SHA-1",
      publicExponent: new Uint8Array([1, 0, 1]),
      modulusLength: 2048,
    };
    const ECDH_P256_ALG: EcKeyGenParams = {
      name: "ECDH",
      namedCurve: "P-256",
    };

    const AES_128_CBC: AesKeyAlgorithm & AesCbcParams = {
      name: "AES-CBC",
      length: 128,
      iv: new Uint8Array(16),
    };

    before((done) => {
      ws.connect(SERVER_ADDRESS, { rejectUnauthorized: false })
        .on("listening", () => {
          done();
        })
        .on("error", (err) => {
          console.error(err);
        });
    });

    before(async () => {
      const authorized = await ws.isLoggedIn();
      if (!authorized) {
        await ws.login();
      }
      const info = await ws.info();
      const providers = info.providers.filter((provider) => provider.name === PROVIDER_NAME);
      assert.equal(providers.length, 1, `Cannot get provider by name ${PROVIDER_NAME}`);

      const crypto = await ws.getCrypto(providers[0].id);
      if (!(await crypto.isLoggedIn())) {
        await crypto.login();
      }
      subtle = crypto.subtle;
    });

    it("digest", async () => {
      const res = await subtle.digest("sha-256", new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]));
      assert.equal(Convert.ToBase64(res), "monGjExeKLjEpVZ2c9Ri//UV20YRb5kAYk0JxHT1k/s=");
    });

    it("generateKey", async () => {
      const keys = await subtle.generateKey(RSA_S256_ALG, false, ["sign", "verify"]);
      assert.equal(!!keys.privateKey, true, "Private key is empty");
      assert.equal(!!keys.publicKey, true, "Public key is empty");
      assert.equal(keys.privateKey.extractable, false);
      assert.equal(keys.privateKey.type, "private");
      assert.equal(keys.privateKey.algorithm.name, RSA_S256_ALG.name);
      assert.deepEqual(keys.privateKey.usages, ["sign"]);
      assert.equal(keys.publicKey.extractable, true);
      assert.equal(keys.publicKey.type, "public");
      assert.equal(keys.publicKey.algorithm.name, RSA_S256_ALG.name);
      assert.deepEqual(keys.publicKey.usages, ["verify"]);
    });

    it("sign/verify", async () => {
      const data = new Uint8Array(10);
      const keys = await subtle.generateKey(RSA_S256_ALG, false, ["sign", "verify"]);
      const signature = await subtle.sign(RSA_S256_ALG, keys.privateKey, data);
      const ok = await subtle.verify(RSA_S256_ALG, keys.publicKey, signature, data);
      assert.equal(ok, true);
    });

    it("sign/verify 50mb", async () => {
      const data = new Uint8Array(50 * Math.pow(1024, 2));
      const keys = await subtle.generateKey(RSA_S256_ALG, false, ["sign", "verify"]);
      const signature = await subtle.sign(RSA_S256_ALG, keys.privateKey, data);
      const ok = await subtle.verify(RSA_S256_ALG, keys.publicKey, signature, data);
      assert.equal(ok, true);
    });

    context("encrypt/decrypt", () => {
      it("RSA-OAEP without label", async () => {
        const data = new Uint8Array(8);
        const keys = await subtle.generateKey(RSA_OAEP_SHA1_ALG, false, ["encrypt", "decrypt"]);
        const enc = await subtle.encrypt(RSA_OAEP_SHA1_ALG, keys.publicKey, data);
        const dec = await subtle.decrypt(RSA_OAEP_SHA1_ALG, keys.privateKey, enc);
        assert.equal(Convert.ToHex(dec), Convert.ToHex(data));
      });

      it("AES-128-CBC", async () => {
        const data = new Uint8Array(8);
        const key = await subtle.generateKey(AES_128_CBC, false, ["encrypt", "decrypt"]);
        const enc = await subtle.encrypt(AES_128_CBC, key, data);
        const dec = await subtle.decrypt(AES_128_CBC, key, enc);
        assert.equal(Convert.ToHex(dec), Convert.ToHex(data));
      });
    });

    it("wrap/unwrap", async () => {
      const key = await subtle.generateKey(AES_128_CBC, true, ["encrypt", "decrypt"]);
      const keys = await subtle.generateKey(RSA_OAEP_SHA1_ALG, false, ["wrapKey", "encrypt", "unwrapKey", "decrypt"]);
      const enc = await subtle.wrapKey("raw", key, keys.publicKey, RSA_OAEP_SHA1_ALG);
      const unwrappedKey = await subtle.unwrapKey("raw", enc, keys.privateKey, RSA_OAEP_SHA1_ALG, AES_128_CBC, false, ["encrypt", "decrypt"]);
      assert.equal(unwrappedKey.type, "secret");
    });

    context("export/import", () => {

      it("pkcs8", async () => {
        const keys = await subtle.generateKey(RSA_S256_ALG, true, ["sign", "verify"]);
        const pkcs8 = await subtle.exportKey("pkcs8", keys.privateKey);

        assert.equal(pkcs8.byteLength > 100, true);

        const importKey = await subtle.importKey("pkcs8", pkcs8, RSA_S256_ALG, false, ["sign"]);
        assert.equal(!!importKey, true);
      });

      it("spki", async () => {
        const keys = await subtle.generateKey(RSA_S256_ALG, true, ["sign", "verify"]);
        const spki = await subtle.exportKey("spki", keys.publicKey);

        assert.equal(spki.byteLength > 100, true);

        const importKey = await subtle.importKey("spki", spki, RSA_S256_ALG, false, ["verify"]);
        assert.equal(!!importKey, true);
      });

      it("raw", async () => {
        const key = await subtle.generateKey(AES_128_CBC, true, ["encrypt", "decrypt"]);
        const raw = await subtle.exportKey("raw", key);

        assert.equal(raw.byteLength, 16);

        const importKey = await subtle.importKey("raw", raw, AES_128_CBC, false, ["encrypt"]);
        assert.equal(!!importKey, true);
      });

      it("jwk", async () => {
        const key = await subtle.generateKey(AES_128_CBC, true, ["encrypt", "decrypt"]);
        const jwk = await subtle.exportKey("jwk", key);

        assert.equal(jwk.k.length, 22);

        const importKey = await subtle.importKey("jwk", jwk, AES_128_CBC, false, ["encrypt"]);
        assert.equal(!!importKey, true);
      });

    });

    it("derive bits", async () => {
      const keys = await subtle.generateKey(ECDH_P256_ALG, false, ["deriveBits", "deriveKey"]);
      const bits = await subtle.deriveBits({ ...ECDH_P256_ALG, public: keys.publicKey }, keys.privateKey, 128);
      assert.equal(bits.byteLength, 16);
    });

    it.only("derive key", async () => {
      const keys = await subtle.generateKey(ECDH_P256_ALG, false, ["deriveBits", "deriveKey"]);
      const key = await subtle.deriveKey({ ...ECDH_P256_ALG, public: keys.publicKey }, keys.privateKey, AES_128_CBC, false, ["encrypt"]);
      assert.equal(key.algorithm.name, AES_128_CBC.name);
    });

  });

});
