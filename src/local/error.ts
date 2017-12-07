enum WebCryptoLocalErrorEnum {
    UNKNOWN,
    METHOD_NOT_IMPLEMENTED,
    CASE_ERROR,
    RATCHET_KEY_NOT_APPROVED,
    ACTION_COMMON,
    ACTION_NOT_IMPLEMENTED,
    ACTION_NOT_SUPPORTED,
    CARD_CONFIG_COMMON,
    MEMORY_STORAGE_OUT_OF_INDEX,
    PROVIDER_INIT,
    PROVIDER_CRYPTO_NOT_FOUND,
    TOKEN_REMOVE_TOKEN_READING,
    TOKEN_REMOVE_NO_SLOTS_FOUND,
    SERVER_WRONG_MESSAGE,
    SERVER_NOT_LOGGED_IN,
}

export class WebCryptoLocalError extends Error {

    static CODE = WebCryptoLocalErrorEnum;

    public code = 0;
    public type = "wcl";
    public stack: string;

    constructor(code: number, message?: string);
    constructor(message: string);
    constructor(param: number | string, message = "") {
        super();
        const { CODE } = this.constructor as typeof WebCryptoLocalError;
        if (typeof param === "number") {
            this.message = message || CODE[param] || CODE[0];
            this.code = param;
        } else {
            this.code = 0;
            this.message = message;
        }
        const error = new Error(this.message);
        error.name = (this as any).constructor.name;
        this.stack = error.stack;
    }

}
