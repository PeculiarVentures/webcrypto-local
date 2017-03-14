import { SocketCrypto } from "../../socket";
import { BaseStorage } from "../storage";
import { CertificateStorage } from "./certificates";

export interface ApplicationStorageState {
    connectionState?: "close" | "open" | "opening" | "error";
}

export class ApplicationStorage extends BaseStorage<ApplicationStorageState> {

    public certificates: CertificateStorage;
    public socket: SocketCrypto;

    constructor() {
        super({
            connectionState: "opening",
        });

        this.socket = new SocketCrypto();
        this.socket.connect("localhost:8081")
            .on("listening", (event) => {
                this.setState({ connectionState: "open" });
            })
            .on("closed", (event) => {
                this.setState({ connectionState: "close" });
            })
            .on("error", (event) => {
                this.setState({ connectionState: "error" });
            });

        this.certificates = new CertificateStorage(this.socket);
    }

}
