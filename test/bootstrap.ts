import { setEngine } from "2key-ratchet";
import { Crypto } from "@peculiar/webcrypto";
import * as server from "@webcrypto-local/server";
import { Convert } from "pvtsutils";
import * as core from "webcrypto-core";
import { PROVIDER_NAME, SERVER_ADDRESS } from "./config";

// disable TLS certificate validation
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Set crypto engine for 2key-ratchet
setEngine("WebCrypto NodeJS", new Crypto());

const CERT = core.PemConverter.fromBufferSource(Convert.FromBase64Url("MIIC8DCCAdqgAwIBAgIKsDFbk-E8Lb26VzALBgkqhkiG9w0BAQswGzEZMBcGA1UEAxMQRm9ydGlmeSBMb2NhbCBDQTAeFw0xOTAyMjcxMTM5NDBaFw0yMDAyMjcxMTM5NDBaMBQxEjAQBgNVBAMTCTEyNy4wLjAuMTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAM0eaFvyYw1JZ1r74T8zO1VcX1RxLoOJkeG3L-jDaf8nhQ6AiHq2CsrkOvNGlBS8O1uEVWvX7GoFcSlEREJGawrAQnHnTPzoXfr2EsrttkZ8f-taLVOM8-kjU07rjZD5OKXMrF5DmrGXaQBuFMqD-GDYJlKFTK5XaV8Gp7_2At2gB-EAIOuUbXQnCUAMtrhEnHRkTdna4uKxbzUr_riXp6NXcWzP8GgD_oMxWjjTVxcpLhjET3hiefXSf0UtjX6dnapYon406e4Mk9ekJJguG6Sk1al84S06NqHPhyQBxktl5wP_RsVKXc3ZF9ce23oxjVwdQQIvVv2IgJ_zCn568j8CAwEAAaNBMD8wFgYDVR0lAQH_BAwwCgYIKwYBBQUHAwEwGgYDVR0RBBMwEYIJbG9jYWxob3N0hwR_AAABMAkGA1UdEwQCMAAwCwYJKoZIhvcNAQELA4IBAQAeeus4ZJGGp6I4YqzKi0BSEkoLyyg6j03foFc3p3qs2YSAXphO7uOZ-7o-4Y_GmkRnC1hM3Fageay3R3CFpM8eHKmN8W9uq7xtg7UdURBXruI6wNGTnUsm2SzIvol20Gd_939M2GBA0GeRlcLOOBsnJjbhpHx6p4xDKpAjqtGMmJht41rDgToAS4XuJTJzLi60Rerj5Q8lwafbK3EXK29zFvCVEG1BCxSY9VI2W88FtolrK2_oB5mCGL2hTB89Vo5XDDyfTnRzlYRYmgawaf83aClKPtuUlz9iffutKp7J5G2vFomHsxArdRgH-O8IBZsw3KBB_pWxVJcAHzspzXzO"), "certificate");
const KEY = core.PemConverter.fromBufferSource(Convert.FromBase64Url("MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDNHmhb8mMNSWda--E_MztVXF9UcS6DiZHhty_ow2n_J4UOgIh6tgrK5DrzRpQUvDtbhFVr1-xqBXEpRERCRmsKwEJx50z86F369hLK7bZGfH_rWi1TjPPpI1NO642Q-TilzKxeQ5qxl2kAbhTKg_hg2CZShUyuV2lfBqe_9gLdoAfhACDrlG10JwlADLa4RJx0ZE3Z2uLisW81K_64l6ejV3Fsz_BoA_6DMVo401cXKS4YxE94Ynn10n9FLY1-nZ2qWKJ-NOnuDJPXpCSYLhukpNWpfOEtOjahz4ckAcZLZecD_0bFSl3N2RfXHtt6MY1cHUECL1b9iICf8wp-evI_AgMBAAECggEBAMy-QnstKjQUBifqbj8Qm3QsPTfjtgM0abp9iUP08zPutcDxCco7NfCp-jHlTGCaN0G1iTKZmHGHtxny-5OQCL71hB2APPfh1hVwVPfcaepX0bQSElZoxvr6-Og49dk0-5d8Ar4hCyOjt_rm5rfzHRVGDJKoXg9UT2i8Euvo25ltnXw1-WHCWbYD1tVtsPVN8qyjan8bMcZTsaZqlr3zZZSLcHLgX5bzKvSYkDAZRewx7HQN6rPnS3Xls_jTXoN81nriraTd2lB0mMQddo8JpFd0_ulmiBvXYflch33d75P3_h2CDvY5OgDT_eavMcFTAyFF3CDe3HDJXtfcMYMaHlECgYEA_Ddf_Q7avB85ey859yAH0HOOUdgLSO2pPvicAig6jnMmYcqllc067EZgTW2hcBAbWY27Rkt28Ue2OZOc4hcBPP2QjdZRxxmP_YOxjn0qF8eCSLqft8GbnfqeziF8aFNdGiAxHzZ300er9lYwzdlaNNw4mtJvyAOW9FaE88zx8DcCgYEA0DIoJX2_z7Sug-nWGcQoTn_o9rHRuhBvdUOJ_Z5QccZt4OkhhQgvKsp3YFNcvOsC8tYjk8GEnHkeedlHyjAQNIyL8Cthw4LevLsWTQiMOs2S-tONBaifdj1zEP8GUHbaLiKCIL9f7ARw1D5XAPlww1xIGwRTYmGQ57u1LF1QOjkCgYEAgdDusw2mQBXCPEk-iJgP7ZbMtguBI3RQHH1RrzqNiSxzoPnw6H3Nyjce8jtvUIK50QpGThQhkGbcwB3eLfCxTnckpByf0t6xYkcaaMC7namuwUhtVONt-Y45ltdddUUTMpNHNU2Pt0u4kv4h-JHbAEIpUGbn6gcO94xguivOi1kCgYB3K46RTzZg5NJTzaBwpThRHqQxuT0MHOY_oAY3dswjI-q3J5q5NCMTgkrshyr5NCg-6dX5eHa4vhd0tauDDxnnil97fMl8CMgIDarJM1BZRFySWE9LYubL3oajvuZVXoKqj7QenIyCY1RWGMziUOV73bGkTUiRcrln-6jLmSoX-QKBgBJKSTSMhR_QZk7sl3nJXJwy7frIn2SGToOJbcPgyn2P1ypmvDIwzcZcpL6A_UZ26w_Dc1vW4ZWr44bfx0-4bQW4u3VRFy1oY62WCenWiiVHjkVEe8FlBSd2eWz8htSUL8DU6AiCnlR-Upm3zwx2-3hUgWrpQQf_gZvywYNArfPX"), "rsa private key");

