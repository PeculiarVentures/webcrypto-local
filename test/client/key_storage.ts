import * as client from "@webcrypto-local/client";
import * as assert from "assert";
import { PROVIDER_NAME, SERVER_ADDRESS } from "../config";

context("WebCrypto Socket", () => {

  context("Key storage", () => {

    const ws = new client.SocketProvider({ storage: new client.MemoryStorage() });
    let crypto: client.SocketCrypto;

    const RSA_S256_ALG: RsaHashedKeyGenParams = {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-1",
      publicExponent: new Uint8Array([1, 0, 1]),
      modulusLength: 2048,
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

      crypto = await ws.getCrypto(providers[0].id);
      if (!(await crypto.isLoggedIn())) {
        await crypto.login();
      }
    });

    it("clear", async () => {
      await crypto.keyStorage.clear();
      const keys = await crypto.keyStorage.keys();
      assert.equal(keys.length, 0);
    });

    it("set/get", async () => {
      const keys = await crypto.subtle.generateKey(RSA_S256_ALG, false, ["sign", "verify"]);

      // set
      const privateKeyIndex = await crypto.keyStorage.setItem(keys.privateKey);
      assert.equal(!!privateKeyIndex, true);
      const publicKeyIndex = await crypto.keyStorage.setItem(keys.publicKey);
      assert.equal(!!publicKeyIndex, true);

      const indexes = await crypto.keyStorage.keys();
      assert.equal(indexes.length, 2);
      assert.equal(indexes.includes(privateKeyIndex), true);
      assert.equal(indexes.includes(publicKeyIndex), true);

      // get
      const privateKey = await crypto.keyStorage.getItem(privateKeyIndex);
      assert.equal(privateKey.type, "private");
      assert.equal(privateKey.algorithm.name, "RSASSA-PKCS1-v1_5"); // default
      assert.equal((privateKey.algorithm as RsaHashedKeyAlgorithm).hash.name, "SHA-256"); // default

      // change algorithm
      const publicKey = await crypto.keyStorage.getItem(publicKeyIndex, { name: "RSA-PSS", hash: "SHA-1" } as RsaHashedImportParams, true, ["verify"]);
      assert.equal(publicKey.type, "public");
      assert.equal(publicKey.algorithm.name, "RSA-PSS");
      assert.equal((publicKey.algorithm as RsaHashedKeyAlgorithm).hash.name, "SHA-1");
    });

    it("removeItem", async () => {
      const keys = await crypto.subtle.generateKey(RSA_S256_ALG, false, ["sign", "verify"]);

      // set
      const index = await crypto.keyStorage.setItem(keys.privateKey);
      await crypto.keyStorage.setItem(keys.publicKey);

      let indexes = await crypto.keyStorage.keys();
      const beforeAmount = indexes.length;
      assert.equal(indexes.length > 0, true);

      // remove
      await crypto.keyStorage.removeItem(index);

      indexes = await crypto.keyStorage.keys();
      assert.equal(indexes.length, beforeAmount - 1);
      assert.equal(indexes.includes(index), false);
    });

    it("hasItem", async () => {
      const keys = await crypto.subtle.generateKey(RSA_S256_ALG, false, ["sign", "verify"]);

      const index = await crypto.keyStorage.setItem(keys.privateKey);
      const privateKey = await crypto.keyStorage.getItem(index);

      assert.equal(await crypto.keyStorage.hasItem(keys.privateKey), false);
      assert.equal(await crypto.keyStorage.hasItem(privateKey), true);
    });

    it("indexOf", async () => {
      const keys = await crypto.subtle.generateKey(RSA_S256_ALG, false, ["sign", "verify"]);

      const index = await crypto.keyStorage.setItem(keys.privateKey);
      const privateKey = await crypto.keyStorage.getItem(index);

      assert.equal(await crypto.keyStorage.indexOf(keys.privateKey), null);
      assert.equal(await crypto.keyStorage.indexOf(privateKey), index);
    });

  });
});
