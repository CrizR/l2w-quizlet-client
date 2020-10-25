import React from "react";
import {Route} from "react-router-dom";
import {withAuthenticationRequired} from "@auth0/auth0-react";
import LoadingComponent from "../components/loading/LoadingComponent";

const ProtectedRoute = ({component, ...args}) => (
    <Route
        component={withAuthenticationRequired(component, {
            onRedirecting: () => <LoadingComponent/>,
        })}
        {...args}
    />
);

export default ProtectedRoute;