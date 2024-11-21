import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Alert from "./Alert";
import "./compilerLogs.css";

const CompilerLogsPage = () => {
  const location = useLocation();
  const { projectName, githubURL } = location.state || {};
  const [logs, setLogs] = useState([]);
  const [deploymentStatus, setDeploymentStatus] = useState("in_progress"); // in_progress, success, or error
  const [deployedLink, setDeployedLink] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    let intervalId;

    const fetchAllData = async () => {
      try {
        // Fetch project status
        const statusResponse = await axios.get(
          `/project-status/${projectName}`
        );
        console.log(statusResponse.data.prjstatus);

        if (statusResponse?.data?.prjstatus) {
          const newStatus = statusResponse.data.prjstatus;

          // Update deployment status if it changes
          if (newStatus !== deploymentStatus) {
            setDeploymentStatus(newStatus);

            if (newStatus === "success") {
              setDeployedLink(`https://deployed-projects.com/${projectName}`);
            }
          }
        }

        // Fetch logs
        const logsResponse = await axios.get(`/project-logs/${projectName}`);
        console.log(logsResponse);

        if (logsResponse?.data?.prjlogs) {
          setLogs(logsResponse.data.prjlogs);
        }
      } catch (error) {
        console.error("Error during polling:", error);
        setErrors((prevErrors) => [...prevErrors, error.message]);
      }
    };

    // Set up polling
    intervalId = setInterval(fetchAllData, 3000); // Poll every 3 seconds

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [projectName, deploymentStatus]);

  // Status color logic
  const getStatusColor = () => {
    if (deploymentStatus === "success") return "#66ff66"; // Green for success
    if (deploymentStatus === "error") return "#ff6666"; // Red for error
    return "#ffcc00"; // Yellow for in-progress
  };

  return (
    <div className="compiler-logs-page">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="button red"></span>
          <span className="button yellow"></span>
          <span className="button green"></span>
        </div>
        <p className="terminal-title">{projectName || "No Project"}</p>
      </div>
      <div className="terminal-body">
        {logs.map((log, index) => (
          <div key={index} className="log-item">
            {log}
          </div>
        ))}

        {/* Display error messages directly in the terminal */}
        {errors.length > 0 && (
          <>
            {errors.map((error, index) => (
              <div key={index} className="log-item error-message">
                ❌ {error}
              </div>
            ))}
          </>
        )}

        {/* Show deployment error in the terminal if deployment status is 'error' */}
        {deploymentStatus === "error" && (
          <div className="log-item error-message">❌ Deployment Failed</div>
        )}
      </div>

      <div className="status-bar" style={{ color: getStatusColor() }}>
        <p className="status-message">Status: {deploymentStatus}</p>
      </div>

      {/* Display deployed project link */}
      {deploymentStatus === "success" && deployedLink && (
        <div className="deployed-link">
          <p>🌐 Project Link:</p>
          <a
            href={deployedLink}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
          >
            {deployedLink}
          </a>
        </div>
      )}

      {/* Display Deployment Failed message at the bottom like Project Link */}
      {deploymentStatus === "error" && deployedLink === null && (
        <div className="deployed-link">
          <p>❌ Deployment Failed</p>
        </div>
      )}
    </div>
  );
};

export default CompilerLogsPage;
