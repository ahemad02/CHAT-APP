import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

export const userSocketMap = new Map();

io.on("connection", (socket) => {
    const userId = socket.handshake.query?.userId;

    if (!userId) {
        console.warn("⚠️  Socket connected without userId", socket.handshake.query);
        return;
    }


    console.log(`User ${userId} connected with socket ${socket.id}`);

    if (!userSocketMap.has(userId)) {
        userSocketMap.set(userId, new Set());
    }
    userSocketMap.get(userId).add(socket.id);


    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

    socket.on("disconnect", () => {
        const sockets = userSocketMap.get(userId);
        if (sockets) {
            sockets.delete(socket.id);
            if (sockets.size === 0) {
                userSocketMap.delete(userId);
            }
        }
        io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    });
});


app.use(cors());
app.use(express.json({ limit: "4mb" }));

app.use("/api/status", (req, res) => {
    res.send("Server is running");
})
app.use("/api/user", userRouter);
app.use("/api/messages", messageRouter);

await connectDB();

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 3000;

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}

export default server;