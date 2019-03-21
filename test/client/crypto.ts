import * as client from "@webcrypto-local/client";
import * as assert from "assert";
import { Convert } from "pvtsutils";
import { PROVIDER_NAME, SERVER_ADDRESS } from "../config";

context("WebCrypto Socket", () => {

  context("Client", () => {

    const ws = new client.SocketProvider({ storage: new client.MemoryStorage() });
    let crypto: client.SocketCrypto;

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
    });

    it("getRandomValues", () => {
      const data = new Uint8Array(10);
      const bytes = crypto.getRandomValues(data);
      assert.equal(Convert.ToHex(data), Convert.ToHex(bytes));
      assert.notEqual(Convert.ToHex(bytes), "00000000000000000000");
    });

  });

});
