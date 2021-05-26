import * as cards from "@webcrypto-local/cards";
import { ConfigAttrEnum } from "@webcrypto-local/cards";
import * as graphene from "graphene-pk11";
import * as p11 from "node-webcrypto-p11";
import * as utils from "pvtsutils";

/**
 * Represents PKCS#11 template builder based on card configuration
 */
export class ConfigTemplateBuilder implements p11.ITemplateBuilder {

  public constructor(public config: cards.Config) { }

  build(params: p11.ITemplateBuildParameters): p11.ITemplate {
    const template: p11.ITemplate = {};

    this.setId(template, params);
    this.setToken(template, params);
    this.setSensitive(template, params);
    this.setExtractable(template, params);
    this.setLabel(template, params);
    this.setKeyUsages(template, params);

    if (["generate", "import"].includes(params.action)) {
      switch (params.type) {
        case "private":
          Object.assign<p11.ITemplate, p11.ITemplate>(template, {
            class: graphene.ObjectClass.PRIVATE_KEY,
            private: true,
          });
          break;
        case "public":
          Object.assign<p11.ITemplate, p11.ITemplate>(template, {
            class: graphene.ObjectClass.PUBLIC_KEY,
            private: false,
          });
          break;
        case "secret":
          Object.assign<p11.ITemplate, p11.ITemplate>(template, {
            class: graphene.ObjectClass.SECRET_KEY,
          });
          break;
        case "request":
          Object.assign<p11.ITemplate, p11.ITemplate>(template, {
            class: graphene.ObjectClass.DATA,
            application: "webcrypto-p11",
            private: false,
          });
          break;
        case "x509":
          Object.assign<p11.ITemplate, p11.ITemplate>(template, {
            class: graphene.ObjectClass.CERTIFICATE,
            certType: graphene.CertificateType.X_509,
            private: false,
          });
          break;
      }
    } else {
      // copy
      Object.assign<p11.ITemplate, p11.ITemplate>(template, {
        token: true,
      });
    }

    return template;
  }

  /**
   * Sets CKA_ID attribute
   * @param template
   * @param params
   */
  private setId(template: p11.ITemplate, params: p11.ITemplateBuildParameters) {
    if (params.attributes.id) {
      const id = Buffer.from(utils.BufferSourceConverter.toArrayBuffer(params.attributes.id));
      switch (params.type) {
        case "request":
          template.objectId = id;
          break;
        default:
          template.id = id;
          break;
      }
    }
  }

  /**
   * Sets CKA_LABEL attribute
   * @param template
   * @param params
   */
  private setLabel(template: p11.ITemplate, params: p11.ITemplateBuildParameters) {
    if (params.attributes.label) {
      template.label = params.attributes.label;
    }
  }

  /**
   * Sets key usages attributes (CKA_SIGN, CKA_VERIFY, CKA_ENCRYPT, CKA_DECRYPT, CKA_WRAP, CKA_UNWRAP, CKA_DERIVE)
   * @param template
   * @param params
   */
  private setKeyUsages(template: p11.ITemplate, params: p11.ITemplateBuildParameters) {
    const { attributes, type, action } = params;
    const sign = attributes.usages?.includes("sign");
    const verify = attributes.usages?.includes("verify");
    const wrap = attributes.usages?.includes("wrapKey");
    const unwrap = attributes.usages?.includes("unwrapKey");
    const encrypt = unwrap || attributes.usages?.includes("encrypt");
    const decrypt = wrap || attributes.usages?.includes("decrypt");
    const derive = attributes.usages?.includes("deriveBits") || attributes.usages?.includes("deriveKey");

    const privateSecret = type === "private" || type === "secret";
    const publicSecret = type === "public" || type === "secret";

    if (["private", "public", "secret"].includes(type) &&
      ["generate", "import"].includes(action)) {
      const typeConfig = this.config.template?.[action]?.[type];;
      if (typeConfig && "keyUsages" in typeConfig) {
        if (typeConfig.keyUsages === ConfigAttrEnum.required) {
          if (privateSecret) {
            template.derive = derive;
            template.sign = sign;
            template.decrypt = decrypt;
            template.unwrap = unwrap;
          }
          if (publicSecret) {
            template.derive = derive;
            template.verify = verify;
            template.encrypt = encrypt;
            template.wrap = wrap;
          }
          return;
        }
      } else if (this.config.keyUsages === ConfigAttrEnum.required) {
        // TODO Remove this block in the next release
        if (privateSecret) {
          template.derive = derive;
          template.sign = sign;
          template.decrypt = decrypt;
          template.unwrap = unwrap;
        }
        if (publicSecret) {
          template.derive = derive;
          template.verify = verify;
          template.encrypt = encrypt;
          template.wrap = wrap;
        }
        return;
      }

      if (privateSecret) {
        if (derive) {
          template.derive = derive;
        }
        if (sign) {
          template.sign = sign;
        }
        if (decrypt) {
          template.decrypt = decrypt;
        }
        if (wrap) {
          template.unwrap = unwrap;
        }
      }
      if (publicSecret) {
        if (derive) {
          template.derive = derive;
        }
        if (verify) {
          template.verify = verify;
        }
        if (encrypt) {
          template.encrypt = encrypt;
        }
        if (wrap) {
          template.wrap = wrap;
        }
      }
    }
  }

  /**
   * Sets CKA_EXTRACTABLE attribute
   * @param template
   * @param params
   */
  private setExtractable(template: p11.ITemplate, params: p11.ITemplateBuildParameters) {
    if (["private", "secret"].includes(params.type)) {
      this.setBoolean(params, template, "extractable");
    }
  }

  private static getBoolean(value?: boolean, config?: boolean | cards.ConfigAttrEnum): boolean | null {
    if (typeof config === "string") {
      if (config === ConfigAttrEnum.optional) {
        if (value) {
          return true;
        }
        return null;
      } else {
        return !!value;
      }
    } else if (typeof config === "boolean") {
      return config;
    }

    return value ?? null;
  }

  /**
   * Sets CKA_SENSITIVE attribute
   * @param template
   * @param params
   */
  private setSensitive(template: p11.ITemplate, params: p11.ITemplateBuildParameters) {
    if (["private", "secret"].includes(params.type)) {
      this.setBoolean(params, template, "sensitive");
    }
  }

  private setBoolean(params: p11.ITemplateBuildParameters, template: graphene.ITemplate, attrName: string) {
    const { attributes, type, action } = params;

    const typeConfig = this.config.template?.[action]?.[type];
    if (typeConfig && attrName in typeConfig) {
      const value = ConfigTemplateBuilder.getBoolean((attributes as any)[attrName], (typeConfig as any)[attrName]);
      if (value !== null) {
        template[attrName] = value;
      }
    } else if (template[attrName] === undefined && (attributes as any)[attrName] !== undefined) {
      template[attrName] = (attributes as any)[attrName];
    }
  }

  /**
   * Sets CKA_TOKEN attribute
   * @param template
   * @param params
   */
  private setToken(template: p11.ITemplate, params: p11.ITemplateBuildParameters) {
    if (this.config.token === "static") {
      // TODO Remove in the next release
      template.sensitive = true;
      template.token = true;
    } else if (this.config.token === "optional" && params.attributes.token) {
      template.sensitive = true;
      template.token = true;
    }
    this.setBoolean(params, template, "token");
  }
}