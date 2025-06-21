import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const AuthContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [authUser, setAuthUser] = useState(null);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const [socket, setSocket] = useState(null);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("api/user/checkAuth");

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`api/user/${state}`, credentials);

      console.log(data);

      if (data.success && data.userData && data.userData._id) {
        // Optional: disconnect existing socket before creating a new one
        if (socket) socket.disconnect();

        connectSocket(data.userData);
        setAuthUser(data.userData);
        axios.defaults.headers.common["token"] = data.userData.token;
        setToken(data.userData.token);
        localStorage.setItem("token", data.userData.token);
        toast.success(data.message);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const logout = async () => {
    setAuthUser(null);
    localStorage.removeItem("token");
    setToken(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logout successful");
    socket.disconnect();
  };

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("api/user/updateProfile", body);

      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const connectSocket = (userData) => {
    if (!userData || !userData._id) {
      console.warn(
        "Socket connection aborted: userData._id is missing",
        userData
      );
      return;
    }

    if (socket?.connected) {
      console.log("Socket already connected for", userData._id);
      return;
    }

    console.log("Connecting socket for user:", userData._id);

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected for", userData._id);
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      console.log("📡 Received online users:", userIds);
      setOnlineUsers(userIds);
    });

    setSocket(newSocket);
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    }
  }, []);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    token,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
