import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducer';
import handleAPI from './../../apis/handlAPI';

const UploadFile = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState("");
    const auth = useSelector(authSelector);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file!");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            // const response = await axios.post("http://localhost:9090/api/upload", formData, {
            //     headers: {
            //         "Content-Type": "multipart/form-data",
            //     },
            // });
            const response = await handleAPI("/api/upload",formData,"post", auth?.token);
            setFileContent(response.content);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file");
        }
    };

    return (
        <div>
            <h2>Upload Word File</h2>
            <input type="file" onChange={handleFileChange} accept=".docx" />
            <button onClick={handleUpload}>Upload</button>

            {fileContent && (
                <div>
                    <h3>File Content:</h3>
                    <pre>{fileContent}</pre>
                </div>
            )}
        </div>
    );
};
export default UploadFile;