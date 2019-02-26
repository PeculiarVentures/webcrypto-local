import * as crypto from "crypto";

export function digest(alg: string, data: string) {
  const hash = crypto.createHash(alg);
  hash.update(data);
  return hash.digest();
}
