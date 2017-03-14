import { SocketCrypto } from "../../socket";
import { BaseStorageCollection, BaseStorageCollectionState } from "../storage";

export interface CertificateStorageItem extends ICertificateStorageItem {
    name?: string;
}

export interface CertificateStorageState extends BaseStorageCollectionState<CertificateStorageItem> {

}

export class CertificateStorage extends BaseStorageCollection<CertificateStorageItem, CertificateStorageState> {

    protected socket: SocketCrypto;

    constructor(socket: SocketCrypto) {
        super();
        this.socket = socket;
    }

    public async load() {
        const keys = await this.socket.certStorage.keys();
        const items: ICertificateStorageItem[] = [];
        for (const key of keys) {
            const item = await this.socket.certStorage.getItem(key);
            const storageItem: CertificateStorageItem = item;
            storageItem.name = /CN=([\w\s\-]+)/i.exec((item as any).subjectName)[1];
            items.push(item);
        }
        this.setState({ items });
    }

}
