import dotenv from "dotenv";
import { connectDB } from "./src/db.js";
import { app } from "./src/app.js";
dotenv.config({
    path: "./.env",
});

connectDB().then(() => {
    console.log("Ready to go ............");
    app.listen(process.env.port, () => {
        console.log("Server is running on port = " + process.env.port);
    });
})
    .catch((err) => {
        console.log("Error while running the server !!" + err);
});