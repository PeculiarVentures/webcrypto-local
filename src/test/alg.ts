import { Convert } from "pvtsutils";
import { AlgorithmProto } from "../core";

function done() {
    if (arguments[0]) {
        console.error(arguments[0]);
    } else {
        console.log("success");
    }
}

(async () => {
    const alg = new AlgorithmProto();

    console.log(alg.hash.name);
    console.log(alg.hash.hasChanged());
    alg.fromAlgorithm({ name: "RSASSA-PKCS1-v1_5" });
    console.log(alg.hash.isEmpty());
    console.log(alg.hash.hasChanged());

    const buf = await alg.exportProto();
    console.log(Convert.ToHex(buf));
    const alg2 = await AlgorithmProto.importProto(buf);
    console.log(alg2.toAlgorithm());
})().then(done, done);