const options: server.IServerOptions = {
  cert: Buffer.from(CERT),
  key: Buffer.from(KEY),
  storage: new server.MemoryStorage(),
  config: {
    cards: "card.json",
    providers: [
      { lib: "/usr/local/lib/softhsm/libsofthsm2.so", slots: [0], name: PROVIDER_NAME },
    ],
  },
};
const localServer = new server.LocalServer(options);

before(async () => {
  await new Promise((resolve, reject) => {
    localServer
      .listen(SERVER_ADDRESS)
      .on("listening", (e: any) => {
        resolve();
      })
      .on("info", (msg) => {
        // console.log(msg);
      })
      .on("token_new", (card) => {
        console.log("New token:", card);
      })
      .on("error", (e: Error) => {
        console.error(e);
      })
      .on("notify", (p: any) => {
        // console.log("Notify:", p.type);

        switch (p.type) {
          case "2key": {
            // auto approve all connections
            p.resolve(true);
            break;
          }
          case "pin": {
            // auto PIN for all token's
            p.resolve("12345");
            break;
          }
          default:
            throw new Error("Unknown type of notify");
        }
      })
      .on("close", (e: any) => {
        console.log("Close:", e.remoteAddress);
      });
  });
});

after((done) => {
  localServer.close(done);
});
