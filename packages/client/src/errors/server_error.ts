import { ErrorProto } from "@webcrypto-local/proto";

export class CryptoServerError extends Error {

  public code: number;
  public type: string;

  constructor(error: ErrorProto) {
    super(error.message);
    this.name = "CryptoServerError";
    this.code = error.code;
    this.type = error.type;
  }
}
