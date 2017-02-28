import { LocalServer } from "../../local";

const server = new LocalServer();

server.listen("127.0.0.1:8080")
    .on("listening", (e) => {
        console.log(`${e.address}`);
    })
    .on("close", (e) => {
        console.log("Close:", e.remoteAddress);
    });
