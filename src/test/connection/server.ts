import { Server } from "../../connection/server";
import { ResultProto } from "../../core";

(async () => {

    const server = new Server();

    server.listen("localhost:8081")
        .on("listening", (e) => {
            console.log("Listening");
        })
        .on("error", (e) => {
            console.error(e.error);
        })
        .on("message", (e) => {
            console.error(e.message.action);

            e.resolve(new ResultProto(e.message));
        })
        .on("disconnect", (e) => {
            console.log("Close");
        });

})();
