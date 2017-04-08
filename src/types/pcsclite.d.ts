import { EventEmitter } from "events";

interface Status {
    state: number;
    atr?: Buffer;
}

declare class PCSCLite extends EventEmitter {
    public start(err: Error, data: any): void;
    public close(): void;

    public on(event: "error", cb: (err: Error) => void): this;
    public on(event: "reader", cb: (reader: CardReader) => void): this;
    public on(event: "status", cb: (status: Status) => void): this;
}

type CardReaderConnectOptions = {
    share_mode?: number;
    protocol?: number
}

declare class CardReader extends EventEmitter {

    public name: string;
    public connected: boolean;
    public state: number;

    // Share Mode
    public SCARD_SHARE_SHARED: number;
    public SCARD_SHARE_EXCLUSIVE: number;
    public SCARD_SHARE_DIRECT: number;

    // Protocol
    public SCARD_PROTOCOL_T0: number;
    public SCARD_PROTOCOL_T1: number;
    public SCARD_PROTOCOL_RAW: number;

    // State
    public SCARD_STATE_UNAWARE: number;
    public SCARD_STATE_IGNORE: number;
    public SCARD_STATE_CHANGED: number;
    public SCARD_STATE_UNKNOWN: number;
    public SCARD_STATE_UNAVAILABLE: number;
    public SCARD_STATE_EMPTY: number;
    public SCARD_STATE_PRESENT: number;
    public SCARD_STATE_ATRMATCH: number;
    public SCARD_STATE_EXCLUSIVE: number;
    public SCARD_STATE_INUSE: number;
    public SCARD_STATE_MUTE: number;

    // Disconnect disposition
    public SCARD_LEAVE_CARD: number;
    public SCARD_RESET_CARD: number;
    public SCARD_UNPOWER_CARD: number;
    public SCARD_EJECT_CARD: number;

    constructor(readerName: string);

    public connect(cb: (err: Error, protocol: number) => void): void;
    public connect(options: CardReaderConnectOptions, cb: (err: Error, protocol: number) => void): void;
    public disconnect(cb: (err: Error) => void): void;
    public disconnect(disposition: number, cb: (err: Error) => void): void;
    public transmit(data: Buffer, resLength: number, protocol: number, cb: (err: Error, data: Buffer) => void): void
    public close(): void;

    public on(event: "error", cb: (err: Error) => void): this;
    public on(event: "status", cb: (status: Status) => void): this;
    public on(event: "end", cb: () => void): this;

    protected get_status(cb: (err: Error, state: number, atr: Buffer) => void): void;
}

export as namespace PCSCLite;