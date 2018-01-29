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
