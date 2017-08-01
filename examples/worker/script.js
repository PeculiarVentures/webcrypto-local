// @ts-check

// @ts-ignore
var ws = new WebcryptoSocket.SocketProvider();

ws.connect("localhost:31337")
    .on("error", (e) => {
        console.error(e.error);
    })
    .on("listening", (e) => {
        ws.isLoggedIn()
            .then((ok) => {
                // if login = false, show pin notify
                if (!ok) {
                    ws.challenge()
                        .then((pin) => {
                            document.writeln(pin);
                        });
                    return ws.login();
                }
                return false;
            })
            .then(() => {
                console.info("UI::WebcryptoSocket:Started");
                return ws.info()
                    .then(function (info) {
                        // Get provider by index 0 (OpenSSL)
                        var provider = info.providers[0];
                        return ws.getCrypto(provider.id);
                    })
                    .then(function (crypto) {
                        var worker = new Worker("worker.js");

                        worker.addEventListener("message", function (e) {
                            console.log("Script::Message:", e);
                        });
                    });
            })
            .catch((err) => {
                console.error(err);
            })
    })
    .on("token", (info) => {
        if (info.error) {
            console.error(info.error);
        } else {
            ws.info()
                .then((wcInfo) => {
                    console.info("UI::Token event:", wcInfo);
                });
        }
    })
    .on("close", (e) => {
        console.info("close");
    });


