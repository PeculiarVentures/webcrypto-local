/* eslint-disable import/no-extraneous-dependencies */
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  run, spawn, Logger, download, extract,
} from "./utils";

const solutionFolder = path.join(__dirname, "..");
const utilsFolder = path.join(solutionFolder, "utils");
const nssFolder = path.join(utilsFolder, "nss");
const openscFolder = path.join(utilsFolder, "opensc");

async function macOS() {
  const nssUrl = "https://github.com/PeculiarVentures/fortify/releases/download/binaries/nss-macos.zip";
  const openscUrl = "https://github.com/PeculiarVentures/fortify/releases/download/binaries/opensc-macos.zip";
  const pvpkcs11Url = "https://github.com/PeculiarVentures/fortify/releases/download/binaries/libpvpkcs11.dylib";
  const pvpkcs11File = "libpvpkcs11.dylib";

  if (!fs.existsSync(utilsFolder)) {
    fs.mkdirSync(utilsFolder);
    Logger.info(`Folder "${utilsFolder}" created`);
  }

  if (!fs.existsSync(pvpkcs11File)) {
    await download(pvpkcs11Url, path.join(utilsFolder, pvpkcs11File));
    Logger.info("pvpkcs11 library was downloaded");
  }

  if (!fs.existsSync(nssFolder)) {
    fs.mkdirSync(nssFolder);
    Logger.info(`Folder "${nssFolder}" created`);

    const nssZip = path.join(utilsFolder, "nss.zip");
    await download(nssUrl, nssZip);
    try {
      await extract(nssZip, nssFolder);
      Logger.info("NSS files were copied to nss folder");
    } finally {
      fs.unlinkSync(nssZip);
    }
  }

  if (!fs.existsSync(openscFolder)) {
    fs.mkdirSync(openscFolder);
    Logger.info(`Folder "${openscFolder}" created`);

    const openscZip = `${openscFolder}/opensc.zip`;
    await download(openscUrl, openscZip);
    try {
      await extract(openscZip, openscFolder);
      Logger.info("OpenSC files were copied to nss folder");
    } finally {
      fs.unlinkSync(openscZip);
    }
  }

  await spawn("install_name_tool", [
    "-change",
    "libopensc.6.dylib",
    path.join(openscFolder, "libopensc.6.dylib"),
    path.join(openscFolder, "opensc-pkcs11.so"),
  ]);
}

async function win32() {
  const platform = process.env.Platform || "x64";

  const pvpkcs11Url = `https://github.com/PeculiarVentures/fortify/releases/download/binaries/pvpkcs11-win32-${platform}.dll`;
  const pvpkcs11File = "pvpkcs11.dll";
  const nssUrl = `https://github.com/PeculiarVentures/fortify/releases/download/binaries/nss-runtime-win32-${platform}.zip`;
  const openscUrl = `https://github.com/PeculiarVentures/fortify/releases/download/binaries/opensc-win32-${platform}.zip`;


  if (!fs.existsSync(utilsFolder)) {
    fs.mkdirSync(utilsFolder);
    Logger.info(`Folder "${utilsFolder}" created`);
  }

  if (!fs.existsSync(pvpkcs11File)) {
    await download(pvpkcs11Url, path.join(utilsFolder, pvpkcs11File));
    Logger.info("pvpkcs11 library was downloaded");
  }

  if (!fs.existsSync(nssFolder)) {
    fs.mkdirSync(nssFolder);
    Logger.info(`Folder "${nssFolder}" created`);

    const nssZip = path.join(utilsFolder, "nss.zip");
    await download(nssUrl, nssZip);
    try {
      await extract(nssZip, nssFolder);
      Logger.info("NSS files were copied to nss folder");
    } finally {
      fs.unlinkSync(nssZip);
    }
  }

  if (!fs.existsSync(openscFolder)) {
    fs.mkdirSync(openscFolder);
    Logger.info(`Folder "${openscFolder}" created`);

    const openscZip = `${openscFolder}/opensc.zip`;
    await download(openscUrl, openscZip);
    try {
      await extract(openscZip, openscFolder);
      Logger.info("OpenSC files were copied to nss folder");
    } finally {
      fs.unlinkSync(openscZip);
    }
  }
}

async function linux() {
  const openscUrl = "https://github.com/PeculiarVentures/fortify/releases/download/binaries/opensc-linux.zip";

  if (!fs.existsSync(utilsFolder)) {
    fs.mkdirSync(utilsFolder);
    Logger.info(`Folder "${utilsFolder}" created`);
  }

  if (!fs.existsSync(openscFolder)) {
    fs.mkdirSync(openscFolder);
    Logger.info(`Folder "${openscFolder}" created`);

    const openscZip = `${openscFolder}/opensc.zip`;
    await download(openscUrl, openscZip);
    try {
      await extract(openscZip, openscFolder);
      Logger.info(`OpenSC files were copied to ${openscFolder} folder`);
    } finally {
      fs.unlinkSync(openscZip);
    }
  }
}

async function main() {
  const platform = os.platform();
  Logger.debug(`Platform: ${platform}`);
  switch (platform) {
    case "darwin":
      return macOS();
    case "linux":
      return linux();
    case "win32":
      return win32();
    default:
      throw new Error("Unsupported OS");
  }
}

run(main);
