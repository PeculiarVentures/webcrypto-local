import * as client from "@webcrypto-local/client";
import * as assert from "assert";
import { Convert } from "pvtsutils";
import { CryptoX509Certificate, CryptoX509CertificateRequest, PemConverter } from "webcrypto-core";
import { PROVIDER_NAME, SERVER_ADDRESS } from "../config";

context("WebCrypto Socket", () => {

  context("Certificate storage", () => {

    const CERT_RAW = Convert.FromBase64("MIIFazCCBFOgAwIBAgIMWbMqE/uQDZsJqJhuMA0GCSqGSIb3DQEBCwUAMGkxCzAJBgNVBAYTAkJFMRkwFwYDVQQKExBHbG9iYWxTaWduIG52LXNhMRowGAYDVQQLExFGb3IgRGVtbyBVc2UgT25seTEjMCEGA1UEAxMaR2xvYmFsU2lnbiBEZW1vIElzc3VpbmcgQ0EwHhcNMTgwNzE5MDEzMjI2WhcNMjAwNzE5MDEzMjI2WjCBhTELMAkGA1UEBhMCVVMxFjAUBgNVBAgTDU5ldyBIYW1wc2hpcmUxEzARBgNVBAcTClBvcnRzbW91dGgxHTAbBgNVBAoTFEdNTyBHbG9iYWxTaWduLCBJbmMuMRcwFQYDVQQLEw5UZXN0IFByb2ZpbGUgMjERMA8GA1UEAxMIYWVnYWRtaW4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDOFuyLB9Zv65ZgtcRND9cWWOyvM4SXO1BU4BDxH5YJjvSMt63B7RsW8lMcVKuqk50D6Ypv1dxfDKmbWmL5TVW5nJRuNWyNmI29LHvGtztQ9uTKGhr/+bXUUWg4gpLQVVaZ25C0yRPZHJc/CBV5jmS41n4c5Ctwu/xoH9HDJE6TaifggvOOXLIf73RxyQTNGM7jRd0h37MlSLOCPQzhH+R3LtmTzh+Pa528s7oLBhSmbRjWi9yG5xoDTjyeUWIkHtY3fGnh8xCJlAm1FsxugRoqrQnmNrPCdAhIhFSYgysadDf9rjSS43yKzo/i/dJ3lu4qW17yDUN3HLNp1xHbFZTPAgMBAAGjggH0MIIB8DAOBgNVHQ8BAf8EBAMCBSAwfwYIKwYBBQUHAQEEczBxMDkGCCsGAQUFBzAChi1odHRwOi8vc2VjdXJlLmdsb2JhbHNpZ24uY29tL2dzZGVtb3NoYTJnMy5jcnQwNAYIKwYBBQUHMAGGKGh0dHA6Ly9vY3NwMi5nbG9iYWxzaWduLmNvbS9nc2RlbW9zaGEyZzMwTQYDVR0gBEYwRDBCBgorBgEEAaAyASgKMDQwMgYIKwYBBQUHAgEWJmh0dHBzOi8vd3d3Lmdsb2JhbHNpZ24uY29tL3JlcG9zaXRvcnkvMAkGA1UdEwQCMAAwPgYJKwYBBAGCNxUHBDEwLwYnKwYBBAGCNxUIgfaWAIfq8BqC9Zc6g973eYaCki6BSIPCrXuFiLQNAgFkAgEcMDsGA1UdHwQ0MDIwMKAuoCyGKmh0dHA6Ly9jcmwuZ2xvYmFsc2lnbi5jb20vZ3NkZW1vc2hhMmczLmNybDAwBgNVHREEKTAnoCUGCisGAQQBgjcUAgOgFwwVYWVnYWRtaW5AYWVnLXRlc3QuY29tMBQGA1UdJQQNMAsGCSsGAQQBgjcVBjAdBgNVHQ4EFgQUtaXGIvvZbxCM93rReXnobXuBdj8wHwYDVR0jBBgwFoAUdaB/SMrvieU5odrSpkPmnz6/SAQwDQYJKoZIhvcNAQELBQADggEBADvOczw1oj6qHzmqLznTSIEO3v5EnBPeelN+mbX9c/2/vpWl1Qv/kTes134hYfRYnQDGxJbk4o9NvdGfLPD4C031Aqoe64m3Fzx572XuhGWQ8zdYnA+NSj20dY36q1y/OjBsDxortg1g8urXW1r2rDpazZ7RErkGhTIbOHvJpl0t1KpEqWXvKwp4TBJ1WEABoPXTrgNW4OQlbKexTg3du5fDBbTXUkdS8XS9Y3Qb6OunxHB6uX4gsMsH1Fs2WVn7R5rtClO6szlH5A/84vrZHPR4uh5JToesPCNOhqpDATOqgEhmGeRBscAQ1HGg+bbUsDnXZ6PUKzQ1pyebQ2J4l30=");
    const CERT_CA_RAW = Convert.FromBase64("MIIESTCCAzGgAwIBAgIOSETcx33S3NYZEjWnfocwDQYJKoZIhvcNAQELBQAwZjELMAkGA1UEBhMCQkUxGTAXBgNVBAoTEEdsb2JhbFNpZ24gbnYtc2ExGjAYBgNVBAsTEUZvciBEZW1vIFVzZSBPbmx5MSAwHgYDVQQDExdHbG9iYWxTaWduIERlbW8gUm9vdCBDQTAeFw0xNjA3MjAwMDAwMDBaFw0yNjA3MjAwMDAwMDBaMGkxCzAJBgNVBAYTAkJFMRkwFwYDVQQKExBHbG9iYWxTaWduIG52LXNhMRowGAYDVQQLExFGb3IgRGVtbyBVc2UgT25seTEjMCEGA1UEAxMaR2xvYmFsU2lnbiBEZW1vIElzc3VpbmcgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC5GH0rfh100u7O82YF2HfHKbN0lP5qOh5RztOp/HpuzvTtEXyMO6wnwxHfLcNZYnKiqfnm9bLslGQLVMuLlZyzB0rsjH+jq25lnWChbjZrg//ib9MQWGHeJUZ39eQrOg5soox9L7giZIL7YlRaoxsSNyOGKTmL8muevcaEhOfdqA/tI4SPPeYEetfAMNs+LugTS088Cab42G/CJiM3Run5+8fkB0y3Qad1gmJjfKiBUfcrnn2YWwrpC3PmxfAAHEOI3CbA8xNeCEuQy9ZYSwOCCZ0LCO90QGmSk0lRN9WStLL3BP51AKsLIaBVmMPYzqbeWixPEubCdrowYEQGruz1AgMBAAGjgfEwge4wDgYDVR0PAQH/BAQDAgEGMBIGA1UdEwEB/wQIMAYBAf8CAQAwHQYDVR0OBBYEFHWgf0jK74nlOaHa0qZD5p8+v0gEMB8GA1UdIwQYMBaAFOoPwgP07GAbzcdklW05AyZ+2usvMD8GA1UdHwQ4MDYwNKAyoDCGLmh0dHA6Ly9jcmwuZ2xvYmFsc2lnbi5jb20vZ3NkZW1vcm9vdHNoYTJnMy5jcmwwRwYDVR0gBEAwPjA8BgRVHSAAMDQwMgYIKwYBBQUHAgEWJmh0dHBzOi8vd3d3Lmdsb2JhbHNpZ24uY29tL3JlcG9zaXRvcnkvMA0GCSqGSIb3DQEBCwUAA4IBAQBLoX5628c/Rlv4A3/w0Fq4GobqyWQQ+xI9E2oekQx6L2ba/DGU0O9egBLagH2RDb2hWSf/uTqkJxi4v//n13wVMMpvQVC5vtTvgNbeiKxiZDSbRO8NsCxi91aEbX/xm93gahy31LN0YWl9wpk9gwoHyqJviPsaZsY8UbF1FGccnpHJbIJiQsedh8WwueJz+ghLhrUzzVMODgpiJpozzVUK7BeU3y1C2HxHesGZ4Ci+NDWTU8kIh5TU0aSmeeiOLw4OqqgOwo2GFGKDyRQTxTtFVgRaIxW0orFLDtX75jYstk5wUsKSLB0do0Wr9K9IiCYZIVJwk8Bk1+21JTNCkfKq");
    const CERT_ROOT_RAW = Convert.FromBase64Url("MIIDljCCAn6gAwIBAgIOSETcxtRwD_qzf0FjVvEwDQYJKoZIhvcNAQELBQAwZjELMAkGA1UEBhMCQkUxGTAXBgNVBAoTEEdsb2JhbFNpZ24gbnYtc2ExGjAYBgNVBAsTEUZvciBEZW1vIFVzZSBPbmx5MSAwHgYDVQQDExdHbG9iYWxTaWduIERlbW8gUm9vdCBDQTAeFw0xNjA3MjAwMDAwMDBaFw0zNjA3MjAwMDAwMDBaMGYxCzAJBgNVBAYTAkJFMRkwFwYDVQQKExBHbG9iYWxTaWduIG52LXNhMRowGAYDVQQLExFGb3IgRGVtbyBVc2UgT25seTEgMB4GA1UEAxMXR2xvYmFsU2lnbiBEZW1vIFJvb3QgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC1i9RNgrJ4YAATN0J4KVGZjFGQVGFdcbKvfxrt0Bfusq2g81iVrZZjqTJnPSx4g6TdVcsEXU9GWlkFXKEtZzYM4ycbwLAeJQxQDEqkV03GV8ks2Jq_6jIm2DbByPiS5fvRQFQJLYuQHqXpjpOpmPiostUsg9ydMEqcacYV22a6A6Nrb1c1B6OL-X0u9bo30K-YYSw2Ngp3Tuuj9PDk6JS_0CPLcLo8JIFFc8t78lPDquNAOqTDwY_HTw4751iqLVem9q3EDKEeUS-x4gqsCD2pENA7PlQBza55BGOi_A-UAsmfee1oq2Glo9buXBgX-oJ3HnyelzJU9Ej4-yfH7rcvAgMBAAGjQjBAMA4GA1UdDwEB_wQEAwIBBjAPBgNVHRMBAf8EBTADAQH_MB0GA1UdDgQWBBTqD8ID9OxgG83HZJVtOQMmftrrLzANBgkqhkiG9w0BAQsFAAOCAQEAAECKKpL0A2I-hsY881tIz7WqkLDuLh_ISzRVdsALYAxLhVDUHPckh5XyVRkpbTmirn-b5MpuwAI2R8A7Ld6aWWiibc7zGEZNvEKsUEYoJoYR0fuQs2cF7egiYjhFwFMX75w-kuI0Yelm3_3-BiJVtAXqmnQ4yRpGXqNJ4mQC8yWgQbZCLUpH_nqeQANeoaDr5Yg8IOuHRQzG6YNt_Cl9CetDd8WPrAkGm3T2iG0dXQ48VgkkXcNDtY-55nYjIO-N7i-WTh1fe3ArGxHBR3E44-WoA8ntfI1g65-GR0s6G8M7oS-kAFXIwugUGYEnTWp0m5bAn5NlD314IEOg4mnS8Q");
    const REQ_RAW = Convert.FromBase64("MIICZzCCAU8CAQAwIjEgMB4GA1UEAwwXbWFjLW1pbmkuYWVnZG9tYWluMS5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCyiZeRY2Zi6Xnu+asuL85d29Km+WXIQYOk5oo0IsDH7S2KjR4VyulDfNAx6cH9TQydg4LBzve3adBB9hAxpqJOy1ooaLENlml07uXj758C7La5NioBqTjoohbERnzjSpZqiH+08INPtZDDpPH6pRU3MmmtFSywE0R9KOUGNcLXhFHP3jAbiJo5dQDxWUYpjf4ZUlLwE3k6yjtM7y2UlWFb1pB/207FkV/DY+YUTx0PToylGDHLYWdKUXBgAU/htN1VN5tezRd6wwznIP8OiZ8Ebtctq3loA9PfTYblLirYBvuKMPXYbNjw5Fp5XmMFFX83+zLsND3cn4Susdfu7L0hAgMBAAGgADANBgkqhkiG9w0BAQsFAAOCAQEAHpbQ+KTx98neqGtJ6QpmfRuUoHI0tRuCLzmdnCLblqso0bSLDgRgK+bEHVjnIpPpmfu/ZBbK4Hn73nZZPPqpaKE33Ef8A4fKjRrx+5pVSPjt783xrI8uUnn5fmip5pZL07tP8J/RQN30SIRBnCSKUnIgurA5tDPwayxmpnAoh8D5Jl0vvmNAnbHBKvTBAoJDrHLLMyJlbQh2Ip7GPfvfic8yGvaHYKtLfNR52y77aNEc90g3CymtxdImJRYYCjZuAYbfYk31DeKBNTFl1OM+VOqEAUOv/meRxGsEELHHykbYcOOef610LzbR/D10p9e/zaeXyaXlr/GBHQKPUvenTg==");

    let ws: client.SocketProvider;
    let crypto: client.SocketCrypto;

    async function addCertificate(certRaw: ArrayBuffer) {
      const item = await crypto.certStorage.importCert("raw", certRaw, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" } as RsaHashedImportParams, ["verify"]) as CryptoX509Certificate;
      const certIndex = await crypto.certStorage.setItem(item);
      return certIndex;
    }

    before((done) => {
      ws = new client.SocketProvider({ storage: new client.MemoryStorage() });
      ws.connect(SERVER_ADDRESS, { rejectUnauthorized: false })
        .on("listening", () => {
          done();
        })
        .on("error", (err) => {
          console.error(err);
        });
    });

    before(async () => {
      const authorized = await ws.isLoggedIn();
      if (!authorized) {
        await ws.login();
      }
      const info = await ws.info();
      const providers = info.providers.filter((provider) => provider.name === PROVIDER_NAME);
      assert.strictEqual(providers.length, 1, `Cannot get provider by name ${PROVIDER_NAME}`);
      crypto = await ws.getCrypto(providers[0].id);
      if (!(await crypto.isLoggedIn())) {
        await crypto.login();
      }
    });

    it("clear", async () => {
      await crypto.certStorage.clear();
      const keys = await crypto.certStorage.keys();
      assert.equal(keys.length, 0);
    });

    context("import/export", () => {
      context("certificate", () => {
        it("raw", async () => {
          const item = await crypto.certStorage.importCert("raw", CERT_RAW, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" } as RsaHashedImportParams, ["verify"]) as CryptoX509Certificate;
          assert.equal(item.type, "x509");

          const raw = await crypto.certStorage.exportCert("raw", item);
          assert.equal(Convert.ToHex(raw), Convert.ToHex(CERT_RAW));
        });

        it("pem", async () => {
          const pem = PemConverter.fromBufferSource(CERT_RAW, "certificate");
          const item = await crypto.certStorage.importCert("pem", pem, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" } as RsaHashedImportParams, ["verify"]) as CryptoX509Certificate;
          assert.equal(item.type, "x509");
          assert.equal(item.issuerName, "C=BE, O=GlobalSign nv-sa, OU=For Demo Use Only, CN=GlobalSign Demo Issuing CA");
          assert.equal(item.subjectName, "C=US, ST=New Hampshire, L=Portsmouth, O=GMO GlobalSign\\, Inc., OU=Test Profile 2, CN=aegadmin");
          assert.equal(item.serialNumber, "59b32a13fb900d9b09a8986e");
          assert.equal(!!item.publicKey, true);

          const pem2 = await crypto.certStorage.exportCert("pem", item);
          assert.equal(pem2, pem);
        });

        it("x509", async () => {
          const item = await crypto.certStorage.importCert("x509", CERT_RAW, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" } as RsaHashedImportParams, ["verify"]);
          assert.equal(item.type, "x509");

          const raw = await crypto.certStorage.exportCert("raw", item);
          assert.equal(Convert.ToHex(raw), Convert.ToHex(CERT_RAW));
        });

        it("throw error if imported item doesn't match to `x509` format", async () => {
          await assert.rejects(crypto.certStorage.importCert("x509", REQ_RAW, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" } as RsaHashedImportParams, ["verify"]));
        });

      });
      context("request", () => {
        it("raw", async () => {
          const item = await crypto.certStorage.importCert("raw", REQ_RAW, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" } as RsaHashedImportParams, ["verify"]) as CryptoX509CertificateRequest;
          assert.equal(item.type, "request");

          const raw = await crypto.certStorage.exportCert("raw", item);
          assert.equal(Convert.ToHex(raw), Convert.ToHex(REQ_RAW));
        });

        it("pem", async () => {
          const pem = PemConverter.fromBufferSource(REQ_RAW, "certificate request");
          const item = await crypto.certStorage.importCert("pem", pem, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" } as RsaHashedImportParams, ["verify"]) as CryptoX509CertificateRequest;
          assert.equal(item.type, "request");
          assert.equal(item.subjectName, "CN=mac-mini.aegdomain1.com");
          assert.equal(!!item.publicKey, true);

          const pem2 = await crypto.certStorage.exportCert("pem", item);
          assert.equal(pem2, pem);
        });

        it("request", async () => {
          const item = await crypto.certStorage.importCert("request", REQ_RAW, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" } as RsaHashedImportParams, ["verify"]) as CryptoX509CertificateRequest;
          assert.equal(item.type, "request");

          const raw = await crypto.certStorage.exportCert("raw", item);
          assert.equal(Convert.ToHex(raw), Convert.ToHex(REQ_RAW));
        });

        it("throw error if imported item doesn't match to `request` format", async () => {
          await assert.rejects(crypto.certStorage.importCert("request", CERT_RAW, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" } as RsaHashedImportParams, ["verify"]));
        });
      });
    });

    it("set/get", async () => {
      let indexes = await crypto.certStorage.keys();
      const beforeAmount = indexes.length;

      const cert = await crypto.certStorage.importCert("raw", CERT_RAW, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" } as RsaHashedImportParams, ["verify"]) as CryptoX509Certificate;
      const index = await crypto.certStorage.setItem(cert);
      indexes = await crypto.certStorage.keys();
      assert.equal(indexes.length - 1, beforeAmount);

      const cert2 = await crypto.certStorage.getItem(index) as CryptoX509Certificate;
      assert.equal(cert2.type, "x509");
      assert.equal(cert2.serialNumber, cert.serialNumber);
    });

    it("removeItem", async () => {
      let indexes = await crypto.certStorage.keys();
      const beforeAmount = indexes.length;

      const cert = await crypto.certStorage.importCert("raw", REQ_RAW, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" } as RsaHashedImportParams, ["verify"]) as CryptoX509CertificateRequest;
      const index = await crypto.certStorage.setItem(cert);
      indexes = await crypto.certStorage.keys();
      assert.equal(indexes.length - 1, beforeAmount);

      await crypto.certStorage.removeItem(index);
      indexes = await crypto.certStorage.keys();
      assert.equal(indexes.length, beforeAmount);
    });

    it("getCRL", async () => {
      const crl = await crypto.certStorage.getCRL("http://crl.comodoca.com/COMODOCertificationAuthority.crl");
      assert.equal(crl.byteLength > 0, true);
    });

    it.skip("getOCSP", async () => {
      // No test implementation
    });

    it("getChain", async () => {
      const index = await addCertificate(CERT_RAW);
      await addCertificate(CERT_CA_RAW);
      await addCertificate(CERT_ROOT_RAW);
      const cert = await crypto.certStorage.getItem(index);

      const chain = await crypto.certStorage.getChain(cert);
      assert.equal(chain.length, 3);
    });

    it("certificate public key linking", async () => {
      const item = await crypto.certStorage.importCert("raw", CERT_RAW, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" } as RsaHashedImportParams, ["verify"]) as CryptoX509Certificate;
      const certIndex = await crypto.certStorage.setItem(item);
      const keyIndex = await crypto.keyStorage.setItem(item.publicKey);

      const cert = await crypto.certStorage.getItem(certIndex) as CryptoX509Certificate;
      const publicKeyIndex = await crypto.keyStorage.indexOf(cert.publicKey);
      assert.equal(publicKeyIndex, keyIndex, "Public key of the certificate is not from token");
    });

  });
});
