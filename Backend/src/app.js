import Express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userRouter } from "./Router/user.routes.js";
import MyData from "./Models/project.model.js"
import { authUser } from "./Middlewares/auth.middleware.js";
import Project from "./Models/project.model.js";

const app = Express();

app.use(
    cors({
        origin: "*",
        method: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use(Express.json());
app.use(cookieParser());
app.use(Express.urlencoded({ extended: true }));

app.use("/user", userRouter);

app.delete("/delete-project", authUser, async (req, res) => {
    try {

        
        const { projectName } = req.body; // Assuming the project name is sent in the request body
        
        if (!projectName) {
            return res.status(400).json({ message: "Project name is required" });
        }
        
        // Find and delete the project by name and user email
        const deletedProject = await Project.findOneAndDelete({
            user_email: req.user.email,
            project: projectName,
        });
        // console.log(deletedProject);
        
        if (!deletedProject) {
            return res.status(404).json({ message: "Project not found" });
        }
        // console.log("Deleting Project ..............");

        // Return success message
        res
            .status(200)
            .json({
                message: "Project deleted successfully",
                project: deletedProject,
            });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res
            .status(500)
            .json({ message: "Error while deleting project", error: error.message });
    }
});


app.get("/fetch-projects", authUser, async (req, res) => {
    try {
        // Await the asynchronous operation
        console.log("Feteching Projects .........");
        
        const projects = await Project.find({ user_email: req.user.email });
        console.log("Projects = "+projects);

        // Return projects in response
        res.status(200).json({ message: "All projects fetched", projects });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res
            .status(500)
            .json({ message: "Error while fetching projects", error: error.message });
    }
});


// app.get("/check-project", async (req, res) => {
//     try {
//         const prjname = req.query.name;
//         const data = await MyData.findOne({ project: prjname });
//         if (!data) res.status(200).json({ available: true });
//         else res.status(403).json({ available: false });
//     } catch (err) {
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });

// app.post("/submit-form",authUser,async function (req, res) {
//     try {
//         console.log(req.body);
//         const name = req.user.email;
//         const {project, url, build } = req.body;
//         // const data = { name, project, url, build };
//         const isExist = await MyData.findOne({ project: project });
//         if (isExist) {
//             res.status(200).json({ message: "Project already exists" });
//         } else if (!name || !project || !url || !build) {
//             res.status(400).json({ message: "All fields are required" });
//         } else {
//             const urll = process.env.queueserver + "/push";
//             const data = {
//                 repoURL: url,
//                 buildDIR: build,
//                 projectId: project,
//             };
//             // const response = await fetch(urll, {
//                 //     method: "POST",
//                 //     headers: {
//                     //         "Content-Type": "application/json",
//                     //     },
//                     //     body: JSON.stringify(data),
//                     // });
//                     const newdata = new MyData({
//                         user_email: name,
//                         project: project,
//                         url: url,
//                         build: build,
//                     });
//                     await newdata.save();
//             if (!response.ok) {
//                 const errorMessage = await response.json();
//                 throw new Error(errorMessage.message || "Failed to update logs");
//             }

//             const responseData = await response.json();
//             res.status(200).json({ message: "Data Queued Successfully" });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: error.message });
//     }
// });

app.post("/submit-form", authUser, async function (req, res) {
    try {
        console.log(req.body);

        // Extract user email from the authenticated user
        const name = req.user?.email;

        // Extract project data from the request body
        const { project, url, build } = req.body;

        // Validate that all required fields are present
        if (!name || !project || !url || !build) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if a project with the same name already exists in the database
        const isExist = await MyData.findOne({ project: project });
        if (isExist) {
            return res.status(409).json({ message: "Project already exists" }); // 409 for conflict
        }

        // Save the new project data into the database
        const newData = new MyData({
            user_email: name,
            project: project,
            url: url,
            build: build,
        });

        await newData.save();

        // Send a success response
        return res.status(201).json({ message: "Project saved successfully" }); // 201 for created
    } catch (error) {
        console.error(error);

        // Send a server error response
        return res.status(500).json({ message: "Internal server error" });
    }
});


app.get("/project-status/:prjid", authUser, async (req, res) => {
    try {
        //show logs
        // console.log("Status request",req.params.prjid);
        const Logs = await MyData.findOne({
            project: req.params.prjid,
            user_email: req.user.email, // Example of an additional condition
        });
        console.log(Logs);
        if (Logs) res.status(200).json({ prjstatus: Logs.Status });
    } catch (error) {
        // Handle errors
        console.error("Error fetching project status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/project-logs/:prjid", authUser, async (req, res) => {
    try {
        //show logs
        // console.log("Status request",req.params.prjid);
        const Logs = await MyData.findOne({
            project: req.params.prjid,
            user_email: req.user.email, // Example of an additional condition
        });
        // console.log(Logs);
        if (Logs) res.status(200).json({ prjlogs: Logs.Logs });
    } catch (error) {
        // Handle errors
        console.error("Error fetching project status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/updateStatus", authUser, async (req, res) => {
    try {
        const user_email = req.user.email;
        const prjid = req.body.prjid;
        const newstatus = req.body.newstatus;

        const data = await MyData.updateOne(
            {
                project: prjid,
                user_email: user_email, // Additional condition
            },
            { $set: { Status: newstatus } } // Use $set to update specific fields
        );

        res.status(200).json({ message: "Updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/updateLogs", authUser, async (req, res) => {
    try {
        const user_email = req.user.email;
        const prjid = req.body.prjid;
        const newlog = req.body.newlog;

        const data = await MyData.updateOne(
            {
                project: prjid,
                user_email: user_email, // Additional condition to match `user_email`
            },
            { $push: { Logs: newlog } } // Push the new log into the `Logs` array
        );

        res.status(200).json({ message: "logs Updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});


export { app };