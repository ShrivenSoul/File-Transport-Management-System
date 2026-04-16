import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  /**
   * Fetches user information (Lambda -> Gateway -> AWS Cognito)
   */
  const fetchUsers = async () => {
  try {
    const res = await fetch(
      "https://3hy0y4wo81.execute-api.us-east-2.amazonaws.com/users"
    );

    const data = await res.json();

    setUsers(data);
  } catch (err) {
    console.error(err);
    setError("Failed to fetch users");
  }
};

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
          <li>
            <Link to="/admin">
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

      <div style={{ marginLeft: "200px", padding: "20px" }}>
        <h1>Admin Dashboard</h1>

        <button onClick={fetchUsers} style={{ marginBottom: "20px" }}>
          Load Users
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <ul>
          {users.map((user, index) => (
            <li key={index}>
              {user.email}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default AdminPage;