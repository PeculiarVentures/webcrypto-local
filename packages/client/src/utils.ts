import * as proto from "@webcrypto-local/proto";
import * as core from "webcrypto-core";

export function Cast<T>(data: any): T {
  return data;
}

export interface HashedAlgorithm extends Algorithm {
  hash: AlgorithmIdentifier;
}

export function isHashedAlgorithm(data: any): data is HashedAlgorithm {
  return data instanceof Object
    && "name" in data
    && "hash" in data;
}

export function prepareAlgorithm(algorithm: AlgorithmIdentifier) {
  const algProto = new proto.AlgorithmProto();
  if (typeof algorithm === "string") {
    algProto.fromAlgorithm({ name: algorithm });
  } else if (isHashedAlgorithm(algorithm)) {
    const preparedAlgorithm = { ...algorithm };
    preparedAlgorithm.hash = prepareAlgorithm(algorithm.hash);
    algProto.fromAlgorithm(preparedAlgorithm);
  } else {
    algProto.fromAlgorithm({ ...algorithm });
  }
  return algProto;
}

export function isCryptoKey(data: any): data is proto.CryptoKeyProto {
  return data instanceof proto.CryptoKeyProto;
}

export function isCryptoCertificate(data: any): data is proto.CryptoCertificateProto {
  return data instanceof proto.CryptoCertificateProto;
}

/**
 * Throws TypeError exception if algorithm has wrong type or doesn't have required `name` property
 * @param algorithm Algorithm identifier
 * @param param Param name
 */
export function checkAlgorithm(algorithm: AlgorithmIdentifier, param: string) {
  if (!(algorithm && (typeof algorithm === "object" || typeof algorithm === "string"))) {
    throw new TypeError(`${param}: Is wrong type. Must be Object or String`);
  }
  if (typeof algorithm === "object" && !("name" in algorithm)) {
    throw new TypeError(`${param}: Required property 'name' is missed`);
  }
}

/**
 * Throws TypeError exception if data is not CryptoKey
 * @param data Checkable data
 * @param param Param name
 */
export function checkCryptoKey(data: any, param: string) {
  if (!isCryptoKey(data)) {
    throw new TypeError(`${param}: Is not type CryptoKey`);
  }
}

/**
 * Throws TypeError exception if data is not CryptoCertificate
 * @param data Checkable data
 * @param param Param name
 */
export function checkCryptoCertificate(data: any, param: string) {
  if (!isCryptoCertificate(data)) {
    throw new TypeError(`${param}: Is not type CryptoCertificate`);
  }
}

/**
 * Throws TypeError exception if data is not BufferSource
 * @param data Checkable data
 * @param param Param name
 */
export function checkBufferSource(data: any, param: string) {
  if (!core.BufferSourceConverter.isBufferSource(data)) {
    throw new TypeError(`${param}: Is wrong type. Must be ArrayBuffer or ArrayBuffer view`);
  }
}

/**
 * Throws TypeError exception if data is not Array
 * @param data Checkable data
 * @param param Param name
 */
export function checkArray(data: any, param: string) {
  if (!Array.isArray(data)) {
    throw new TypeError(`${param}: Is not type Array`);
  }
}

export type Primitive = "number" | "string" | "object" | "boolean";

/**
 * Throws TypeError exception if data is not defined Primitive
 * @param data Checkable data
 * @param type Primitive type name
 * @param param Param name
 */
export function checkPrimitive(data: any, type: Primitive, param: string) {
  if (typeof data !== type) {
    throw new TypeError(`${param}: Is not type '${type}'`);
  }
}
