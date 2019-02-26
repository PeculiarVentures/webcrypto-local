import * as fs from "fs";
import * as os from "os";
import * as path from "path";

export const DEFAULT_HASH_ALG = "sha256";
export let PV_PKCS11_LIB = "";
if ((process.versions as any).electron) {
    let libName = "";
    switch (os.platform()) {
        case "win32":
            libName = "pvpkcs11.dll";
            PV_PKCS11_LIB = path.join(__dirname, "..", "..", "..", "..", "..", libName);
            break;
        case "darwin":
            libName = "libpvpkcs11.dylib";
            PV_PKCS11_LIB = path.join(__dirname, "..", "..", "..", libName);
            break;
        default:
            libName = "pvpkcs11.so";
            PV_PKCS11_LIB = path.join(__dirname, "..", "..", "..", libName);
    }
} else {
    // Dev paths for different os
    switch (os.platform()) {
        case "win32":
            PV_PKCS11_LIB = "/github/pv/pvpkcs11/build/Debug/pvpkcs11.dll";
            break;
        case "darwin":
            PV_PKCS11_LIB = "/Users/microshine/Library/Developer/Xcode/DerivedData/config-hkruqzwffnciyjeujlpxkaxbdiun/Build/Products/Debug/libpvpkcs11.dylib";
            break;
        default:
            // Use SoftHSM by default
            PV_PKCS11_LIB = "/usr/local/lib/softhsm/libsofthsm2.so";
    }
}

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
