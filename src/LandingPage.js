import React from "react";
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




function LandingPage(){
    const navigate = useNavigate();

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
        console.log("File sent!");
        
        const token = await getToken();
        const formData = new FormData(document.querySelector("#fileInput"));
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
        return session.tokens.idToken.toString();
     };
    // Replace http://localhost:3000/ with where your server is running
    /**
     * Downloads selected file from server
     */
    const testFileDownload = async (event) => {

        const token = await getToken();
        console.log("Hi from testFileDownload");
        const response = await fetch(`http://localhost:5000/download/${selectedFile}`, {
            method: "GET",
               headers: {
                      "Authorization": `Bearer ${token}`
                },
         });
         const body = await response.json();
         console.log(body.downloadUrl);
         window.location.href = body.downloadUrl;

      //  const response = await fetch(`http://localhost:3000/download/${selectedFile}`);
      //  const body = await response.json();
      //  console.log(body.downloadUrl);
      //  window.location.href = body.downloadUrl;
    }

    let list = [];
    let selectedFile;

    /**
     * Fetches file list from server and populates dropdown
     */
    const getFiles = async () => {
        
        const token = await getToken();
        const response = await fetch("http://localhost:5000/fileList", {
                 method: "GET",
                 headers: {
            "Authorization": `Bearer ${token}` 
                 },
         });
        const body = await response.json();
        
        console.log(body.fileList.Contents);
        
        for(let i = 0; i < body.fileList.Contents.length; i++){
            list.push(body.fileList.Contents[i].Key);
        }
        
        console.log(list);
        populateFileSelection(list);
        
        
           
        
      // const response = await fetch("http://localhost:3000/fileList");
        // const body = await response.json();

    // console.log(body.fileList.Contents);

    // for(let i = 0; i < body.fileList.Contents.length; i++){
        //     list.push(body.fileList.Contents[i].Key);
        // }

    // console.log(list);
        // populateFileSelection(list);
    }

    /**
     * Gets currently selected file from dropdown
     */
    const getSelectedFile = () => {
        selectedFile = document.getElementById('fileSelection')
            .options[document.getElementById('fileSelection').selectedIndex].text;

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