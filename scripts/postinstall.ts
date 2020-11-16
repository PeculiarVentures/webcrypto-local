/* eslint-disable import/no-extraneous-dependencies */
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  run, spawn, Logger, download, extract, exec,
} from "./utils";
import { match } from "assert";

const solutionFolder = path.join(__dirname, "..");
const utilsFolder = path.join(solutionFolder, "utils");
const nssFolder = path.join(utilsFolder, "nss");
const openscFolder = path.join(utilsFolder, "opensc");

async function macOS() {
  const nssUrl = "https://github.com/PeculiarVentures/fortify/releases/download/binaries/nss-macos.zip";
  const openscUrl = "https://github.com/PeculiarVentures/fortify/releases/download/binaries/opensc-macos.zip";
  const pvpkcs11Url = "https://github.com/PeculiarVentures/fortify/releases/download/binaries/libpvpkcs11.dylib";
  const pvpkcs11File = path.join(utilsFolder, "libpvpkcs11.dylib");

  interface IDependency {
    name: string;
    type: "exec" | "rel";
  }

  function getDependencies(filePath: string) {
    const execRes = exec("otool", [
      "-L",
      filePath,
    ]);

    const lines = execRes
      .split("\n")
      .slice(1)
      .map(o => o.trim());
    const res: IDependency[] = [];
    for (const line of lines) {
      const reg = /([^ ]+) \(.+\)/g;
      let matches: RegExpExecArray | null = null;
      // tslint:disable-next-line: no-conditional-assignment
      while (matches = reg.exec(line)) {
        matches = /^\@executable_path\/([a-z0-9.]+)$|^([a-z0-9.]+)$/i.exec(matches[1]);
        if (matches) {
          res.push({
            name: matches[1] || matches[2],
            type: /^@executable_path/.test(matches[0])
              ? "exec"
              : "rel",
          });
        }
      }
    }

    return res;
  }

  async function updateDependencies(cwd: string, fileName: string) {
    Logger.info(`Update dependencies for ${path.join(cwd, fileName)} library`);
    const dependencies = getDependencies(path.join(cwd, fileName));

    for (const dependency of dependencies) {
      if (dependency.name !== fileName) {
        await updateDependencies(cwd, dependency.name);
      }

      await spawn("install_name_tool", [
        "-change",
        dependency.type === "exec"
          ? `@executable_path/${dependency.name}`
          : dependency.name,
        path.join(cwd, dependency.name),
        path.join(cwd, fileName),
      ]);
    }
  }

  if (!fs.existsSync(utilsFolder)) {
    fs.mkdirSync(utilsFolder);
    Logger.info(`Folder "${utilsFolder}" created`);
  }

  if (!fs.existsSync(pvpkcs11File)) {
    await download(pvpkcs11Url, pvpkcs11File);
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

    await updateDependencies(nssFolder, "libsoftokn3.dylib");
  }
  await updateDependencies(nssFolder, "libsoftokn3.dylib");
  await updateDependencies(nssFolder, "certutil");


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

    await updateDependencies(openscFolder, "opensc-pkcs11.so");
  }
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
