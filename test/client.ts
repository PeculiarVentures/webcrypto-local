import * as client from "@webcrypto-local/client";
import { SERVER_ADDRESS } from "./config";

context("WebCrypto Socket", () => {

  const ws = new client.SocketProvider({ storage: new client.MemoryStorage() });

  before((done) => {
    ws.connect(SERVER_ADDRESS, { rejectUnauthorized: false })
      .on("listening", () => {
        done();
      })
      .on("error", (err) => {
        console.error(err);
      });
  });

  after((done) => {
    ws.on("close", () => {
      console.log("WS: Close");
      done();
    });
    ws.close();
  });

  it("Get info", async () => {
    if (!(await ws.isLoggedIn())) {
      await ws.login();
    }

    const info = await ws.info();
    console.log(info);
  });

});
