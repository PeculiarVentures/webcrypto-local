import { ECPublicKey, getEngine } from "2key-ratchet";
import { Convert } from "pvtsutils";

/**
 * These functions are needed to fix problems in browsers which cannot keep EC keys in IndexedDB or EC keys are not native
 */

export function isFirefox() {
    return /firefox/i.test(self.navigator.userAgent);
}

export function isEdge() {
    return /edge\/([\d\.]+)/i.test(self.navigator.userAgent);
}

export const ECDH = { name: "ECDH", namedCurve: "P-256" };
export const ECDSA = { name: "ECDSA", namedCurve: "P-256" };
export const AES_CBC = { name: "AES-CBC", iv: new ArrayBuffer(16) };

async function createEcPublicKey(publicKey: CryptoKey) {
    const algName = publicKey.algorithm.name!.toUpperCase();
    if (!(algName === "ECDH" || algName === "ECDSA")) {
        throw new Error("Error: Unsupported asymmetric key algorithm.");
    }
    if (publicKey.type !== "public") {
        throw new Error("Error: Expected key type to be public but it was not.");
    }

    // Serialize public key to JWK
    const jwk = await getEngine().crypto.subtle.exportKey("jwk", publicKey);
    if (!(jwk.x && jwk.y)) {
        throw new Error("Wrong JWK data for EC public key. Parameters x and y are required.");
    }
    const x = Convert.FromBase64Url(jwk.x);
    const y = Convert.FromBase64Url(jwk.y);
    const xy = Convert.ToBinary(x) + Convert.ToBinary(y);

    const key = publicKey;
    const serialized = Convert.FromBinary(xy);
    const id = Convert.ToHex(await getEngine().crypto.subtle.digest("SHA-256", serialized));

    return {
        id,
        key,
        serialized,
    };
}

export async function updateEcPublicKey(ecPublicKey: ECPublicKey, publicKey: CryptoKey) {
    const data = await createEcPublicKey(publicKey);
    ecPublicKey.id = data.id;
    ecPublicKey.key = data.key;
    (ecPublicKey as any).serialized = data.serialized;
}
