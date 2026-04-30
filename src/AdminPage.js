import React, { useState } from "react";
import { Link } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";
import "./LandingPage.css";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
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
 * This fetches the audit logs from the backend using the user's authenticated session
 * @returns audit logs
 */
const fetchAuditLogs = async () => {
  try {
    setError("");

    
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString();

    
    const res = await fetch("http://localhost:3000/admin/audit-logs", {
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

        <button onClick={fetchAuditLogs} style={{ marginLeft: "10px", marginBottom: "20px" }}>
          Load Audit Logs
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <ul>
          {users.map((user, index) => (
            <li key={index}>
              {user.email}
            </li>
          ))}
        </ul>
         <h2>Audit Logs</h2>

        <table border="1" cellPadding="8" style={{ width: "100%", background: "white" }}>
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
                <td>{log.timestamp}</td>
                <td>{log.username}</td>
                <td>{Array.isArray(log.userGroups) ? log.userGroups.join(", ") : log.userGroups}</td>
                <td>{log.action}</td>
                <td>{log.target}</td>
                <td>{log.result}</td>
                <td>{log.details}</td>
                <td>{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminPage;