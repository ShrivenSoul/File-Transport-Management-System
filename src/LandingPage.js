import React, { useState } from "react";
import "./LandingPage.css";
import { Link, useNavigate } from "react-router-dom";
import { fetchAuthSession, signOut } from "aws-amplify/auth";


/**
 * Populates dropdown with file names
 * @param {Array} arr - list of file names
 */
function populateFileSelection(arr){
    arr.forEach(file => {
        var option = document.createElement("option");
        option.innerHTML = file;
        document.getElementById('fileSelection').appendChild(option)
    });
}

function removeDuplicateFiles(){
    var selectElement = document.getElementById('fileSelection');
    const options = selectElement.querySelectorAll('option');
    const inDropdown = new Set();
    options.forEach(option => {
        if(inDropdown.has(option.innerHTML)){
            option.remove();
        }
        else{
            inDropdown.add(option.innerHTML);
        }
    });
}


function LandingPage(){
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState("");
    /**
     * Handles file upload to server
     * Sends selected file using POST request
     */
    const handleSignOut = async (e) => { //this constant handles signout function 
         e.preventDefault();
            try {
                await signOut(); // clears  Cognito session(makes user token invalid)
                navigate("/");
        } catch (err) {
        console.error(err);
       } 
   }
    const onFileUpload = async (event) => {
        try{

            console.log("File sent!");
            
            const token = await getToken();
            const formData = new FormData(document.querySelector("#fileInput"));
            console.log(document.querySelector("#fileInput"));
            console.log(formData);
            const response = await fetch("http://localhost:5000/upload", {
             method: "POST",
             headers: {
                 "Authorization": `Bearer ${token}` 
                },
                body: formData,
            }).then((response) => response.json())
            .then((data) => { console.log(data); });
            
            console.log(response);
            event.preventDefault();
        } catch(err){
            console.error("No file input: ", err)
        }
        
        // REPLACE LINK HERE WITH WHERE YOUR SERVER IS RUNNING
      //** 

       
     //const response = await fetch("http://localhost:3000/upload", {
          //  method: "POST",
         //   body: formData,
       // })
       // .then((response) => response.json())
       // .then((data) => {console.log(data);});

       // console.log(response);  
        
    }
    const getToken = async () => {
        const session = await fetchAuthSession();
        return session.tokens?.accessToken?.toString();
    };
    // Replace http://localhost:3000/ with where your server is running
    /**
     * Downloads selected file from server
     */
    const testFileDownload = async (event) => {

        const token = await getToken();
        console.log("Hi from testFileDownload");
        try {

            const response = await fetch(`http://localhost:5000/download/${selectedFile}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response);
            const body = await response.json();
            console.log(body.downloadUrl);
            window.location.href = body.downloadUrl;
        }
        catch(err){
            console.error("Failed to download file: ", err)
        }

      //  const response = await fetch(`http://localhost:3000/download/${selectedFile}`);
      //  const body = await response.json();
      //  console.log(body.downloadUrl);
      //  window.location.href = body.downloadUrl;
    }

    /**
     * Fetches file list from server and populates dropdown
     */
    const getFiles = async () => {
    try {
    const token = await getToken();

    const response = await fetch("http://localhost:5000/fileList", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const body = await response.json();

    if (!response.ok) {
      console.error(body);
      return;
    }

    const files = body.files || [];

    const list = files.map((file) => file.Key);

    console.log(list);
    populateFileSelection(list);
    removeDuplicateFiles();
    if(selectedFile === ""){
        getSelectedFile();
    }
  } catch (err) {
    console.error("Failed to get files:", err);
  }
};

    /**
     * Gets currently selected file from dropdown
     */
    const getSelectedFile = () => {
        setSelectedFile(document.getElementById('fileSelection')
            .options[document.getElementById('fileSelection').selectedIndex].text);

        console.log(selectedFile);
    }

    /**
     * Checks if a user has the credentials on access the Admin page
     * @param {*} e 
     */
    const handleAdminClick = async (e) => {
        e.preventDefault();

        try {
            const session = await fetchAuthSession();
            const groups = session.tokens?.idToken?.payload["cognito:groups"] || [];

            console.log(session.tokens.idToken.payload);
            
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
                <a href="/" onClick={handleSignOut}>
                    <h2>Sign Out</h2>  
                </a>
            </li>
        </ul>
    </nav>

    <div>
        <h3>Upload file here: </h3>
        <form encType="multipart/form-data" method="post" name="fileInput" id="fileInput">
            <input type="file" name="file" />
        </form>
        <button onClick={onFileUpload}>Send to server!</button>
        <p>---------------------</p>
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