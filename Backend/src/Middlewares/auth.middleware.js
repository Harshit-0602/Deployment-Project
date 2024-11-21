import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";

const authUser = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        // console.log(token);
        if (!token) {
            throw new Error("Token Not Found");
            // res.status(400).json({ msg: "Token Not Found" });
            return;
        }
        const decodedToken = jwt.verify(token, process.env.a_k);
        // console.log("Decoded Token " + decodedToken);
        const user = await User.findById(decodedToken._id);
        // console.log(user);
        if (!user) {
            res
                .status(400)
                .json({ msg: "Token Expired Or Invalid Token", decodedToken });
            return;
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Error during user authenication " + error);
    } finally {
        console.log("Auth Middleware Executed !");
    }
};

export { authUser };