import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already exists", success: false });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            bio
        });

        await newUser.save();

        const token = await generateToken(newUser._id);

        return res.status(200).json({
            message: "User created successfully",
            userData: { token, fullName, email, bio, profilePic: "" },
            success: true
        });



    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error", success: false });
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }

        const token = await generateToken(user._id);

        return res.status(200).json({
            message: "User logged in successfully",
            userData: { token, fullName: user.fullName, email: user.email, bio: user.bio, profilePic: user.profilePic, _id: user._id },
            success: true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}


export const checkAuth = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized", success: false });
    }
    res.json({ success: true, user: req.user });
}

export const updateProfile = async (req, res) => {

    try {
        const { profilePic, bio, fullName } = req.body;

        const userId = req.user._id;

        let updatedUser;

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { fullName, bio }, { new: true });
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, { fullName, bio, profilePic: upload.secure_url }, { new: true });
        }

        return res.status(200).json({
            message: "User updated successfully",
            user: updatedUser,
            success: true
        });

    } catch (error) {

        console.log(error.message);
        return res.status(500).json({ message: "Internal server error", success: false });

    }

}