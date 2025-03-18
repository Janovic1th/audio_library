import React, { useState, useEffect } from "react";
import axios from "axios";

interface PdfFile {
    name: string;
    url: string;
}

interface PdfListProps {
    refreshKey: number;
}

const API_URL = "https://edk9b6uukd.execute-api.eu-central-1.amazonaws.com/dev/getAllFiles";


const PdfList: React.FC<PdfListProps> = ({ refreshKey }) => {
    const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPdfs = async () => {
        // Replace with your API Gateway endpoint that triggers your Lambda function
        setPdfFiles([]);
        axios.get(API_URL)
            .then((response) => {
                // Assuming the Lambda returns a JSON object like { files: [ { name, url }, ... ] }
                console.log(response);
                setPdfFiles(response.data.body);
                setLoading(false);
                console.log(pdfFiles);
            })
            .catch((err) => {
                console.error("Error fetching PDFs: ", err);
                setError("Error fetching PDFs");
                setLoading(false);
            });
    };

    useEffect(() => {
        setLoading(true);
        fetchPdfs();
    }, [refreshKey]);

    if (loading) {
        return <div>Loading PDFs...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }


    return (
        <div>
            <h2>PDF List</h2>
            {pdfFiles.length === 0 ? (
                <p>No PDFs found.</p>
            ) : (
                <ul>
                    {pdfFiles.map((pdf, index) => (
                        <li key={index}>
                            <a href={pdf.url} target="_blank" rel="noopener noreferrer">
                                {pdf.name}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PdfList;