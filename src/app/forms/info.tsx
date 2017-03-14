import { Paper } from "material-ui";
import * as React from "react";

export interface FormInfoProps { };
export interface FormInfoStates { };

export class FormInfo extends React.Component<FormInfoProps, FormInfoStates> {

    public static get defaultProps(): Partial<FormInfoProps> {
        return {};
    }

    constructor(props: FormInfoProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <Paper zDepth={2}>
                <h3>Information</h3>
                <p>
                    Information MUST be here
                </p>
            </Paper>
        );
    }

}
