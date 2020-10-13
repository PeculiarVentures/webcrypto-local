import { EventEmitter } from "events";

export declare type LogLevel = "error" | "warn" | "info" | "debug";

export declare type LogHandler = (level: LogLevel, source: string, message: string, data?: LogData) => void;

export interface LogData {
  [key: string]: any;
}

export abstract class EventLogEmitter extends EventEmitter {

  public abstract source: string;

  public on(event: "info", listener: LogHandler): this;
  public on(event: string | symbol, listener: (...args: any[]) => void): this;
  public on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  public once(event: "info", listener: LogHandler): this;
  public once(event: string | symbol, listener: (...args: any[]) => void): this;
  public once(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.once(event, listener);
  }

  public emit(event: "info", level: LogLevel, source: string, message: string, data?: LogData): boolean;
  public emit(event: string | symbol, ...args: any[]): boolean;
  public emit(event: string | symbol, ...args: any[]) {
    return super.emit(event, ...args);
  }

  protected log(level: LogLevel, message: string, data?: LogData) {
    this.emit("info", level, this.source, message, data);
  }

}