import * as fs from "fs";
import { LocalServer } from "../../local";
const EventLogger = require("node-windows").EventLogger;

const log = new EventLogger("Hello world");

const server = new LocalServer();


server.listen("localhost:8080")
    .on("listening", (e: any) => {
        console.log(`${e.address}`);
        log.info(`${e.address}`);
        log.info(`USER PROFILE: ${process.env["USERPROFILE"]}`);
        fs.writeFileSync("C:/tmp/log.md", `$User profile: {process.env["USERPROFILE"]}\n`);
    })
    .on("error", (e: Error) => {
        console.error(e);
        log.error(e.message + "\n" + e.stack);
    })
    .on("close", (e: any) => {
        log.info(`Close: ${e.remoteAddress}`);
        console.log("Close:", e.remoteAddress);
    });
