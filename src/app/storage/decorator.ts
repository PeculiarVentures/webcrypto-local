export const STORAGE_EVENT_CHANGE = "change";

export type StorageOptions = {
    filter?: string[];
};

export function Storage(options: StorageOptions = {}): ClassDecorator {
    return (target: any) => {
        // tslint:disable-next-line:only-arrow-functions
        target.prototype.__onModelChange = function (state: any) {
            let mustUpdate = false;
            if (options.filter) {
                for (const key in state) {
                    if (options.filter.indexOf(key) > -1) {
                        mustUpdate = true;
                    }
                }
            } else {
                mustUpdate = true;
            }

            if (mustUpdate) {
                this.setState({});
            }
        };

        const oldCompDidMount = target.prototype.componentDidMount;
        // tslint:disable-next-line:only-arrow-functions
        target.prototype.componentDidMount = function () {
            this.__onModelChange = this.__onModelChange.bind(this);
            this.props.storage.on(STORAGE_EVENT_CHANGE, this.__onModelChange);
            if (oldCompDidMount) {
                oldCompDidMount.call(this);
            }
        };

        const oldCompWillUnmount = target.prototype.componentWillUnmount;
        // tslint:disable-next-line:only-arrow-functions
        target.prototype.componentWillUnmount = function () {
            this.props.storage.removeListener(STORAGE_EVENT_CHANGE, this.__onModelChange);
            if (oldCompWillUnmount) {
                oldCompWillUnmount.call(this);
            }
        };
    };
}
