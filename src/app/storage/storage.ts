import { EventEmitter } from "events";
import { STORAGE_EVENT_CHANGE } from "./decorator";

export interface StorageProps<T extends BaseStorage<any>> {
    storage: T;
}

export class BaseStorage<T> extends EventEmitter {

    public state: T;

    public constructor(state: T = {} as any) {
        super();
        this.state = state;
    }

    public on(event: "change", cb: (state: T) => void): this;
    public on(event: string | symbol, listener: Function): this {
        return super.on.apply(this, arguments);
    }

    public once(event: "change", cb: (state: T) => void): this;
    public once(event: string | symbol, listener: Function): this {
        return super.once.apply(this, arguments);
    }

    public setState(state: T = {} as any, cb?: Function) {
        const inState = state as any;
        const thisState = this.state as any;
        if (typeof state === "object") {
            for (const i in state) {
                thisState[i] = inState[i];
            }
            this.emit(STORAGE_EVENT_CHANGE, inState);
            if (cb) {
                cb();
            }
        } else {
            throw new Error("Wrong type of 'state'. Must be Object");
        }
    }
}

export interface BaseStorageCollectionState<T> {
    items?: T[];
}

export class BaseStorageCollection<I, T extends BaseStorageCollectionState<I>> extends BaseStorage<T> {

    private static defaultState() {
        return {
            items: [],
        } as any;
    }

    public get length() {
        return this.getIterator().length;
    }

    constructor() {
        super(BaseStorageCollection.defaultState());
    }

    public items(index: number): I {
        return this.getIterator()[index];
    }

    public add(item: I) {
        this.getIterator().push(item);

        this.emit("change", this.state);
    }

    public addRange(items: I[] | BaseStorageCollection<I, T>) {
        const arrayItems = !Array.isArray(items) ? items.getIterator() : items;
        arrayItems.forEach((item) => this.getIterator().push(item));

        this.emit("change", this.state);
    }

    public indexOf(item: I) {
        return this.getIterator().indexOf(item);
    }

    public pop() {
        const res = this.getIterator().pop();

        if (res) {
            this.emit("change", this.state);
        }

        return res;
    }

    public removeAt(index: number) {
        this.state.items = this.getIterator().filter((item, i) => i !== index);

        this.emit("change", this.state);
    }

    public remove(item: I) {
        const index = this.indexOf(item);
        if (index > -1) {
            this.removeAt(index);
        }
    }

    public removeRange(range: number[]) {
        this
            .filter((item, index) => range.indexOf(index) > -1)
            .forEach((item) => this.state.items = this.getIterator().filter((item2) => item2 !== item));

        this.emit("change", this.state);
    }

    public clear() {
        this.state.items = new Array();

        this.emit("change", this.state);
    }

    public getIterator(): I[] {
        return this.state.items!;
    }

    public forEach(cb: (item: I, index: number, array: I[]) => void, thisArg?: any) {
        this.getIterator().forEach(cb);
    }

    public map<U>(cb: (item: I, index: number, array: I[]) => U) {
        return this.getIterator().map<U>(cb);
    }

    public filter(cb: (item: I, index: number, array: I[]) => boolean) {
        const res = new (this.constructor as any)() as BaseStorageCollection<I, T>;
        const filtered = this.getIterator().filter(cb);
        res.state.items = filtered;
        return res;
    }

    public sort(cb: (a: I, b: I) => number) {
        const res = new (this.constructor as any)() as BaseStorageCollection<I, T>;
        const sorted = this.getIterator().sort(cb);
        res.state.items = sorted;
        return res;
    }

    public every(cb: (value: I, index: number, array: I[]) => boolean) {
        return this.getIterator().every(cb);
    }

    public some(cb: (value: I, index: number, array: I[]) => boolean) {
        return this.getIterator().some(cb);
    }

    public isEmpty() {
        return this.length === 0;
    }
}
