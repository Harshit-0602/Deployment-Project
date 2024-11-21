import mongoose, { Schema } from "mongoose";

const project = new Schema({
    user_email:String ,
    project: String,
    url: String,
    build: String,
    Status: {
        type: String,
        default: "Queued",
    },
    Logs: {
        type: [String],
        default: ["Request Queued to the Queue Service"],
    },
});

const Project = mongoose.model("Project_Table", project);
export default Project;