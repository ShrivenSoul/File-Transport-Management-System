import React from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";

function LandingPage(){
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
            <h2>Admin Privillegs</h2>
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
        <p>| nav ends here</p>
    </div>
    </>);
}

export default LandingPage;