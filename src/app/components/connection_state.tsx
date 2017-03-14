import { FontIcon, IconButton } from "material-ui";
import { blueA700, greenA700, orangeA700, redA700 } from "material-ui/styles/colors";
import * as React from "react";

type ConnectionStateType = "open" | "opening" | "close" | "error";

export interface ConnectionStateProps {
    state: ConnectionStateType;
};
export interface ConnectionStateStates { };

export class ConnectionState extends React.Component<ConnectionStateProps, ConnectionStateStates> {

    public static get defaultProps(): Partial<ConnectionStateProps> {
        return {};
    }

    constructor(props: ConnectionStateProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <IconButton tooltip={this.props.state}>
                {this.stateToIcon(this.props.state)}
            </IconButton>
        );
    }

    protected stateToIcon(state: ConnectionStateType) {
        switch (state) {
            case "open": {
                return <FontIcon className="material-icons" color={greenA700}>signal_cellular_4_bar</FontIcon>;
            }
            case "opening": {
                return <FontIcon className="material-icons" color={orangeA700}>signal_cellular_null</FontIcon>;
            }
            case "close": {
                return <FontIcon className="material-icons" color={blueA700}>signal_cellular_off</FontIcon>;
            }
            case "error": {
                return <FontIcon className="material-icons" color={redA700}>signal_cellular_connected_no_internet_4_bar</FontIcon>;
            }
            default:
                throw new Error(`Unknown state of connection '${state}'`);
        }
    }

}
