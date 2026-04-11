import React from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";


// Ignore for now
//function LinktoDownload(fileName){
//    const testFileDownloadUrl = fetch("http://localhost:3000/download/testFile.txt").then((res) => {res.json()}).then((res) => {window.location.href = res.downloadUrl});
//    console.log(testFileDownloadUrl);
    
    //return <a target="_blank" rel="noopener noreferrer" href={testFileDownloadUrl}>Link to Download</a>
//}



function LandingPage(){
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
    // Currently cannot choose which file to download, 
    // Replace http://localhost:3000/ with where your server is running,
    // Replace testFile.txt with file in your s3
    const testFileDownload = async (event) => {
        console.log("Hi from testFileDownload");
        const response = await fetch("http://localhost:3000/download/testFile.txt");
        const body = await response.json();
        console.log(body.downloadUrl);
        window.location.href = body.downloadUrl;
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
                 <Link to="/CDS-capstone">
             <h2>Home</h2>
                </Link>
            </li>
        </ul>
         <ul>
            <h2>Upload Files</h2>
        </ul>
        <ul>
            <h2>Admin Privileges</h2>
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
        <button onClick={testFileDownload}>Download!</button>
        <p>| nav ends here</p>
    </div>
    </>);
}

export default LandingPage;
