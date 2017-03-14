import { Divider, List, ListItem, Subheader } from "material-ui";
import * as React from "react";

export interface CertificateDetailProps {
    certificate: IX509Certificate;
};
export interface CertificateDetailStates { };

export class CertificateDetail extends React.Component<CertificateDetailProps, CertificateDetailStates> {

    public static get defaultProps(): Partial<CertificateDetailProps> {
        return {};
    }

    constructor(props: CertificateDetailProps) {
        super(props);

        this.state = {};
    }

    public render() {
        const cert = this.props.certificate;
        const subjectName = splitName(cert.subjectName);
        const issuerName = splitName(cert.issuerName || "");

        return (
            <div>
                <List>
                    <Subheader>General</Subheader>
                    <ListItem
                        primaryText="Type"
                        secondaryText={cert.type}
                    />
                </List>
                <Divider />
                <List>
                    <Subheader>Subject name</Subheader>
                    {
                        subjectName.map(((item) => (
                            <ListItem
                                key={item[0]}
                                primaryText={item[0]}
                                secondaryText={item[1]}
                            />
                        )))
                    }
                </List>
                {
                    issuerName ?
                        [
                            <Divider />,
                            <List>
                                <Subheader>Issuer name</Subheader>
                                {
                                    issuerName.map(((item) => (
                                        <ListItem
                                            key={item[0]}
                                            primaryText={item[0]}
                                            secondaryText={item[1]}
                                        />
                                    )))
                                }
                            </List>,
                        ]
                        :
                        null
                }
                <Divider />
                <List>
                    <Subheader>Public key</Subheader>
                    <ListItem
                        primaryText="Algorithm"
                        secondaryText={cert.publicKey.algorithm.name}
                    />
                    {
                        (cert.publicKey.algorithm as any).hash ?
                            <ListItem
                                primaryText="Hash"
                                secondaryText={(cert.publicKey.algorithm as any).hash.name}
                            />
                            : null
                    }
                    {
                        (cert.publicKey.algorithm as any).modulusLength ?
                            <ListItem
                                primaryText="Modulus bits"
                                secondaryText={(cert.publicKey.algorithm as any).modulusLength}
                            />
                            : null
                    }
                    {
                        (cert.publicKey.algorithm as any).publicExponent ?
                            <ListItem
                                primaryText="Modulus bits"
                                secondaryText={(cert.publicKey.algorithm as any).publicExponent[0] === 3 ? 3 : 65537}
                            />
                            : null
                    }
                    <ListItem
                        primaryText="Usages"
                        secondaryText={cert.publicKey.usages.join(", ")}
                    />
                </List>
            </div>
        );
    }

}

function splitName(x500Name: string) {
    if (x500Name) {
        return x500Name.split(",").map((item) => item.split("="));
    }
    return null;
}
