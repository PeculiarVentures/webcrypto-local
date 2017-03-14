import * as React from "react";
import { Redirect, Route, Router } from "react-router";
import { ApplicationStorage } from "./data/application";
import { FormCertificates } from "./forms/certificates";
import { FormInfo } from "./forms/info";
import { FormMain } from "./forms/main";

const app = new ApplicationStorage();

function createElement(component: React.ReactType, props: any) {
    const Class = component as React.ComponentClass<any>;
    return <Class storage={app} {...props} />;
}

export const Application = (
    <Router createElement={createElement}>
        <Redirect from="/" to="/home" />
        <Route path="/" component={FormMain}>
            <Route path="/home" components={{ main: FormInfo }} />
            <Route path="certificates" components={{ main: FormCertificates }} />
        </Route>
    </Router>
);
