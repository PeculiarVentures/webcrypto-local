import * as proto from "@webcrypto-local/proto";
import * as graphene from "graphene-pk11";
import * as wcp11 from "node-webcrypto-p11";

import { Server, Session } from "../connection";

import { WebCryptoLocalError } from "../error";
import { CertificateStorageService } from "./cert_storage";
import { KeyStorageService } from "./key_storage";
import { ProviderService } from "./provider";
import { Service } from "./service";
import { SubtleService } from "./subtle";

export class CryptoService extends Service<ProviderService> {

  constructor(server: Server, provider: ProviderService) {
    super(server, provider, [
      //#region List of actions
      proto.IsLoggedInActionProto,
      proto.LoginActionProto,
      proto.LogoutActionProto,
      proto.ResetActionProto,
      //#endregion
    ]);

    this.addService(new SubtleService(server, this));
    this.addService(new CertificateStorageService(server, this));
    this.addService(new KeyStorageService(server, this));
  }

  public async getCrypto(id: string): Promise<wcp11.Crypto> {
    return await this.object.getProvider().getCrypto(id);
  }

  protected async onMessage(session: Session, action: proto.ActionProto) {
    const result = new proto.ResultProto(action);
    switch (action.action) {
      case proto.IsLoggedInActionProto.ACTION: {
        const params = await proto.IsLoggedInActionProto.importProto(action);

        const crypto = await this.getCrypto(params.providerID);

        this.log("info", "crypto/isLoggedIn", {
          crypto: this.logCrypto(crypto),
        });

        result.data = new Uint8Array([crypto.isLoggedIn ? 1 : 0]).buffer;
        break;
      }
      case proto.LoginActionProto.ACTION: {
        const params = await proto.LoginActionProto.importProto(action);

        const crypto = await this.getCrypto(params.providerID);

        this.log("info", "crypto/login", {
          crypto: this.logCrypto(crypto),
        });

        const slot: graphene.Slot = (crypto as any).slot;

        if (crypto.login) {
          const token = slot.getToken();
          if (token.flags & graphene.TokenFlag.LOGIN_REQUIRED) {
            if (token.flags & graphene.TokenFlag.PROTECTED_AUTHENTICATION_PATH) {
              crypto.login("");
            } else {
              // show prompt
              const promise = new Promise<string>((resolve, reject) => {
                this.emit("notify", {
                  type: "pin",
                  origin: session.origin + ":" + session.port,
                  label: slot.getToken().label,
                  resolve,
                  reject,
                });
              });
              const pin = await promise;
              crypto.login(pin);
            }
          }
        }
        break;
      }
      case proto.LogoutActionProto.ACTION: {
        const params = await proto.LogoutActionProto.importProto(action);

        const crypto = await this.getCrypto(params.providerID);

        this.log("info", "crypto/logout", {
          crypto: this.logCrypto(crypto),
        });

        if (crypto.logout) {
          crypto.logout();
        }
        break;
      }
      case proto.ResetActionProto.ACTION: {
        const params = await proto.ResetActionProto.importProto(action);
        const crypto = await this.getCrypto(params.providerID);

        this.log("info", "crypto/reset", {
          crypto: this.logCrypto(crypto),
        });

        if ("reset" in crypto) {
          // node-webcrypto-p11 has reset method
          await (crypto as any).reset();
        }
        break;
      }
      default:
        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_IMPLEMENTED, `Action '${action.action}' is not implemented`);
    }
    return result;
  }

}
