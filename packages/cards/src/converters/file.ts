import { IJsonConverter } from "@peculiar/json-schema";
import { File, FileArchitecture, FileOS } from "../file";

const OS_LIST: FileOS[] = ["windows", "osx", "linux"];

const OS_ARCH_LIST: FileArchitecture[] = ["x86", "x64"];

export const JsonFileConverter: IJsonConverter<File[], any> = {
  fromJSON: (value: any, target: any) => {
    const res: File[] = [];

    if (typeof value !== "object") {
      throw new TypeError("Cannot parse File object. Please check JSON specification for the File");
    }

    for (const osName of OS_LIST) {
      const fileOs = value[osName];
      if (fileOs) {
        if (typeof fileOs === "string") {
          // string
          res.push(new File(fileOs, "any", osName));
        } else if (Array.isArray(fileOs)) {
          // string[]
          for (const item of fileOs) {
            res.push(new File(item, "any", osName));
          }
        } else if (typeof (fileOs) === "object") {
          // { x86, x64 }
          for (const osArch of OS_ARCH_LIST) {
            const item = fileOs[osArch];
            if (typeof item === "string") {
              res.push(new File(item, osArch, osName));
            } else if (Array.isArray(item)) {
              for (const item2 of item) {
                res.push(new File(item2, osArch, osName));
              }
            }
          }
        }
      }
    }

    return res;
  },
  toJSON: (value: File[], target: any) => {
    const res: any = {};
    for (const file of value) {
      if (file.arch === "any") {
        if (!res[file.os]) {
          res[file.os] = file.path;
        } else if (typeof res[file.os] === "string") {
          res[file.os] = [res[file.os], file.path];
        } else {
          res[file.os].push(file.path);
        }
      } else {
        const os: any = res[file.os] = res[file.os] ? res[file.os] : {};
        if (!os[file.arch]) {
          os[file.arch] = file.path;
        } else if (typeof os[file.arch] === "string") {
          os[file.arch] = [os[file.arch], file.path];
        } else {
          os[file.arch].push(file.path);
        }
      }
    }
    return res;
  },
};
