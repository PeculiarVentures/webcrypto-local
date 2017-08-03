import * as fs from "fs";
import * as https from "https";
import { Notification } from "../../core/notification";
import { LocalServer } from "../../local";

const options: https.ServerOptions = {
    cert: fs.readFileSync("/tmp/cert.pem"),
    key: fs.readFileSync("/tmp/key.pem"),
};
const server = new LocalServer(options);

server.listen("localhost:31337")
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
