import { Dialog, FlatButton, FontIcon, IconButton, Toolbar, ToolbarGroup } from "material-ui";
import * as React from "react";
import { CertificateDetail } from "../components/certificate_detail";
import { CertificateList } from "../components/certificate_list";
import { ApplicationStorage } from "../data/application";
import { StorageProps } from "../storage";

export interface FormCertificatesProps extends StorageProps<ApplicationStorage> { };
export interface FormCertificatesStates {
    certDetailOpen?: boolean;
    certificate?: IX509Certificate;
};

export class FormCertificates extends React.Component<FormCertificatesProps, FormCertificatesStates> {

    public static get defaultProps(): Partial<FormCertificatesProps> {
        return {};
    }

    protected fileField: HTMLInputElement;

    constructor(props: FormCertificatesProps) {
        super(props);

        this.state = {};

        this.onImportClick = this.onImportClick.bind(this);
    }

    public componentDidMount() {
        if (!this.props.storage.certificates.length) {
            // try to load only if it's empty
            if (this.props.storage.socket.state !== 1) {
                // Load after connected
                this.props.storage.socket.once("listening", () => {
                    this.props.storage.certificates.load();
                });
            } else {
                this.props.storage.certificates.load();
            }
        }
    }

    public render() {
        return (
            <div>
                <h1>Certificates</h1>
                <Toolbar>
                    <ToolbarGroup>
                        <IconButton tooltip="Create request">
                            <FontIcon className="material-icons">add</FontIcon>
                        </IconButton>
                        <IconButton tooltip="import" onClick={this.onImportClick}>
                            <FontIcon className="material-icons">file_upload</FontIcon>
                        </IconButton>
                    </ToolbarGroup>
                </Toolbar>
                <div hidden>
                    <input ref={(e) => this.fileField = e} type="file" />
                </div>
                <CertificateList storage={this.props.storage.certificates}
                    onCertificateDetail={(cert) => {
                        this.setState({
                            certDetailOpen: true,
                            certificate: cert,
                        });
                    }}
                />
                <Dialog
                    title="Detail info"
                    actions={[
                        <FlatButton label="Close" onClick={() => { this.setState({ certDetailOpen: false }); }} />,
                    ]}
                    modal={false}
                    open={this.state.certDetailOpen}
                    onRequestClose={() => this.setState({ certDetailOpen: false })}
                    autoScrollBodyContent={true}
                >
                    <CertificateDetail certificate={this.state.certificate} />
                </Dialog>
            </div >
        );
    }

    protected onImportClick() {
        console.log("click");
        this.fileField.click();

        this.fileField.onchange = () => {
            const reader = new FileReader();
            reader.onload = () => {

                const arrayBuffer = reader.result;

                const storage = this.props.storage.socket.certStorage;
                storage.importCert("x509", arrayBuffer, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" } as any, ["sign", "verify"])
                    .then((cert) => {
                        return storage.setItem(cert.id, cert);
                    })
                    .then(() => {
                        console.info("Certificate added to storage");
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            };
            reader.readAsArrayBuffer(this.fileField.files[0]);
        };
    }

}
