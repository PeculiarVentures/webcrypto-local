import { ECPublicKey } from "2key-ratchet";
import { Convert } from "pvtsutils";

let subtle: SubtleCrypto;
if (typeof self === "undefined") {
    // nodejs
    subtle = new (require("node-webcrypto-ossl"))().subtle;
} else {
    // browser
    subtle = crypto.subtle;
}

/**
 * Generates One Time Password from server's identity and client's identity keys.
 * Returns 6 digit string
 *
 * @export
 * @param {ECPublicKey} serverIdentity Server's identity public key
 * @param {ECPublicKey} clientIdentity Client's identity public key
 * @returns
 */
export async function generateOTP(serverIdentity: ECPublicKey, clientIdentity: ECPublicKey) {
    const serverIdentityDigest = await serverIdentity.thumbprint();
    const clientIdentityDigest = await clientIdentity.thumbprint();
    const combinedIdentity = Convert.FromHex(serverIdentityDigest + clientIdentityDigest);
    const digest = await subtle.digest("SHA-256", combinedIdentity);
    return parseInt(Convert.ToHex(digest), 16).toString().substr(2, 6);
}
