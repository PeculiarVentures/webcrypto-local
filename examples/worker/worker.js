// @ts-check

importScripts(
    "http://cdn.rawgit.com/dcodeIO/protobuf.js/6.6.0/dist/protobuf.js",
    "http://cdn.rawgit.com/jakearchibald/idb/97e4e878/lib/idb.js",
    "../../dist/webcrypto-socket.js"
);

self.addEventListener("message", function (e) {
    console.info("Worker::Message:", e)
})

// @ts-ignore
var ws = new WebcryptoSocket.SocketProvider();

ws.connect("localhost:31337")
    .on("error", (e) => {
        console.error(e.error);
    })
    .on("listening", (e) => {
        ws.isLoggedIn()
            .then((ok) => {
                if (!ok) {
                    return ws.login();
                }
            })
            .then(() => {
                console.info("Worker::WebcryptoSocket:Started");
                return ws.info()
                    .then(function (info) {
                        // Get provider by index 0 (OpenSSL)
                        var provider = info.providers[0];
                        return ws.getCrypto(provider.id);
                    })
                    .then(function (crypto) {
                        AesCBC_EncryptData(crypto);
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
                    console.info("Worker::Token event:", wcInfo);
                });
        }
    })
    .on("close", (e) => {
        console.info("close");
    });

function AesCBC_EncryptData(wc) {
    console.info("Worker::AesCBC_EncryptData");
    var algorithm = { name: "AES-CBC", length: 256, iv: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6]) };
    return wc.subtle.generateKey(algorithm, false, ["encrypt", "decrypt"])
        .then(function (key) {
            return wc.subtle.encrypt(algorithm, key, new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]))
                .then(function (enc) {
                    console.info("Worker::Encrypted data:", new Uint8Array(enc));
                    return wc.subtle.decrypt(algorithm, key, enc);
                })
                .then(function (dec) {
                    console.info("Worker::Decrypted data:", new Uint8Array(dec));
                })
        })
}

console.info("Worker::Loaded");