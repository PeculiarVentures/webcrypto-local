import { Crypto } from "node-webcrypto-p11";
import { Map } from "./map";

export class CryptoMap extends Map<Crypto> {
  public source = "crypto-map";
}
