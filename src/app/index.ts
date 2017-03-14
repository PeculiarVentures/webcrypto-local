import * as ReactDOM from "react-dom";
import { Application } from "./app";
const injectTapEventPlugin = require("react-tap-event-plugin");

injectTapEventPlugin();

ReactDOM.render(Application, document.querySelector("#react-app"));
