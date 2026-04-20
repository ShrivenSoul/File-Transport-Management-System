import React from "react";
import "./LandingPage.css";
import { Link, useNavigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";

/**
 * Populates dropdown with file names
 * @param {Set} arr - list of file names
 */
function populateFileSelection(arr){
    let selectTag = document.getElementById('fileSelection');
    while (selectTag.firstChild){
        selectTag.removeChild(selectTag.lastChild);
    }
    arr.forEach(file => {
        var option = document.createElement("option");
        option.innerHTML = file;
        selectTag.appendChild(option)
    });
}

function LandingPage(){
    const navigate = useNavigate();

    /**
     * Handles file upload to server
     * Sends selected file using POST request
     */
    const onFileUpload = async (event) => {
        console.log("File sent!");
        const formData = new FormData(document.querySelector("#fileInput"));
        console.log(formData);

        // REPLACE LINK HERE WITH WHERE YOUR SERVER IS RUNNING
        const response = await fetch("http://localhost:3000/upload", {
            method: "POST",
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => {console.log(data);});

        console.log(response);
        event.preventDefault();
    }

    // Replace http://localhost:3000/ with where your server is running
    /**
     * Downloads selected file from server
     */
    const testFileDownload = async (event) => {
        console.log("Hi from testFileDownload");
        const response = await fetch(`http://localhost:3000/download/${selectedFile}`);
        const body = await response.json();
        console.log(body.downloadUrl);
        window.location.href = body.downloadUrl;
    }

    let fileSet = new Set();
    let selectedFile;

    /**
     * Fetches file list from server and populates dropdown
     */
    const getFiles = async () => {
        const response = await fetch("http://localhost:3000/fileList");
        const body = await response.json();

        console.log(body.fileList.Contents);

        for(let i = 0; i < body.fileList.Contents.length; i++){
            fileSet.add(body.fileList.Contents[i].Key);
        }

        console.log(fileSet);
        populateFileSelection(fileSet);
    }

    /**
     * Gets currently selected file from dropdown
     */
    const getSelectedFile = () => {
        selectedFile = document.getElementById('fileSelection')
            .options[document.getElementById('fileSelection').selectedIndex].text;

        console.log(selectedFile);
    }

    const handleAdminClick = async (e) => {
        e.preventDefault();

        try {
            const session = await fetchAuthSession();
            const groups = session.tokens?.idToken?.payload["cognito:groups"] || [];

            if (groups.includes("Admin")) {
                navigate("/admin");
            } else {
                alert("Access denied: Admins only.");
            }
        } catch (err) {
            console.error(err);
            alert("Error checking admin privileges.");
        }
    }

    return (<>
    <header>
        <div>
        <h1>Cross Domain Solutions</h1>
        </div>
    </header>

    <nav>
        <ul>
            <h2>User Name</h2>
        </ul>

        <ul>
            <li>
                <Link to="/home">
                    <h2>Home</h2>
                </Link>
            </li>
        </ul>

        <ul>
            <h2>Upload Files</h2>
        </ul>

        <ul>
            <li>
                <Link to="/admin" onClick={handleAdminClick}>
                    <h2>Admin Privileges</h2>
                </Link>
            </li>
        </ul>

        <ul>
            <li>
                <Link to="/CDS-capstone">
                    <h2>Sign Out</h2>
                </Link>
            </li>
        </ul>
    </nav>

    <div>
        <h3>Upload file here: </h3>
        <form encType="multipart/form-data" method="post" name="fileInput" id="fileInput">
            <input type="file" name="file" />
        </form>
        <button onClick={onFileUpload}>Send to server!</button>
        <p>| nav ends here</p>
    </div>

    <div>
        <button onClick={getFiles}>Get current files</button>
        <div></div>

        <select id="fileSelection" onChange={getSelectedFile}></select>
        <div></div>

        <button onClick={testFileDownload}>Download!</button>
    </div>
    </>);
}

export default LandingPage;