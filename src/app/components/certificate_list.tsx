import { FontIcon, IconButton, Menu, MenuItem, Popover, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from "material-ui";
import * as React from "react";
import { CertificateStorage } from "../data/certificates";
import { Storage, StorageProps } from "../storage";

const style: { [key: string]: React.CSSProperties } = {
    Table: {
        width: "100%",
    },
    ColumnID: {
    },
    ColumnName: {
    },
    ColumnType: {
    },
    ColumnAction: {
        width: 48,
    },
};

export interface CertificateListProps extends StorageProps<CertificateStorage> {
    onCertificateDetail?: (cert: IX509Certificate) => void;
};
export interface CertificateListStates {
    certItemMenu?: string;
    certItemElement?: Element;
};

@Storage()
export class CertificateList extends React.Component<CertificateListProps, CertificateListStates> {

    public static get defaultProps(): Partial<CertificateListProps> {
        return {};
    }

    constructor(props: CertificateListProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <Table style={style.Table}>
                <TableHeader>
                    <TableRow>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Algorithm</TableHeaderColumn>
                        <TableHeaderColumn>Usages</TableHeaderColumn>
                        <TableHeaderColumn>Type</TableHeaderColumn>
                        <TableHeaderColumn style={style.ColumnAction}>
                            <IconButton>
                                <FontIcon className="material-icons">more_vert</FontIcon>
                            </IconButton>
                        </TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        this.props.storage.map((item, index) => {
                            const itemId = `cert-${index}`;
                            return (
                                <TableRow key={index}>
                                    <TableRowColumn>{item.name}</TableRowColumn>
                                    <TableRowColumn >{item.publicKey.algorithm.name}</TableRowColumn>
                                    <TableRowColumn>{item.publicKey.usages.join(", ")}</TableRowColumn>
                                    <TableRowColumn>{item.type}</TableRowColumn>
                                    <TableRowColumn style={style.ColumnAction}>
                                        <IconButton onClick={(e) => {
                                            e.stopPropagation();

                                            this.setState({
                                                certItemMenu: itemId,
                                                certItemElement: e.currentTarget as any,
                                            });
                                        }}>
                                            <FontIcon className="material-icons">more_vert</FontIcon>
                                        </IconButton>
                                        <Popover ref={itemId}
                                            open={itemId === this.state.certItemMenu}
                                            anchorEl={this.state.certItemElement}
                                            anchorOrigin={{ horizontal: "left", vertical: "top" }}
                                            onRequestClose={() => this.setState({ certItemMenu: "" })}
                                        >
                                            <Menu>
                                                <MenuItem primaryText="Info" onClick={this.onInfoClick.bind(this, item)} />
                                                <MenuItem primaryText="Copy" />
                                                <MenuItem primaryText="Remove" />
                                            </Menu>
                                        </Popover>
                                    </TableRowColumn>
                                </TableRow>
                            );
                        })
                    }
                </TableBody>
            </Table>
        );
    }

    protected onInfoClick(cert: IX509Certificate) {
        this.setState({ certItemMenu: "" });
        if (this.props.onCertificateDetail) {
            this.props.onCertificateDetail(cert);
        }
    }

}
