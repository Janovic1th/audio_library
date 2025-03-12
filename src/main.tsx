import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.tsx'
import { AuthProvider } from "react-oidc-context";
// import awsConfig from './';
// import {Amplify} from "aws-amplify";
//
// Amplify.configure(awsConfig);

const cognitoAuthConfig = {
    authority: "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_WwsAQItUe",
    client_id: "5c05aqpqc4mfeu3ig3fbrvefs9",
    redirect_uri: "http://localhost:5173/",
    response_type: "code",
    scope: "email openid phone",
};

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <AuthProvider {...cognitoAuthConfig}>
            <App />
        </AuthProvider>
    </React.StrictMode>
);
