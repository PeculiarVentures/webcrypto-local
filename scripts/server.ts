import { setEngine } from "2key-ratchet";
import { Crypto } from "@peculiar/webcrypto";
import * as server from "@webcrypto-local/server";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

async function main() {
  // disable TLS certificate validation
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  // Set crypto engine for 2key-ratchet
  setEngine("WebCrypto NodeJS", new Crypto());

  const APP_DATA_DIR = path.join(os.homedir(), ".fortify");
  const CERT_FILE = path.join(APP_DATA_DIR, "cert.pem");
  const KEY_FILE = path.join(APP_DATA_DIR, "key.pem");

  const options: server.IServerOptions = {
    cert: fs.readFileSync(CERT_FILE),
    key: fs.readFileSync(KEY_FILE),
    storage: new server.MemoryStorage(),
    config: {
      cardConfigPath: path.join(APP_DATA_DIR, "card.json"),
      pvpkcs11: [
        "/Users/microshine/Library/Developer/Xcode/DerivedData/config-hkruqzwffnciyjeujlpxkaxbdiun/Build/Products/Debug/libpvpkcs11.dylib",
      ],
      providers: [
        { lib: "/usr/local/lib/softhsm/libsofthsm2.so", slots: [0], name: "SoftHSM" },
      ],
      // pvpkcs11: [
      //   "/Users/microshine/github/pv/fortify/libpvpkcs11.dylib",
      // ],
      cards: [
        {
          atr: Buffer.from("3b8b015275746f6b656e20445320c1", "hex"),
          name: "custom",
          libraries: ["/tmp/some/lib/pkcs11.dylib"],
          readOnly: false,
        },
      ],
    },
  };

  new server.LocalServer(options)
    .listen("127.0.0.1:31337")
    .on("listening", (e: any) => {
      console.log("Started at 127.0.0.1:31337");
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
      switch (p.type) {
        case "2key": {
          // auto approve all connections
          p.resolve(true);
          break;
        }
        case "pin": {
          // auto PIN for all token's
          switch (p.label) {
            case "Rutoken U:12345678 A:87654321":
              p.resolve("12345678");
              break;
            case "SafeNet U:39sp85MY":
              p.resolve("39sp85MY");
              break;
            case "My slot 0":
              p.resolve("12345");
              break;
            default:
              throw new Error("Uknown token");
          }
          throw new Error("Oops");
          break;
        }
        default:
          throw new Error("Unknown type of notify");
      }
    })
    .on("close", (e: any) => {
      console.log("Close:", e.remoteAddress);
    });
}

main();
