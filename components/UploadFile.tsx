import React, {useCallback, useState} from "react";
import axios from "axios";
import {useDropzone} from "react-dropzone";

const API_URL = "https://edk9b6uukd.execute-api.eu-central-1.amazonaws.com/dev/get-url";

interface UploadFileProps {
    onUploadSuccess: () => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ onUploadSuccess }) => {    const [message, setMessage] = useState<string>("d");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // const auth = useAuth()

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file.type === "application/pdf") {
            setSelectedFile(file);
            setMessage("PDF LOADED");
        } else {
            setMessage("Only PDF files are allowed.");
        }
    }, []);

    const uploadFile = async () => {
        if (!selectedFile) {
            setMessage("No file selected.");
            return;
        }

        try {
            const requestBody = {
                filename: selectedFile.name,
            };

            const { data } = await axios.post(API_URL, requestBody, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Upload successful1!", data);
            try {

                const S3_upload_url = data.body.uploadUrl;

                const response_s3 = await axios.put(S3_upload_url, selectedFile, {
                    headers: {
                        "Content-Type": selectedFile.type,
                    },
                });

                console.log("Upload successful to S3!", response_s3);
                onUploadSuccess();
            } catch (error) {
                console.error("Upload failed", error);
            }

            setMessage("File uploaded successfully.");
            console.log("Upload successful:", data);
        } catch (error) {
            setMessage("Upload failed: " + error);
            console.error("Error uploading file:", error);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, });
    return (
        <div>
            <div {...getRootProps()} style={{ border: "2px dashed #000", padding: "20px", cursor: "pointer" }}>
                <input {...getInputProps()} />
                {isDragActive ? <p>Drop the file here...</p> : <p>Drag & drop a PDF file here, or click to select one.</p>}
            </div>
            {selectedFile && <p>Selected File: {selectedFile.name}</p>}
            {selectedFile && <button onClick={uploadFile}>Send</button>}
            <p>{message}</p>
        </div>
    );
};

export default UploadFile;