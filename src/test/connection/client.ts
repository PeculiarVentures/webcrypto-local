import { Client } from "../../connection/client";
import { ActionProto } from "../../core";

(async () => {

    const client = new Client();

    client.connect("127.0.0.1:8081")
        .on("listening", (e) => {
            console.log("Listening");

            const action = new ActionProto();
            client.send(action)
                .then(() => {
                    return client.send(action);
                });
        })
        .on("error", (e) => {
            console.error(e.error);
        })
        .on("closed", (e) => {
            console.log("Close");
        });

})();
