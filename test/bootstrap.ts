import { setEngine } from "2key-ratchet";
import { Crypto } from "@peculiar/webcrypto";
import * as server from "@webcrypto-local/server";
import * as fs from "fs";
import * as https from "https";
import * as os from "os";
import * as path from "path";
import { SERVER_ADDRESS } from "./config";

// Set crypto engine for 2key-ratchet
setEngine("WebCrypto NodeJS", new Crypto());

const APP_DATA_DIR = path.join(os.homedir(), ".fortify");
const CERT_FILE = path.join(APP_DATA_DIR, "cert.pem");
const KEY_FILE = path.join(APP_DATA_DIR, "key.pem");
const CA_FILE = path.join(APP_DATA_DIR, "ca.pem");
https.globalAgent.options.ca = fs.readFileSync(CA_FILE);

const options: server.IServerOptions = {
  cert: fs.readFileSync(CERT_FILE),
  key: fs.readFileSync(KEY_FILE),
  storage: new server.MemoryStorage(),
  config: {
    // cards: path.join(__dirname, "..", "..", "..", ".fortify", "card.json"),
    cards: "oops",
    providers: [
      { lib: "/usr/local/lib/softhsm/libsofthsm2.so", slots: [0], name: "Custom name" },
    ],
  },
};
const localServer = new server.LocalServer(options);

before(async () => {
  await new Promise((resolve, reject) => {
    localServer.listen(SERVER_ADDRESS)
      .on("listening", (e: any) => {
        resolve();
      })
      .on("info", (msg) => {
        console.log(msg);
      })
      .on("token_new", (card) => {
        console.log("New token:", card);
      })
      .on("error", (e: Error) => {
        console.error(e);
      })
      .on("notify", (p: any) => {
        console.log("Notify:", p.type);

        switch (p.type) {
          case "2key": {
            // auto approve all connections
            p.resolve(true);
            break;
          }
          case "pin": {
            // auto PIN for all token's
            p.resolve("12345");
            break;
          }
          default:
            throw new Error("Unknown type of notify");
        }
      })
      .on("close", (e: any) => {
        console.log("Close:", e.remoteAddress);
      });
  });
});

after(async () => {
  // localServer.close();
});
