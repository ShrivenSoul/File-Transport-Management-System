import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

function AdminPage() {
  return (
    <>
      <header>
        <div>
          <h1>Cross Domain Solutions</h1>
        </div>
      </header>

      <nav>
        <ul>
          <h2>Admin User</h2>
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
            <Link to="/admin">
                <h2>Admin Privileges</h2>
            </Link>
        </ul>

        <ul>
          <li>
            <Link to="/CDS-capstone">
              <h2>Sign Out</h2>
            </Link>
          </li>
        </ul>
      </nav>

      <div style={{ marginLeft: "200px", padding: "20px" }}>
        <h1>Admin Dashboard</h1>
      </div>
    </>
  );
}

export default AdminPage;