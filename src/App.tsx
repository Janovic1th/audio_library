import React, { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import { useAuth } from "react-oidc-context";


const API_URL = "https://edk9b6uukd.execute-api.eu-central-1.amazonaws.com/dev/";

const App: React.FC = () => {
    const [message, setMessage] = useState<string>("d");
    const auth = useAuth()

    const callLambda = async () => {
        if (auth.isAuthenticated) {
            try {
                const token = auth.user?.access_token;
                if (!token) {
                    console.error("Access token is missing!");
                    return;
                }
                console.log(token);
                // Use Authorization header with the access token from Cognito
                const response = await axios.get<{ message: string }>(API_URL, {
                    headers: {
                        Authorization: `Bearer ${auth.user?.access_token}`,
                    },
                });
                setMessage(response.data.message); // Set the message returned from Lambda
            } catch (error) {
                setMessage("Error calling Lambda: " + error); // Handle any errors
            }
        } else {
            setMessage("User not authenticated.");
        }

    };

    const signOutRedirect = () => {
        const clientId = "5c05aqpqc4mfeu3ig3fbrvefs9";
        const logoutUri = "http://localhost:5173/";
        const cognitoDomain = "https://eu-central-1wwsaqitue.auth.eu-central-1.amazoncognito.com";
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    };

    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    if (auth.error) {
        return <div>Encountering error... {auth.error.message}</div>;
    }

    if (auth.isAuthenticated) {
        return (
            <div>
                <h1>Welcome, {auth.user?.profile.email}</h1>
                <button onClick={callLambda}>Call Lambda</button>
                <p>{message}</p>
                {/* Do not display tokens */}
                <button onClick={() => auth.removeUser()}>Sign out</button>
                {/*<button onClick={() => signOutRedirect()}>Sign out</button>*/}
            </div>
        );
    }

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <button onClick={() => auth.signinRedirect()}>Sign in</button>
            <button onClick={() => signOutRedirect()}>Sign out</button>
            <h1>React + AWS Lambda</h1>
            <button onClick={callLambda}>Call Lambda</button>
            <p>{message}</p>
        </div>
    );
};

export default App
