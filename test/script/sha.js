"use strict";
for (let i = 0; i < REPEAT; i++) {
    describe("SHA crypto", () => {
        
        const cryptoType = ["native", "js"];

        context("digest", () => {
            ["SHA-1", "SHA-256", "SHA-384", "SHA-512"].forEach(digest =>
                it(digest, done => {
                    let data = crypto.getRandomValues(new Uint8Array(16));
                    let hashNative;
                    subtle.native.digest(digest, data)
                        .then(hash => {
                            hashNative = new Uint8Array(hash);
                            return subtle.js.digest(digest, data)
                        })
                        .then(hash => {
                            let hashJs = new Uint8Array(hash);
                            assert.equal(hashNative.every((b, i) => hashJs[i] === b), true)
                            done();
                        })
                        .catch(done);
                })
            )
        })

    });
}