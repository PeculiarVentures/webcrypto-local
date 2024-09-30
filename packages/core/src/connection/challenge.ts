import { ECPublicKey, getEngine } from "2key-ratchet";
import { Convert } from "pvtsutils";

/**
 * Generates 6 digit string from server's identity and client's identity keys.
 *
 * @param serverIdentity Server's identity public key
 * @param clientIdentity Client's identity public key
 * @returns
 */
export async function challenge(serverIdentity: ECPublicKey, clientIdentity: ECPublicKey) {
  const serverIdentityDigest = await serverIdentity.thumbprint();
  const clientIdentityDigest = await clientIdentity.thumbprint();
  const combinedIdentity = Convert.FromHex(serverIdentityDigest + clientIdentityDigest);
  const digest = await getEngine().crypto.subtle.digest("SHA-256", combinedIdentity);
  return parseInt(Convert.ToHex(digest), 16).toString().substr(2, 6);
}
