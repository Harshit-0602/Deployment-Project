import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Project from "./Project"; // Importing the Project component
import Alert from "../Utils/Alert"; // Import the common Alert component
import axios from "axios"; // Import axios for making API calls
import "./home.css";

const HomePage = () => {
  const [projectName, setProjectName] = useState("");
  const [githubURL, setGithubURL] = useState("");
  const [frameworkPreset, setFrameworkPreset] = useState(""); // State to store selected framework preset
  const [deployedProjects, setDeployedProjects] = useState([]);
  const [alert, setAlert] = useState(null); // Alert state to control alert visibility
  const navigate = useNavigate();

  // Fetch the user's projects when the page loads
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/fetch-projects"); // Your API to fetch projects
        if (response.data.projects) {
          setDeployedProjects(response.data.projects);
        } else {
          setAlert({
            message: "No projects found.",
            type: "info",
          });
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setAlert({
          message: "Failed to fetch projects.",
          type: "error",
        });
      }
    };

    fetchProjects();
  }, []); // The empty array ensures this runs only once when the component mounts

  // Check if the project name already exists in deployedProjects
  const isProjectNameUnique = () => {
    const projectExists = deployedProjects.some(
      (project) => project.project.toLowerCase() === projectName.toLowerCase()
    );
    return !projectExists; // Return true if name is unique, false otherwise
  };

  // Handle deploy action
  const handleDeploy = async () => {
    if (projectName && githubURL && frameworkPreset) {
      const isNameUnique = isProjectNameUnique();
      if (isNameUnique) {
        const buildFolder = frameworkPreset === "Vite" ? "dist" : "build";

        // Prepare data to send to the API
        const projectData = {
          project: projectName,
          url: githubURL,
          build: buildFolder,
        };

        try {
          // Make API call to submit the project data
          const response = await axios.post("/submit-form", projectData, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.status === 201 || response.status === 200) {
            setAlert({
              message:
                response.data.message || "Project deployed successfully!",
              type: "success",
            });

            // Navigate to the Compiler Logs page with the required state
            navigate("/compiler-logs", {
              state: {
                projectName,
                githubURL,
                buildFolder,
              },
            });

            // Clear the form fields after deployment
            setProjectName("");
            setGithubURL("");
            setFrameworkPreset("");
          }
        } catch (error) {
          console.error("Error deploying project:", error);
          setAlert({
            message:
              error.response?.data?.message || "Failed to deploy project.",
            type: "error",
          });
        }
      } else {
        setAlert({
          message:
            "Project name already exists. Please choose a different name.",
          type: "error",
        });
      }
    } else {
      setAlert({
        message: "Please fill all fields.",
        type: "error",
      });
    }
  };

  // Handle delete action
  const handleDelete = async (projectName) => {
    try {
      console.log(projectName);
      
      // API call to delete the project, sending project name in the request body
      const response = await axios.delete("/delete-project", {
        data: { projectName }, // Send projectName as data in the body of the DELETE request
      });

      if (response.status === 200) {
        // Remove deleted project from the deployedProjects list
        setDeployedProjects(
          deployedProjects.filter((project) => project.project !== projectName)
        );
        setAlert({
          message: "Project deleted successfully.",
          type: "success",
        });
      } else {
        setAlert({
          message: "Failed to delete project.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      setAlert({
        message: "Error deleting project.",
        type: "error",
      });
    }
  };


  return (
    <div className="home-container">
      <div className="left-section">
        <h2>Your Deployed Projects</h2>
        <div className="project-list">
          {deployedProjects.length === 0 ? (
            <p>No projects deployed yet.</p>
          ) : (
            deployedProjects.map((project) => (
              <Project
                key={project._id}
                projectName={project.project}
                projectURL={project.url}
                onDelete={() => handleDelete(project.project)} // Pass the delete handler
              />
            ))
          )}
        </div>
      </div>

      <div className="divider"></div>

      <div className="right-section">
        <h2>Deploy New Project</h2>
        <div className="form-container">
          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <input
            type="text"
            placeholder="GitHub URL"
            value={githubURL}
            onChange={(e) => setGithubURL(e.target.value)}
          />

          <select
            value={frameworkPreset}
            onChange={(e) => setFrameworkPreset(e.target.value)}
            className="framework-select"
          >
            <option value="">Select Framework Preset</option>
            <option value="Vite">Vite</option>
            <option value="React (npx)">React (npx)</option>
          </select>

          <button type="button" onClick={handleDeploy}>
            Deploy New Project
          </button>
        </div>
      </div>

      {/* Display the alert if available */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)} // Close alert when closed
        />
      )}
    </div>
  );
};

export default HomePage;
