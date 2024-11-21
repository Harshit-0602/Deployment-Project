import Project from "../Models/project.model.js";
import { User } from "../Models/user.model.js";

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        console.log("Registering User");

        // Check if user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(409).json({ message: "User already exists!" });
        }

        console.log("New user found");

        // Create a new user
        const user = await User.create({
            username,
            email,
            password,
        });

        res.status(201).json({ message: "User registered successfully!", user });
    } catch (error) {
        console.error("Error during registration:", error);
        res
            .status(500)
            .json({ message: "Internal server error. Please try again later." });
    }
};

const option = {
    httpOnly: true,
    secure: true,
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not registered!" });
        }

        // Validate password
        if (!(await user.isPasswordCorrect(password))) {
            return res.status(401).json({ message: "Wrong password!" });
        }
        const token = user.generateAccessToken();
        console.log("User logged in successfully!");
        // const projects = await Project.find({ user_email:email });
        res
            .cookie("accessToken", token, option)
            .status(200)
            .json({ message: "User logged in successfully!"});
    } catch (error) {
        console.error("Error during login:", error.message || "Unknown error");
        res
            .status(500)
            .json({ message: "Internal server error. Please try again later." });
    } finally {
        console.log("Login process completed.");
    }
};

export { register, login };
