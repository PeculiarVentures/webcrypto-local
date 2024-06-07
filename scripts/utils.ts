import * as childProcess from "child_process";
import * as os from "os";
import * as fs from "fs";
import zip from "extract-zip";
import "colors";
import { prepareError } from "../packages/server/src/helper";

export class Logger {
  public static info(message: string) {
    this.log(message.cyan);
  }

  public static debug(message: string) {
    this.log(message.gray);
  }

  public static error(error: string | Error) {
    if (typeof error === "string") {
      this.log(error.red);
    } else {
      this.log(`${error.name}: ${error.message}`.red);
      this.debug(error.stack || "");
    }
  }

  public static log(message: string) {
    console.log(message);
  }
}

/**
 * Calls commands and print message about it to console
 * @param command
 * @param args
 * @param message
 */
export function spawn(command: string, args: string[] = []) {
  return new Promise<void>((resolve, reject) => {
    Logger.debug(`> ${command} ${args.join(" ")}`);

    let item: childProcess.ChildProcess;
    if (os.platform() === "win32") {
      item = childProcess.spawn(command, args, { stdio: "inherit", shell: "cmd" });
    } else {
      item = childProcess.spawn(command, args, { stdio: "inherit", shell: "bash" });
    }
    item
      .on("message", (msg: string) => {
        process.stdout.write(msg);
      })
      .on("close", (code) => {
        if (code) {
          reject(new Error(`Command finished with code ${code}`));
        } else {
          resolve();
        }
      })
      .on("error", reject);
  });
}

/**
 * Runs script and exits from program at the end
 * @param cb Script implementation
 */
export async function run(cb: () => Promise<void>) {
  try {
    await cb();

    process.exit(0);
  } catch (e) {
    Logger.error(prepareError(e));
    process.exit(1);
  }
}

export async function fetchWithProgress(url: string, onProgress: (receivedLength: number, contentLength: number) => void): Promise<Uint8Array> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Cannot download file from ${url} (${response.statusText})`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Cannot read response body");
  }

  // get content length
  const contentLengthHeader = response.headers.get("Content-Length");
  if (!contentLengthHeader) {
    throw new Error("Cannot get content length");
  }
  const contentLength = parseInt(contentLengthHeader, 10);

  let receivedLength = 0; // received that many bytes at the moment
  let chunks = []; // array of received binary chunks (comprises the body)
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(value);
    receivedLength += value.length;

    onProgress(receivedLength, contentLength);
  }

  // concatenate chunks into single Uint8Array
  let chunksAll = new Uint8Array(receivedLength);
  let position = 0;
  for (let chunk of chunks) {
    chunksAll.set(chunk, position);
    position += chunk.length;
  }

  return chunksAll;
}

/**
 * Downloads file
 * @param url URL to download
 * @param dest Destination file
 */
export async function download(url: string, dest: string) {
  Logger.debug(`Downloading ${url}`);

  const data = await fetchWithProgress(url, (receivedLength, contentLength) => {
    const percentage = (receivedLength / contentLength) * 100;
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`Download progress: ${percentage.toFixed(2)}%`);
  });
  process.stdout.write("\n");

  // write the data to the destination file
  fs.writeFileSync(dest, data);
  Logger.info(`Downloaded to ${dest}`);
}

export async function extract(zipFile: string, absolutePath: string) {
  await zip(zipFile, { dir: absolutePath });
}

export function exec(command: string, args: string[] = []): string {
  const commandLine = `${command} ${args.join(" ")}`;
  Logger.debug(`> ${commandLine}`);

  const res = childProcess.execSync(commandLine);
  return res.toString();
}