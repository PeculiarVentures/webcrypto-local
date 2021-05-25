import { JsonProp, JsonPropTypes } from "@peculiar/json-schema";

export enum ConfigAttrEnum {
  required = "required",
  optional = "optional",
}

/**
 * @deprecated It should be removed later
 */
export enum ConfigKeyUsagesEnum {
  required = "required",
  optional = "optional",
}

/**
 * @deprecated It should be removed later
 */
export enum ConfigTokenEnum {
  required = "required",
  optional = "optional",
  static = "static",
}

export class TemplateAttributeConfig {
  @JsonProp({ type: JsonPropTypes.Any, optional: true })
  public token?: boolean | ConfigAttrEnum;
}

export class TemplateKeyConfig extends TemplateAttributeConfig {
  @JsonProp({ enumeration: Object.keys(ConfigAttrEnum), optional: true })
  public keyUsages?: keyof typeof ConfigAttrEnum;
}

export class TemplatePrivateAttributeConfig extends TemplateKeyConfig {
  @JsonProp({ type: JsonPropTypes.Any, optional: true })
  public extractable?: boolean | ConfigAttrEnum;

  @JsonProp({ type: JsonPropTypes.Any, optional: true })
  public sensitive?: boolean | ConfigAttrEnum;
}

export class TemplateTypeConfig {
  @JsonProp({ type: TemplatePrivateAttributeConfig, optional: true })
  public private?: TemplatePrivateAttributeConfig;

  @JsonProp({ type: TemplateKeyConfig, optional: true })
  public public?: TemplateKeyConfig;

  @JsonProp({ type: TemplatePrivateAttributeConfig, optional: true })
  public secret?: TemplatePrivateAttributeConfig;

  @JsonProp({ type: TemplateAttributeConfig, optional: true })
  public x509?: TemplateAttributeConfig;

  @JsonProp({ type: TemplateAttributeConfig, optional: true })
  public request?: TemplateAttributeConfig;
}

export class TemplateConfig {
  @JsonProp({ type: TemplateTypeConfig, optional: true })
  public generate?: Record<keyof TemplateTypeConfig, TemplateAttributeConfig | undefined>;

  @JsonProp({ type: TemplateTypeConfig, optional: true })
  public import?: Record<keyof TemplateTypeConfig, TemplateAttributeConfig | undefined>;

  @JsonProp({ type: TemplateTypeConfig, optional: true })
  public copy?: Record<keyof TemplateTypeConfig, TemplateAttributeConfig | undefined>;
}

export class Config {

  /**
   * @deprecated It should be removed later
   */
  @JsonProp({ enumeration: ["required", "optional"], optional: true })
  public keyUsages?: keyof typeof ConfigKeyUsagesEnum;

  /**
   * @deprecated It should be removed later
   */
  @JsonProp({ enumeration: ["required", "optional", "static"], optional: true })
  public token?: keyof typeof ConfigTokenEnum;

  @JsonProp({ type: TemplateConfig, optional: true })
  public template?: Record<keyof TemplateConfig, TemplateTypeConfig | undefined>;

}