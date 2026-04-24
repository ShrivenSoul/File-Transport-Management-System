import React, { useState, useEffect } from "react";
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

  /**
   * Handles user deletion (frontend test version)
   * Currently only logs selected user
   */
    const handleDeleteUser = async (email) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${email}? This action cannot be undone.`
    );

    if (!confirmDelete) {
      console.log("Delete cancelled for:", email);
      return;
    }

    console.log("Delete confirmed for:", email);

    // Temporary frontend removal for testing UI
    setUsers(users.filter((user) => user.email !== email));
    };

  /**
   * Automatically loads users when page first opens
   */
  useEffect(() => {
    fetchUsers();
  }, []);

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
            <Link to="/">
              <h2>Sign Out</h2>
            </Link>
          </li>
        </ul>
      </nav>

      <div style={{ marginLeft: "200px", padding: "20px" }}>
        <h1>Admin Dashboard</h1>

        <button onClick={fetchUsers} style={{ marginBottom: "20px" }}>
          Refresh
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <ul style={{ width: "500px" }}>
          {users.map((user, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                borderBottom: "1px solid lightgray",
                paddingBottom: "8px"
              }}
            >
              <span>{user.email}</span>

              <button
                onClick={() => handleDeleteUser(user.email)}
                style={{
                  padding: "5px 10px",
                  cursor: "pointer"
                }}
              >
                X Delete User
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default AdminPage;