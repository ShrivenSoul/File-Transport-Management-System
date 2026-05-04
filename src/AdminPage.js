import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";
import "./LandingPage.css";

/** @namespace */
function AdminPage() {
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");

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
   * Handles user deletion
   */
  const handleDeleteUser = async (username, email) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${email}? This action cannot be undone.`
    );

    if (!confirmDelete) {
      console.log("Delete cancelled for:", email);
      return;
    }

    console.log("Delete confirmed for:", email);

    try {
      const res = await fetch(
        "https://3hy0y4wo81.execute-api.us-east-2.amazonaws.com/deleteuser",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username })
        }
      );

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        alert("User deleted successfully.");
        fetchUsers();
      } else {
        alert(data.message || "Failed to delete user.");
      }

    } catch (err) {
      console.error(err);
      alert("Error deleting user.");
    }
  };

  /**
   * Automatically loads users when page first opens
   */
  useEffect(() => {
    fetchUsers();

    const fetchCurrentUser = async () => {
      try {
        const session = await fetchAuthSession();

        const email = session?.tokens?.idToken?.payload?.email;

        console.log("Current logged in email:", email);

        setCurrentUserEmail(email);
      } catch (err) {
        console.error("Failed to get current user email:", err);
      }
    };
  

    fetchCurrentUser();
  }, []);
  /**
   * Fetches audit log information
   */
  const fetchAuditLogs = async () => {
    try {
      setError("");

    
      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken?.toString();

    
      const res = await fetch("http://localhost:5000/admin/audit-logs", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to fetch audit logs");
        return;
      }

      setAuditLogs(data);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch audit logs");
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
            <Link to="/">
              <h2>Sign Out</h2>
            </Link>
          </li>
        </ul>
      </nav>

      <div style={{ marginLeft: "200px", padding: "20px"}}>
        <h1 style={{textIndent: "50px"}}>Admin Dashboard</h1>

      

        {/* Scrollable user list container */}
        <div
          style={{
            display: "inline-table",
            width: "30%",
            height: "400px",
            overflowY: "auto",
            padding: "10px",
            backgroundColor: "#fff"
          }}
        >
          <h2 style={{width: "20%"}}>User List</h2>
            <button onClick={fetchUsers} style={{ marginBottom: "20px" }}>
              Refresh
            </button>
          <ul style={{ margin: 0, padding: "5px", border: "1px solid lightgray",
             }}>
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

                {user.email !== currentUserEmail && (
                  <button
                    onClick={() =>
                      handleDeleteUser(user.username, user.email)
                    }
                    style={{
                      padding: "5px 10px",
                      cursor: "pointer"
                    }}
                  >
                    X Delete User
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        

        <div style={{display: "inline-table", width: "55%", padding: "20px"}}>
         <h2>Audit Logs</h2>
         <button onClick={fetchAuditLogs} style={{ marginLeft: "10px", marginBottom: "20px" }}>
          Load Audit Logs
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        <table border="1" cellPadding="8" style={{ width: "100%",tableLayout: "fixed", background: "white" }}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Username</th>
              <th>Groups</th>
              <th>Action</th>
              <th>Target</th>
              <th>Result</th>
              <th>Details</th>
              <th>IP Address</th>
            </tr>
          </thead>

          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.logId}>
                <td style={{wordWrap: "break-word"}}>{log.timestamp}</td>
                <td style={{wordWrap: "break-word"}}>{log.username}</td>
                <td style={{wordWrap: "break-word"}}>{Array.isArray(log.userGroups) ? log.userGroups.join(", ") : log.userGroups}</td>
                <td style={{wordWrap: "break-word"}}>{log.action}</td>
                <td style={{wordWrap: "break-word"}}>{log.target}</td>
                <td style={{wordWrap: "break-word"}}>{log.result}</td>
                <td style={{wordWrap: "break-word"}}>{log.details}</td>
                <td style={{wordWrap: "break-word"}}>{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
            </div>
      </div>
    </>
  );
}

export default AdminPage;