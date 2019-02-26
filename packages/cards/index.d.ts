export interface JsonCard {
  atr: string;
  name: string;
  mask?: string;
  readOnly?: boolean;
  driver: string;
}

export interface JsonOsArch {
  x64: string | string[];
  x86: string | string[];
}

export type JsonOsType = string | string[] | JsonOsArch;

export interface JsonDriver {
  id: string;
  name?: string;
  file: {
    [os: string]: JsonOsType;
    windows: JsonOsType;
    linux: JsonOsType;
    osx: JsonOsType;
  };
}

export interface JsonCardConfig {
  vars?: { [key: string]: string; };
  cards: JsonCard[];
  drivers: JsonDriver[];
}
