import { setEngine } from "2key-ratchet";
import { Crypto } from "@peculiar/webcrypto";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { inspect } from "util";
import * as server from "@webcrypto-local/server";

async function main() {
  // disable TLS certificate validation
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  // Set crypto engine for 2key-ratchet
  // App uses old version of @peculiar/webcrypto, because that version allows to save keys for 2key-ratchet
  setEngine("WebCrypto NodeJS", new Crypto() as unknown as globalThis.Crypto);

  const platform = os.platform();
  const FORTIFY_DATA_DIR = path.join(os.homedir(), ".fortify");
  const APP_DATA_DIR = platform === "win32"
    ? path.join(process.env.ProgramData!, "Fortify")
    : path.join(os.homedir(), ".fortify");
  const CERT_FILE = path.join(APP_DATA_DIR, "cert.pem");
  const KEY_FILE = path.join(APP_DATA_DIR, "cert.key");

  const pvpkcs11: string[] = [];
  let opensc: string | undefined;
  const providers: any[] = require(path.join(FORTIFY_DATA_DIR, "config.json")).providers;
  switch (platform) {
    case "win32":
      pvpkcs11.push(path.join(__dirname, "../utils/pvpkcs11.dll"));
      opensc = path.join(__dirname, "../utils/opensc/opensc-pkcs11.dll");
      break;
    case "darwin":
      pvpkcs11.push(path.join(__dirname, "../utils/libpvpkcs11.dylib"));
      opensc = path.join(__dirname, "../utils/opensc/opensc-pkcs11.so");
      break;
    case "linux":
    default:
    // nothing
  }

  const options: server.IServerOptions = {
    cert: fs.readFileSync(CERT_FILE),
    key: fs.readFileSync(KEY_FILE),
    storage: new server.MemoryStorage(),
    config: {
      cardConfigPath: path.join(__dirname, "..", "packages", "cards", "lib", "card.json"),
      pvpkcs11,
      opensc,
      providers,
      cards: [
        // {
        //   atr: Buffer.from("3b8b015275746f6b656e20445320c1", "hex"),
        //   name: "custom",
        //   libraries: ["/tmp/some/lib/pkcs11.dylib"],
        //   readOnly: false,
        // },
      ],
    },
  };

  new server.LocalServer(options)
    .listen("127.0.0.1:31337")
    .on("listening", (e: any) => {
      console.log("Started at 127.0.0.1:31337");
    })
    .on("info", (level, source, message, data) => {
      if (data) {
        console.log(`${level.padEnd(7)}[${source}] ${message}`, inspect(data, false, 5, true));
      } else {
        console.log(`${level.padEnd(7)}[${source}] ${message}`);
      }
    })
    .on("token_new", (card) => {
      console.log("New token:", card);
    })
    .on("identity_changed", () => {
      console.log("Identity changed");
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
            case "SafeNet U:39sp85MY":
              p.resolve("39sp85MY");
              break;
            case "My slot 0":
              p.resolve("12345");
              break;
            case "Rutoken U:12345678 A:87654321":
              p.resolve("12345678");
              break;
            default:
              p.resolve("12345678");
              break;
            // throw new Error("Unknown token");
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
