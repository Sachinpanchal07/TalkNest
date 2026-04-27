import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../config/constant';
import { io } from "socket.io-client";

const Chat: React.FC = () => {
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [connections, setConnections] = useState<any[]>([]);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const socket = React.useRef<any>(null);
    const selectedUserRef = React.useRef<any>(null);
    const currentUser = localStorage.getItem("userId");
    const getSenderId = (msg: any) => {
        if (!msg) return "";
        if (typeof msg.senderId === "string") return msg.senderId;
        if (msg.senderId?._id) return msg.senderId._id;
        if (typeof msg.sender === "string") return msg.sender;
        if (msg.sender?._id) return msg.sender._id;
        return "";
    };

    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    useEffect(() => {
      socket.current = io(URL, {
          query: { userId: currentUser }
      });

      socket.current.on("newMessage", (msg: any) => {
          const incomingSenderId = getSenderId(msg);
          setMessages((prev) => {
              if (selectedUserRef.current && incomingSenderId === selectedUserRef.current._id) {
                  return [...prev, msg];
              }
              return prev;
          });
      });

      socket.current.on("messageSent", (savedMessage: any) => {
          setMessages((prev) =>
              prev.map((msg) =>
                  msg.tempId && msg.tempId === savedMessage.tempId ? savedMessage : msg
              )
          );
      });

      return () => socket.current.disconnect();
    }, [currentUser]);

    // fetch old messages
    useEffect(() => {
        if (selectedUser) {
            axios.get(`${URL}/api/chat/history/${selectedUser._id}`, { withCredentials: true })
                .then(res => setMessages(res.data.messages));
        } else {
            setMessages([]);
        }
    }, [selectedUser]);

    useEffect(() => {
        const fetchConnections = async () => {
            const res = await axios.get(`${URL}/api/user/connections`, { withCredentials: true });
            console.log(res);
            setConnections(res.data.connections);
        };
        fetchConnections();
    }, []);

    const handleSend = () => {
      if (!message.trim() || !selectedUser) return;

      const tempId = `${Date.now()}-${currentUser}`;
      const msgData = {
          senderId: currentUser,
          receiverId: selectedUser._id,
          text: message,
          tempId
      };

      // Send via Socket for instant delivery
      socket.current.emit("sendMessage", msgData);

      // Update my own screen instantly
      setMessages((prev) => [...prev, msgData]);
      setMessage("");
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* SIDEBAR - Left */}
            <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-800">Messages</h1>
                </div>
                <div className="overflow-y-auto flex-1">
                    {connections.map((user) => (
                        <div 
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`flex items-center gap-3 p-4 cursor-pointer transition-all hover:bg-blue-50 ${selectedUser?._id === user._id ? 'bg-blue-50 border-r-4 border-blue-600' : ''}`}
                        >
                            {/* <img src={user.avatar || "https://ui-avatars.com/api/?name="+user.username} className="w-12 h-12 rounded-full" /> */}
                            <div>
                                <h3 className="font-semibold text-gray-800">{user.username}</h3>
                                {/* <p className="text-xs text-green-500">Online</p> */}
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
                        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                             {/* <img src={selectedUser.avatar || "https://ui-avatars.com/api/?name="+selectedUser.username} className="w-10 h-10 rounded-full" /> */}
                             <h2 className="font-bold">{selectedUser.username}</h2>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto bg-[#f0f2f5]">
                            <div className="flex flex-col gap-2">
                                {messages.map((msg, index) => {
                                    const isCurrentUser = getSenderId(msg) === currentUser;

                                    return (
                                        <div
                                            key={msg._id || msg.tempId || index}
                                            className={`max-w-xs rounded-lg p-3 shadow-sm ${
                                                isCurrentUser
                                                    ? 'self-end bg-blue-600 text-white'
                                                    : 'self-start bg-white text-gray-800'
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
                            <button onClick={handleSend} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700">Send</button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.274 3 11c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        <p>Select a friend to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
