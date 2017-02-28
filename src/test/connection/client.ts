import { Client } from "../../connection/client";
import { ActionProto } from "../../core";

(async () => {

    const client = new Client();

    client.connect("127.0.0.1:8081")
        .on("listening", (e) => {
            console.log("Listening");

            const action = new ActionProto();
            client.send("wow", action)
                .then(() => {
                    return client.send("Working", action);
                });
        })
        .on("error", (e) => {
            console.error(e.error);
        })
        .on("closed", (e) => {
            console.log("Close");
        });

})();
