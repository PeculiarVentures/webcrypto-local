export type FileArchitecture = "x64" | "x86" | "any";
export type FileOS = "windows" | "linux" | "osx";

export class File {
  public path: string;
  public arch: FileArchitecture;
  public os: FileOS;

  constructor(path: string, arch: FileArchitecture, os: FileOS) {
    this.path = path;
    this.arch = arch;
    this.os = os;
  }
}
