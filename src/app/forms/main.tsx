import { AppBar } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as React from "react";
import { ConnectionState } from "../components/connection_state";
import { NavigationMenu } from "../components/navigation";
import { ApplicationStorage } from "../data/application";
import { Storage, StorageProps } from "../storage";

export interface MainFormProps extends StorageProps<ApplicationStorage> {
    main?: JSX.Element;
};
export interface MainFormStates { };

@Storage({ filter: ["connectionState"] })
export class FormMain extends React.Component<MainFormProps, MainFormStates> {

    public static get defaultProps(): Partial<MainFormProps> {
        return {};
    }

    constructor(props: MainFormProps) {
        super(props);

        this.state = {};
    }

    public render() {
        console.log(this.props);
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title="WebCrypto Socket"
                        showMenuIconButton={false}
                    />
                    <div style={{ display: "table", width: "100%", height: "100%" }}>
                        <div style={{ display: "table-row", height: "100%"}}>
                            <div style={{ display: "table-cell", minWidth: 300 }}>
                                <NavigationMenu />
                            </div>
                            <div style={{ display: "table-cell", width: "100%" }}>
                                {this.props.main}
                            </div>
                        </div>
                        <div style={{ display: "table-row" }}>
                            <ConnectionState state={this.props.storage.state.connectionState} />
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }

}
