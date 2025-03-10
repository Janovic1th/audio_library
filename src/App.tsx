import React, { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

const API_URL = "https://71vd8bbzrl.execute-api.us-east-1.amazonaws.com";

const App: React.FC = () => {
    const [message, setMessage] = useState<string>("");

    const callLambda = async () => {
        try {
            const response = await axios.get<{ message: string }>(API_URL);
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Error calling Lambda!" + error);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>React + AWS Lambda</h1>
            <button onClick={callLambda}>Call Lambda</button>
            <p>{message}</p>
        </div>
    );
};

// function App() {
//   const [count, setCount] = useState(0)
//
//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Matuš + Janko</h1>
//       <h1>Audio Library</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

export default App
