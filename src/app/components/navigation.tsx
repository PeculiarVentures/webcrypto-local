import { List, ListItem } from "material-ui";
import * as React from "react";
import { hashHistory } from "react-router";

export interface NavigationMenuProps { };
export interface NavigationMenuStates { };

export class NavigationMenu extends React.Component<NavigationMenuProps, NavigationMenuStates> {

    public static get defaultProps(): Partial<NavigationMenuProps> {
        return {};
    }

    constructor(props: NavigationMenuProps) {
        super(props);

        this.state = {};

        this.onHomeClick = this.onHomeClick.bind(this);
        this.onCertificatesClick = this.onCertificatesClick.bind(this);
    }

    public render() {
        return (
            <List>
                <ListItem primaryText="Home" onClick={this.onHomeClick}></ListItem>
                <ListItem primaryText="Certificates" onClick={this.onCertificatesClick}></ListItem>
            </List>
        );
    }

    protected onHomeClick() {
        hashHistory.push("/");
    }

    protected onCertificatesClick() {
        hashHistory.push("/certificates");
    }

}