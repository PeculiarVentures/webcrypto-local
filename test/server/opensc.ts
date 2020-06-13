import { OpenSC } from "@webcrypto-local/server/src/opensc";
import * as assert from "assert";

context.only("OpenSC", () => {
  const opensc = new OpenSC("/Users/microshine/github/pv/fortify/node_modules/electron/dist/Electron.app/Contents/MacOS/opensc-pkcs11.so");
  opensc.open();

  const reader = "Yubico Yubikey NEO OTP+U2F+CCID";
  it("indexOf", () => {
    const index = opensc.indexOf(reader);
    assert.equal(index, 0);
  });

  it("crypto", async () => {
    const crypto = opensc.crypto(reader);
    if (!crypto) {
      assert.fail("Crypto is empty");
    }
    const keys = await crypto.certStorage.keys();
    assert.equal(keys.length > 0, true);
  });

});
