import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found", success: false });
        }

        req.user = user;

        next();


    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ message: "Unauthorized", success: false });
    }
};