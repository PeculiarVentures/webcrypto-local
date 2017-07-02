import * as fs from "fs";
import * as os from "os";
import * as path from "path";

function declareDir(path: string) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    return path;
}

export const USER_DIR = os.homedir();
export const APP_DATA_DIR = declareDir(path.join(USER_DIR, ".fortify"));

export const DOUBLE_KEY_RATCHET_STORAGE_DIR = declareDir(path.join(APP_DATA_DIR, "2key-ratchet"));

export const OPENSSL_CERT_STORAGE_DIR = declareDir(path.join(APP_DATA_DIR, "certstorage"));
export const OPENSSL_KEY_STORAGE_DIR = declareDir(path.join(APP_DATA_DIR, "keystorage"));