import { JsonParser, JsonSerializer } from "@peculiar/json-schema";
import { Card, Cards, Driver, File, Variables } from "@webcrypto-local/cards";
import * as assert from "assert";

context("Cards JSON", () => {

  it("parse", () => {
    const cards = JsonParser.fromJSON({
      version: "1.2.3",
      cards: [
        {
          atr: "token01",
          name: "Token01",
          readOnly: true,
          driver: "driver01",
        },
        {
          atr: "token02",
          name: "Token02",
          readOnly: false,
          driver: "driver01",
        },
        {
          atr: "token03",
          name: "Token03",
          driver: "driver02",
        },
      ],
      drivers: [
        {
          id: "driver01",
          name: "Driver01",
          file: {
            linux: "linux/pkcs11.so",
            osx: ["osx/pkcs11_1.dylib", "osx/pkcs11_2.dylib"],
            windows: {
              x86: "windows/pkcs11.dll",
              x64: ["windows/pkcs11_1.dll", "windows/pkcs11_2.dll"],
            },
          },
        },
        {
          id: "driver02",
          name: "Driver01",
          file: {
            windows: "windows/pkcs11.dll",
          },
        },
      ],
      vars: {
        custom: "variable",
      },
    }, { targetSchema: Cards });

    assert.equal(cards.version, "1.2.3");
    assert.equal(cards.cards.length, 3);
    assert.deepEqual(cards.cards[0], {
      atr: "token01",
      name: "Token01",
      readOnly: true,
      driver: "driver01",
    });

    assert.equal(cards.drivers.length, 2);
    assert.deepEqual(cards.drivers[0], {
      id: "driver01",
      name: "Driver01",
      files: [
        { path: "windows/pkcs11.dll", arch: "x86", os: "windows" },
        { path: "windows/pkcs11_1.dll", arch: "x64", os: "windows" },
        { path: "windows/pkcs11_2.dll", arch: "x64", os: "windows" },
        { path: "osx/pkcs11_1.dylib", arch: "any", os: "osx" },
        { path: "osx/pkcs11_2.dylib", arch: "any", os: "osx" },
        { path: "linux/pkcs11.so", arch: "any", os: "linux" },
      ],
    });
  });

  it("serialize", () => {

    const cards = new Cards();
    cards.version = "1.2.3";
    cards.cards.push(Object.assign(new Card(), {
      atr: "token01",
      driver: "driver01",
      name: "Token01",
      readOnly: true,
    }));
    cards.drivers.push(Object.assign(new Driver(), {
      id: "driver01",
      name: "Driver01",
      files: [
        new File("windows/pkcs11.dll", "x86", "windows"),
        new File("windows/pkcs11_1.dll", "x64", "windows"),
        new File("windows/pkcs11_2.dll", "x64", "windows"),
        new File("osx/pkcs11_1.dylib", "any", "osx"),
        new File("osx/pkcs11_2.dylib", "any", "osx"),
        new File("linux/pkcs11.so", "any", "linux"),
      ],
    }));
    cards.variables = new Variables();
    cards.variables.custom = "variable";

    const json = JsonSerializer.toJSON(cards);
    assert.deepEqual(json, {
      version: "1.2.3",
      cards: [
        {
          atr: "token01",
          name: "Token01",
          readOnly: true,
          driver: "driver01",
        },
      ],
      drivers: [
        {
          id: "driver01",
          name: "Driver01",
          file: {
            linux: "linux/pkcs11.so",
            osx: ["osx/pkcs11_1.dylib", "osx/pkcs11_2.dylib"],
            windows: {
              x86: "windows/pkcs11.dll",
              x64: ["windows/pkcs11_1.dll", "windows/pkcs11_2.dll"],
            },
          },
        },
      ],
      vars: {
        custom: "variable",
      },
    });
  });

});
