// CryptoKey | X509Certificate | X509Request
interface LocalServerStorageItem {
  type: string | "private" | "public" | "x509" | "req";
}

export class LocalServerStorage {

  protected items: { [key: string]: LocalServerStorageItem } = {};

  get length() {
    return Object.keys(this.items).length;
  }

  public async clear() {
    this.items = {};
  }

  public async getItem(key: string) {
    return this.items[key] || null;
  }

  public async removeItem(key: string) {
    delete this.items[key];
  }

  public async setItem(key: string, data: LocalServerStorageItem) {
    const oldItem = await this.getItem(key);
    if (oldItem) {
      this.removeItem(key);
    }
    this.items[key] = data;
  }
}
