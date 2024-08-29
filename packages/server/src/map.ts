import * as core from "@webcrypto-local/core";
import { LogHandler } from "@webcrypto-local/core";

export interface MapChangeEvent<T> {
  key: string;
  item: T;
}
export type MapChangeHandle<T> = (e: MapChangeEvent<T>) => void;

export abstract class Map<T>
  extends core.EventLogEmitter
  implements Iterable<[string, T]>
{
  [Symbol.iterator](): Iterator<[string, T], any, undefined> {
    const keys = Object.keys(this.items);
    let index = 0;
    return {
      next: () => {
        if (index < keys.length) {
          const key = keys[index];
          const item = this.items[key];
          index++;
          return {
            value: [key, item],
            done: false,
          };
        }
        return {
          value: undefined,
          done: true,
        };
      },
    };
  }

  protected items: core.Assoc<T> = {};

  public get length() {
    return Object.keys(this.items).length;
  }

  public indexOf(item: T) {
    let index: string | null = null;
    this.some((item2, index2) => {
      if (item === item2) {
        index = index2;
        return true;
      }
      return false;
    });
    return index;
  }

  public on(event: "add", callback: MapChangeHandle<T>): this;
  public on(event: "remove", callback: MapChangeHandle<T>): this;
  public on(event: "info", listener: LogHandler): this;
  public on(event: string, callback: (...args: any[]) => void): this;
  public on(event: string, callback: (...args: any[]) => void): this {
    return super.on(event, callback);
  }

  public once(event: "add", callback: MapChangeHandle<T>): this;
  public once(event: "info", listener: () => void): this;
  public once(event: "remove", callback: MapChangeHandle<T>): this;
  public once(event: "info", listener: LogHandler): this;
  public once(event: string, callback: (...args: any[]) => void): this;
  public once(event: string, callback: (...args: any[]) => void): this {
    return super.once(event, callback);
  }

  public emit(event: "add", e: MapChangeEvent<T>): boolean;
  public emit(event: "remove", e: MapChangeEvent<T>): boolean;
  public emit(
    event: "info",
    level: core.LogLevel,
    source: string,
    message: string,
    data?: core.LogData
  ): boolean;
  public emit(event: string, ...args: any[]): boolean;
  public emit(event: string, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  public add(key: string, item: T) {
    this.items[key] = item;
    this.emit("add", {
      key,
      item,
    });
  }

  public remove(key: string) {
    const item = this.items[key];
    if (item) {
      delete this.items[key];
      this.emit("remove", {
        key,
        item,
      });
    }
  }

  public clear() {
    this.forEach((item, index) => {
      this.remove(index);
    });
  }

  public item(id: string): T {
    return this.items[id];
  }

  public forEach(
    callback: (item: T, index: string, array: this) => void
  ): this {
    for (const index in this.items) {
      callback(this.items[index], index, this);
    }
    return this;
  }

  public some(
    callback: (item: T, index: string, array: this) => boolean
  ): boolean {
    for (const index in this.items) {
      if (callback(this.items[index], index, this)) {
        return true;
      }
    }
    return false;
  }

  public map<R>(callback: (item: T, index?: string, array?: this) => R): R[] {
    const res: R[] = [];
    for (const index in this.items) {
      res.push(callback(this.items[index], index, this));
    }
    return res;
  }
}
