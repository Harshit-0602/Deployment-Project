import React from "react";

// Project component to display each deployed project
const Project = ({ projectName, projectURL, onDelete }) => {
  return (
    <div className="project-item">
      <h3>{projectName}</h3>
      <p>
        <a href={projectURL} target="_blank" rel="noopener noreferrer">
          {projectURL}
        </a>
      </p>
      <button onClick={() => onDelete(projectName)}>Delete</button>{" "}
      {/* Pass projectName to the onDelete function */}
    </div>
  );
};


export default Project;
