import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect(`${process.env.mongo}/Deployment`)
        .then(() => {
            console.log("Database Connected Successfully");
        })
        .catch((err) => {
            console.log("Error while connecting to database = "+err);
        })
}

export { connectDB };