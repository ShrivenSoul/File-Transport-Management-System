import React, { useState } from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";

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
        <p>| nav ends here</p>
    </div>
    </>);
}

export default LandingPage;
