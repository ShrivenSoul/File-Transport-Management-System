import React, { useState } from "react";
import "./LandingPage.css";

function LandingPage(){
    const [setSelectedFile] = useState(null);
    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        console.log(event.target.files[0]);
    }
    const onFileUpload = async (event) => {
            console.log("File sent!");
            const formData = new FormData(document.querySelector("#fileInput"));
            console.log(formData);
            // REPLACE LINK HERE WITH WHERE YOUR SERVER IS RUNNING
            const response = await fetch("http://localhost:3000/upload", {
                method: "POST",
                body: formData,
            }).then((response) => response.json()).then((data) => {console.log(data);});
            console.log(response);
            event.preventDefault();
        }

    return (<>
    <header>
        <div>
        <h1>Cross Domain Solutions</h1>
        </div>
    </header>
    <nav>
        <ul>
            <li>User's Name</li>
            <li>Home</li>
            <li>Upload File</li>
            <li>Admin Page</li>
        </ul>
    </nav>
    <div>
        <h3>Upload file here: </h3>
        <form encType="multipart/form-data" method="post" name="fileInput" id="fileInput">
            <input type="file" name="file" onChange={onFileChange} />
        </form>
        <button onClick={onFileUpload}>Send to server!</button>
        <p>| nav ends here</p>
    </div>
    </>);
}

export default LandingPage;