import * as crypto from "crypto";

export function digest(alg: string, data: string) {
  const hash = crypto.createHash(alg);
  hash.update(data);
  return hash.digest();
}

export function stringifyError(e: unknown): string {
  if (e instanceof Error) {
    return e.message;
  }

  return `${e}`;
}


export function prepareError(e: unknown): Error {
  if (e instanceof Error) {
    return e;
  }

  return new Error(`Unknown error. ${e}`);
}