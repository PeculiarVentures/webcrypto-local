import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { IServerOptions } from "../../../index";
import { LocalServer } from "../../local";

const APP_DATA_DIR = path.join(os.homedir(), ".fortify");
const CERT_FILE = path.join(APP_DATA_DIR, "cert.pem");
const KEY_FILE = path.join(APP_DATA_DIR, "key.pem");

const SERVER_ADDRESS = "127.0.0.1:31337";

const options: IServerOptions = {
    cert: fs.readFileSync(CERT_FILE),
    key: fs.readFileSync(KEY_FILE),
    config: {
        // cards: path.join(__dirname, "..", "..", "..", ".fortify", "card.json"),
        cards: path.join(os.homedir(), ".fortify", "card.json"),
        providers: [
            { lib: "/usr/local/lib/softhsm/libsofthsm2.so", slots: [0] },
        ],
    },
};
const server = new LocalServer(options);

server.listen(SERVER_ADDRESS)
    .on("listening", (e: any) => {
        console.log(`${e}`);
    })
    .on("info", (msg) => {
        console.log(msg);
    })
    .on("token_new", (card) => {
        console.log("New token:", card);
    })
    .on("token_error", (err) => {
        console.log("Token error:", err);
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
                console.log(p);
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
