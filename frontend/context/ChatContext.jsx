import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unSeenMessages, setUnSeenMessages] = useState({});

  const { socket, axios, onlineUsers, authUser } = useContext(AuthContext);

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");

      console.log("API Response:", data);
      console.log("Setting users to:", data.filteredUsers);

      if (data.success) {
        setUsers(data.filteredUsers);
        setUnSeenMessages(data.unseenMessages);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
        setUnSeenMessages((prev) => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const sendMessage = async (message) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        message
      );
      console.log(data);

      if (data.success) {
        setMessages((messages) => [...messages, data.message]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const subsctibeToMessages = async () => {
    if (!socket) return;
    socket.on("newMessage", async (message) => {
      if (selectedUser && message.senderId === selectedUser._id) {
        message.seen = true;
        setMessages((messages) => [...messages, message]);
        await axios.put(`/api/messages/mark/${message._id}`);
      } else {
        setUnSeenMessages((unSeenMessages) => ({
          ...unSeenMessages,
          [message.senderId]: unSeenMessages[message.senderId]
            ? unSeenMessages[message.senderId] + 1
            : 1,
        }));
      }
    });
  };

  const unsubscribeFromMessages = () => {
    if (!socket) return;
    socket.off("newMessage");
  };

  useEffect(() => {
    subsctibeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser, socket]);

  useEffect(() => {
    if (authUser) {
      getUsers();
    }
  }, [onlineUsers]);

  const value = {
    messages,
    users,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
    getUsers,
    unSeenMessages,
    setMessages,
    setUnSeenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
