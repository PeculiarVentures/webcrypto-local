enum WebCryptoLocalErrorEnum {
  UNKNOWN = 0,
  METHOD_NOT_IMPLEMENTED = 1,
  CASE_ERROR = 2,
  RATCHET_COMMON = 100,
  RATCHET_KEY_NOT_APPROVED = 101,
  ACTION_COMMON = 200,
  ACTION_NOT_IMPLEMENTED = 201,
  ACTION_NOT_SUPPORTED = 202,
  CARD_CONFIG_COMMON = 300,
  MEMORY_STORAGE_COMMON = 350,
  MEMORY_STORAGE_OUT_OF_INDEX = 351,
  PROVIDER_COMMON = 400,
  PROVIDER_INIT = 401,
  PROVIDER_CRYPTO_NOT_FOUND = 402,
  PROVIDER_CRYPTO_WRONG = 403,
  PROVIDER_NOT_FOUND = 404,
  PROVIDER_WRONG_LIBRARY = 405,
  TOKEN_COMMON = 500,
  TOKEN_REMOVE_TOKEN_READING = 501,
  TOKEN_REMOVE_NO_SLOTS_FOUND = 502,
  SERVER_COMMON = 600,
  SERVER_WRONG_MESSAGE = 601,
  SERVER_NOT_LOGGED_IN = 602,
  PCSC_COMMON = 700,
  PCSC_CANNOT_START = 701,
  WEBSOCKET_VANISHED = 800,
}

export class WebCryptoLocalError extends Error {

  public static CODE = WebCryptoLocalErrorEnum;

  public static isError(obj: any): obj is WebCryptoLocalError {
    if (obj instanceof Error && obj.hasOwnProperty("code") && obj.hasOwnProperty("type")) {
      return true;
    }
    return false;
  }

  public code = 0;
  public type = "wcl";
  public stack: string;

  constructor(code: number, message?: string);
  constructor(message: string);
  constructor(param: number | string, message = "") {
    super();
    const CODE = WebCryptoLocalError.CODE;
    if (typeof param === "number") {
      this.message = message || CODE[param] || CODE[0];
      this.code = param;
    } else {
      this.code = 0;
      this.message = message;
    }
    const error = new Error(this.message);
    error.name = (this as any).constructor.name;
    this.stack = error.stack || "";
  }

}
