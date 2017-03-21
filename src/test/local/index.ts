import { LocalServer } from "../../local";

const server = new LocalServer();

server.listen("127.0.0.1:8080")
    .on("listening", (e: any) => {
        console.log(`${e.address}`);
    })
    .on("error", (e: Error) => {
        console.error(e)
    })
    .on("close", (e: any) => {
        console.log("Close:", e.remoteAddress);
    });
