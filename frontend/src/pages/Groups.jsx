import { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../config/constant';
import { useUser } from '../context/UserContext';
// import { useSocket } from '../context/SocketContext'; // Assuming you have a SocketContext

const Groups = ({socket}) => {
    const { user: currentUser } = useUser();
    // const { socket } = useSocket();
    
    const [groups, setGroups] = useState([]);
    const [connections, setConnections] = useState([]); // List of people you can add
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupName, setGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]); // Array of IDs to add to group
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    // 1. Fetch User's Groups and Connections
    useEffect(() => {
        const fetchData = async () => {
            try {
                const groupRes = await axios.get(`${URL}/api/chat/groups`, { withCredentials: true });
                setGroups(groupRes.data.groups);

                // Socket ko batana ki in groups ke rooms join kar lo
                const groupIds = groupRes.data.groups.map(g => g._id);
                if (socket) socket.emit("joinGroups", groupIds);

                // Fetch connections (Replace with your actual connections API)
                const connRes = await axios.get(`${URL}/api/user/connections`, { withCredentials: true });
                setConnections(connRes.data);
            } catch (err) {
                console.error("Error fetching data", err);
            }
        };
        fetchData();
    }, [socket]);

    // 2. Handle Group Creation
    const handleCreateGroup = async () => {
        if (!groupName || selectedUsers.length === 0) return alert("Fill details");
        try {
            const res = await axios.post(`${URL}/api/chat/group`, {
                groupName,
                users: selectedUsers
            }, { withCredentials: true });

            setGroups([...groups, res.data.group]);
            setGroupName("");
            setSelectedUsers([]);
            alert("Group Created!");
        } catch (err) {
            console.error(err);
        }
    };

    // 3. Handle Sending Message
    const handleSendMessage = () => {
        if (!text.trim() || !selectedGroup) return;

        socket.emit("sendMessage", {
            senderId: currentUser._id,
            chatId: selectedGroup._id,
            text: text,
            isGroup: true
        });
        setText("");
    };

    // 4. Socket Listener for New Messages
    useEffect(() => {
        if (!socket) return;
        socket.on("newMessage", (msg) => {
            if (msg.chatId === selectedGroup?._id) {
                setMessages((prev) => [...prev, msg]);
            }
        });
        return () => socket.off("newMessage");
    }, [socket, selectedGroup]);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* LEFT SIDEBAR: Groups & Create Form */}
            <div className="w-1/3 bg-white border-r flex flex-col">
                <div className="p-4 border-b bg-blue-600 text-white font-bold">Groups</div>
                
                {/* Simple Create Group Form */}
                <div className="p-4 border-b bg-gray-50">
                    <input 
                        className="w-full p-2 border rounded mb-2 text-sm"
                        placeholder="Group Name..."
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                    <div className="max-h-32 overflow-y-auto mb-2">
                        <p className="text-xs font-bold text-gray-500 mb-1">Select Members:</p>
                        {connections.map(u => (
                            <label key={u._id} className="flex items-center text-sm space-x-2">
                                <input 
                                    type="checkbox" 
                                    onChange={(e) => {
                                        if(e.target.checked) setSelectedUsers([...selectedUsers, u._id]);
                                        else setSelectedUsers(selectedUsers.filter(id => id !== u._id));
                                    }}
                                />
                                <span>{u.name}</span>
                            </label>
                        ))}
                    </div>
                    <button onClick={handleCreateGroup} className="w-full bg-blue-500 text-white py-1 rounded text-sm hover:bg-blue-600">
                        Create Group
                    </button>
                </div>

                {/* Groups List */}
                <div className="flex-1 overflow-y-auto">
                    {groups.map(g => (
                        <div 
                            key={g._id}
                            onClick={() => setSelectedGroup(g)}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${selectedGroup?._id === g._id ? 'bg-blue-50' : ''}`}
                        >
                            <h3 className="font-semibold">{g.groupName}</h3>
                            <p className="text-xs text-gray-400">{g.participants.length} members</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT SIDE: Chat Window */}
            <div className="flex-1 flex flex-col">
                {selectedGroup ? (
                    <>
                        <div className="p-4 bg-white border-b font-bold">{selectedGroup.groupName}</div>
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-200">
                            {messages.map((m, i) => (
                                <div key={i} className={`mb-2 p-2 rounded max-w-xs ${m.senderId === currentUser._id ? 'bg-blue-500 text-white ml-auto' : 'bg-white text-gray-800'}`}>
                                    {m.text}
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-white border-t flex space-x-2">
                            <input 
                                className="flex-1 p-2 border rounded"
                                placeholder="Type a message..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                            <button onClick={handleSendMessage} className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">Select a group to chat</div>
                )}
            </div>
        </div>
    );
};

export default Groups;