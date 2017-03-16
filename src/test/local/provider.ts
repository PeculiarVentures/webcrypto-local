import { LocalProvider } from "../../local/provider";

const prov = new LocalProvider({
    pkcs11: [
        "/usr/local/lib/libykcs11.dylib",
    ],
});

prov.open();

prov
    .on("listening", (info) => {
        console.log("listening");
        console.log(JSON.stringify(info, null, "  "));
    })
    .on("error", (err) => {
        console.error(err);
    })
    .on("token", (info) => {
        console.log(info);
    });
