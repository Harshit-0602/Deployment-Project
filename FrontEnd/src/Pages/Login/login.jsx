import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";
import Alert from "../Utils/Alert"; // Import the Alert component

// Component for Input Fields
const Field = ({ f, setter }) => {
  return (
    <div className="Email">
      <input
        type="text"
        placeholder={f}
        onChange={(e) => setter(e.target.value)}
      />
    </div>
  );
};

// Component for Redirect to Login
const RedirectSignIN = () => {
  return (
    <div className="redirectText">
      <span>
        Already Registered?{" "}
        <NavLink to="/login" className="redirect">
          LOGIN
        </NavLink>
      </span>
    </div>
  );
};

// Component for Redirect to Signup
const RedirectSignUp = () => {
  return (
    <div className="redirectText">
      <span>
        Create New Account...{" "}
        <NavLink to="/" className="redirect">
          SIGN UP
        </NavLink>
      </span>
    </div>
  );
};

// Submit function to handle login or registration logic
const submitFunc = (check, username, email, password, navigate, setAlert) => {
  const data = { email, password };
  if (!check) data.username = username;

  const endpoint = check ? "/user/login" : "/user/register";

  axios
    .post(endpoint, data)
    .then(() => {
      navigate(check ? "/home" : "/login");
      setAlert({ message: "User logged in successfully!", type: "success" });
    })
    .catch((err) => {
      console.error(
        `Error (${err.response.status}): ${err.response.data.message}`
      );
      setAlert({
        message: err.response.data.message || "An error occurred!",
        type: "error",
      });
    });
};

// Main LoginPage Component
const LoginPage = ({ check = false }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null); // Alert state to control alert visibility
  const navigate = useNavigate();

  const handleSubmit = () => {
    // Validate fields based on whether it's login or signup
    if (check) {
      // Login validation (only email and password)
      if (!email || !password) {
        setAlert({
          message: "All fields are required!",
          type: "error",
        });
        return;
      }
    } else {
      // Signup validation (username, email, and password)
      if (!username || !email || !password) {
        setAlert({
          message: "All fields are required!",
          type: "error",
        });
        return;
      }
    }

    submitFunc(check, username, email, password, navigate, setAlert);
  };

  return (
    <div className="entrance">
      <div className="welcome">
        <h1>
          Optimize Every Launch –<br />
          Welcome to <span>DeployMaster</span>.
        </h1>
      </div>
      <div className="Register">
        <div className="login">
          {check ? <h1>LOG IN</h1> : <h1>SIGN UP</h1>}
          {!check && <Field f="Username" setter={setUsername} />}
          <Field f="Email" setter={setEmail} />
          <Field f="Password" setter={setPassword} />
          <button type="button" onClick={handleSubmit}>
            SUBMIT <span>→</span>
          </button>
          {check ? <RedirectSignUp /> : <RedirectSignIN />}
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

export { LoginPage };
