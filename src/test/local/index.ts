import * as fs from "fs";
import * as https from "https";
import * as os from "os";
import * as path from "path";
import { Notification } from "../../core/notification";
import { LocalServer } from "../../local";

const APP_DATA_DIR = path.join(os.homedir(), ".fortify");
const CERT_FILE = path.join(APP_DATA_DIR, "cert.pem");
const KEY_FILE = path.join(APP_DATA_DIR, "key.pem");

const SERVER_ADDRESS = "127.0.0.1:31337";

const options: https.ServerOptions = {
    cert: fs.readFileSync(CERT_FILE),
    key: fs.readFileSync(KEY_FILE),
};
const server = new LocalServer(options);

server.listen(SERVER_ADDRESS)
    .on("listening", (e: any) => {
        console.log(`${e}`);
    })
    .on("info", (msg) => {
        console.log(msg);
    })
    .on("error", (e: Error) => {
        console.error(e);
    })
    .on("notify", (p: any) => {
        console.log("Notify:", p.type);

        switch (p.type) {
            case "2key": {
                Notification.question(`Is it correct pin ${p.pin}?`)
                    .then(p.resolve, p.reject);
                break;
            }
            case "pin": {
                Notification.prompt("Enter PIN for PKCS#11 token: ")
                    .then(p.resolve, p.reject);
                break;
            }
            default:
                throw new Error("Unknown type of notify");
        }
    })
    .on("close", (e: any) => {
        console.log("Close:", e.remoteAddress);
    });
