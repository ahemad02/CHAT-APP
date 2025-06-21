import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

export const getUsersForSidebar = async (req, res) => {

    try {
        const userId = req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        const unseenMessages = {};

        const promises = filteredUsers.map(async (user) => {
            const count = await Message.find({
                senderId: user._id,
                receiverId: userId,
                seen: false
            });
            if (count.length > 0) {
                unseenMessages[user._id] = count.length;
            }
        });
        await Promise.all(promises);
        return res.status(200).json({ success: true, filteredUsers, unseenMessages });


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error", success: false });

    }

}

export const getMessages = async (req, res) => {

    try {

        const { id: selectedUserId } = req.params;

        const userId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 });

        const updatedMessages = await Message.updateMany({
            senderId: selectedUserId, receiverId: userId
        }, { seen: true });

        if (!updatedMessages) return res.status(500).json({ message: "unable to update messages seen status", success: false });


        return res.status(200).json({ messages, success: true });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error", success: false });

    }


}

export const markMessagesAsSeen = async (req, res) => {

    try {

        const { id } = req.params;

        await Message.findByIdAndUpdate(id, { seen: true });

        return res.status(200).json({ message: "Messages marked as seen successfully", success: true });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error", success: false });

    }

}

export const sendMessage = async (req, res) => {

    try {

        const { text, image } = req.body;

        const { id: receiverId } = req.params;

        const senderId = req.user._id;

        let imageUrl;

        if (image) {
            const upload = await cloudinary.uploader.upload(image);
            if (!upload) return res.status(500).json({ message: "Unable to upload image", success: false });
            imageUrl = upload.secure_url;
        }



        const message = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        const receiverSockets = userSocketMap.get(receiverId);

        if (receiverSockets) {
            receiverSockets.forEach(socketId => {
                io.to(socketId).emit("newMessage", message);
            });
        }


        return res.status(200).json({ message, success: true });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error", success: false });

    }


}

