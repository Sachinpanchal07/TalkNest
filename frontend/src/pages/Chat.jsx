import { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../config/constant";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import SearchInChat from "../components/SearchInChat";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [connections, setConnections] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { user: currentUser, socket, setUserSocket, onlineUsers } = useUser();
  const navigate = useNavigate();

  // console.log("Check rendring", onlineUsers);

  const getSenderId = (msg) => {
    if (!msg) return "";
    if (typeof msg.senderId === "string") return msg.senderId;
    if (msg.senderId?._id) return msg.senderId._id;
    return "";
  };

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (msg) => {
      if (selectedUser && getSenderId(msg) === selectedUser._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    const handleMessageSent = (savedMessage) => {
      if (selectedUser && savedMessage.receiverId === selectedUser._id) {
        setMessages((prev) => [...prev, savedMessage]);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageSent", handleMessageSent); // for loggedIn user

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageSent", handleMessageSent);
    };
  }, [socket, selectedUser]);

  // fetch old messages
  useEffect(() => {
    if (selectedUser) {
      axios
        .get(`${URL}/api/chat/history/${selectedUser._id}`, {
          withCredentials: true,
        })
        .then((res) => setMessages(res.data.messages));
    } else {
      setMessages([]);
    }
  }, [selectedUser]);

  // fetch connections
  useEffect(() => {
    const fetchConnections = async () => {
      const res = await axios.get(`${URL}/api/user/connections`, {
        withCredentials: true,
      });
      setConnections(res.data.connections);
    };
    fetchConnections();
  }, []);

  // send message handle
  const handleSend = () => {
    if (!message.trim() || !selectedUser || !socket) return;

    const msgData = {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      text: message,
    };

    socket.emit("sendMessage", msgData);
    setMessage("");
  };

  // pick random color for pop
  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-indigo-500",
      "bg-rose-500",
      "bg-orange-500",
      "bg-amber-500",
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* SIDEBAR - Left */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Messages</h1>
        </div>
        <SearchInChat onSelectUser={(user) => setSelectedUser(user)} />
        <div className="p-4 border-b border-gray-200">
          <h1
            onClick={() => navigate("/groups")}
            className="text-lg font-semibold text-gray-800 cursor-pointer"
          >
            Groups
          </h1>
        </div>
        <div className="overflow-y-auto flex-1 border-bottom-1">
          {connections.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-all hover:bg-blue-50 ${selectedUser?._id === user._id ? "bg-blue-50 border-r-4 border-blue-600" : ""}`}
            >
              <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center text-white font-bold text-lg uppercase shadow-sm">
                {user.username?.charAt(0) || "?"}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  {user.username}
                  {onlineUsers.includes(user._id) && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  )}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT AREA - Right */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div
              className={`flex items-center gap-3 p-4 cursor-pointer transition-all hover:bg-blue-50 ${selectedUser?._id === selectedUser._id ? "bg-blue-50 border-r-4 border-blue-600" : ""}`}
            >
              <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center text-white font-bold text-lg uppercase shadow-sm">
                {selectedUser.username?.charAt(0) || "?"}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  {selectedUser.username}
                  {onlineUsers.includes(selectedUser._id) && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  )}
                </h3>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-[#f0f2f5]">
              <div className="flex flex-col gap-2">
                {messages.map((msg, index) => {
                  const isCurrentUser = getSenderId(msg) === currentUser._id;

                  return (
                    <div
                      key={msg._id || index}
                      className={`max-w-xs rounded-lg p-3 shadow-sm ${
                        isCurrentUser
                          ? "self-end bg-blue-600 text-white"
                          : "self-start bg-white text-gray-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <svg
              className="w-20 h-20 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.274 3 11c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
            <p>Select a friend to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
