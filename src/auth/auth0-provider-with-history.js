import React from "react";
// import {useHistory} from "react-router-dom";
import {Auth0Provider} from "@auth0/auth0-react";
import config from "./auth_config"

const Auth0ProviderWithHistory = ({children}) => {
    // const history = useHistory();
    const domain = config.AUTH_DOMAIN;
    const clientId = config.AUTH_CLIENT_ID;
    const audience = config.AUTH_AUDIENCE;

    // const onRedirectCallback = (appState) => {
    //     history.push(appState?.returnTo || window.location.pathname);
    // };

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            redirectUri={window.location.origin}
            // onRedirectCallback={onRedirectCallback}
            audience={audience}
        >
            {children}
        </Auth0Provider>
    );
};

export default Auth0ProviderWithHistory;