import * as fs from "fs";
import * as os from "os";
import * as path from "path";

export const DEFAULT_HASH_ALG = "sha256";

function initDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    return dirPath;
}

export const USER_DIR = os.homedir();
export const APP_DATA_DIR = initDir(path.join(USER_DIR, ".fortify"));

export const DOUBLE_KEY_RATCHET_STORAGE_DIR = initDir(path.join(APP_DATA_DIR, "2key-ratchet"));

export const OPENSSL_CERT_STORAGE_DIR = initDir(path.join(APP_DATA_DIR, "certstorage"));
export const OPENSSL_KEY_STORAGE_DIR = initDir(path.join(APP_DATA_DIR, "keystorage"));
