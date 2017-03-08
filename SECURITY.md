# Security 
`webcrypto-local` enables browser-based applications to enroll, sign, verify and encrypt utilizing smart cards as well as platform or user agent cryptographic and certificate store implementations.

## Overview
`webcrypto-local` consists of several components, the first of which is a polyfill for WebCrypto that shares the same name. This Webcrypto implementation communicates with a locally installed server called `webcrypto-remote` with a protocol called `webcrypto-socket`. `webcrypto-remote` is built on top of a set of `PKCS#11` implementations that provide access to various cryptographic implementations and certificate stores.

### Discovery
The `webcrypto-local` client needs to discover the existence of a `webcrypto-remote` server to operate. The `webcrypto-remote` server is installed as a listener on a high-order, well-known port. The existence and capabilities of the server are discovered via by requesting `http://localhost:{port}/.well-known/webcrypto-socket`.

### Sessions
`webcrypto-local` talks to `webcrypto-remote` utilizing a session managed by `2key-ratchet`. This package provides an implementation of a `Double Ratchet` and `X3DH` based solution for session establishment and protection over `websockets`.

This approach provides integrity and encryption with forward-secrecy by ensuring each message is encrypted with a new cryptographic key.

### Key Management
<To Be clarified>

### Pinning
<To Be clarified>

### Protocol
Once a session is established with `2key-socket` the `webcrypto-socket` protocol takes over. This protocol is defined as a set of `ProtoBuf` messages. The server implementation of the protocol does not allow clients to continue until they have been successfully authenticated by the user.

### Authentication
In a `Double Ratchet` and `X3DH` based authentication the problem of authentication of the peer is left to the application. 

The `webcrypto-socket` protocol provides for this authentication by having both the client and the server verify the peers in the protocol control their respective `IdentityKeys` and then derives a pin from these values and asking the user to confirm the two pins match.

This pin is derived by concatenating both the `client` and the `server` keys together, hashing them with SHA256, converting the hash to HEX, taking only the numbers from the resulting value and truncating the value to a six character pin.

This `Password Authenticated Key Exchange (PAKE)` approach helps ensure a middle-man can not impersonate the authentication request.

The `webcrypto-server` relies on the operating system provided notification mechanisms to display and confirm that the pin presented by the client was correct.

### Authorization
<To Be Clarified>

### Rate limiting
<To Be Clarified>


## Goals
- The browsers `same origin policy` is honored,
- The solution works cross-browser, and cross-platform,
- Only approved websites can perform cryptographic or certificate related operations,
- Random websites can not abuse the existence of the solution to annoy the user.
- Approved websites can perform sign, verify, encrypt, decrypt and derive cryptographic operations,
- Approved websites can enumerate and read certificates located in the current user's certificate store.
- Approved websites can install certificates into the current user's certificate store,
- Cryptographic keys are automatically managed and renewed so that no user management is necessary.
 

## Risks and Mitigations
### Man-In-The-Middle
In a system where the peers were not authenticated, a session not encrypted, or the session was poorly encrypted an attacker could potentially observe, modify, impersonate, or perform actions without the user's consent.

The design mitigates this risk in a few ways:
1. By leveraging strong authenticated encryption with forwarding secrecy,
2. By locating the server port on a high-level port that, on most systems, would require 'root' or 'administrative' permissions.

### Cryptographic Weaknesses
In a system where weak cryptographic primitives were in use or flawed cryptographic implementations were in use an attacker could potentially undue the cryptographic protections.

The design mitigates this risk in a few ways:
- We utilize well-reviewed algorithms such as `secp256r1`, `SHA2-256` and AES-GCM,
- Where possible we utilize operating system, user agent or smart card implementations of cryptographic algorithms,
- We only utilize these algorithms in well-understood compositions to reduce chances associated risks.

Unmitigated risks include:
- Not all browsers have robust implementations of WebCrypto, for example, Safaro, in such cases we utilise `webcrypto-liner`, a javascript polyfill for webcrypto, that utilizes Javascript based implementations of algorithms.

### Cryptographic Key Management Weaknesses
In a system where weak cryptographic key management practices are an attacker could potentially undue the cryptographic protections.

The design mitigates this risk in a few ways:
- When using WebCrypto we utilize non-exportable asymmetric keys,
- We utilize one time use symmetric keys,
- We generate and manage the lifecycle of keys for the user so they do not need to do worry about this.
- Where possible and appropriate, for example in the case of the server's identity keys, we leverage the operating system user and ACL subsystem to limit who can access keys

Unmitigated risks include:
- Not all browsers protect stored WebCrypto keys at rest, as such an attacker with local privileges may be able to steal the associated keys.
- The server keys are stored in the clear.

## Protocol Weakness
In a system using poorly designed set of protocols, an attacker could use logic problems in the protocol to expose a vulnerability in the remote implementation.

The design mitigates this risk in a few ways:
- Leverages a well-reviewed protocol for encryption, integrity and session management,
- Utilizes `ProtoBufs` to ensure normalized and robust packet parsing.

<Add note about how 2key-ratchet is slightly different>
