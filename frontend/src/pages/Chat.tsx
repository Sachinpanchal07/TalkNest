import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../config/constant';

const Chat: React.FC = () => {
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [connections, setConnections] = useState<any[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchConnections = async () => {
            const res = await axios.get(`${URL}/api/user/connections`, { withCredentials: true });
            console.log(res);
            setConnections(res.data.connections);
        };
        fetchConnections();
    }, []);

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

                        {/* Messages Placeholder */}
                        <div className="flex-1 p-6 overflow-y-auto bg-[#f0f2f5]">
                            <div className="flex flex-col gap-2">
                                <div className="self-start bg-white p-3 rounded-lg shadow-sm max-w-xs"></div>
                                <div className="self-end bg-blue-600 text-white p-3 rounded-lg shadow-sm max-w-xs"></div>
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
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700">Send</button>
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