import { useState } from 'react';
import axios from 'axios';
import { URL } from '../config/constant';
import { toast } from 'react-toastify';

const CreateGroupModal = ({ onClose, onGroupCreated }) => {
    const [groupName, setGroupName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    // Search Users 
    const handleSearch = async (e) => {
        const query = e.target.value;
        console.log(query);
        setSearchQuery(query);
        if (query.length < 2) return setSearchResults([]);
        
        try {
            const res = await axios.post(`${URL}/api/user/search`, {query : searchQuery}, { withCredentials: true });
            setSearchResults(res.data.users);
            console.log(res);
        } catch (err) {
            console.error("Search error", err);
        }
    };

    // Select/Deselect User
    const toggleUser = (user) => {
        if (selectedUsers.find(u => u._id === user._id)) {
            setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    // Create Group API Call
    const handleCreate = async () => {
        if (!groupName || selectedUsers.length === 0) {
            toast.error("please enter the required details")
            return;
        }
        try {
            const userIds = selectedUsers.map(u => u._id);
            const res = await axios.post(`${URL}/api/chat/group`, {
                groupName,
                users: userIds
            }, { withCredentials: true });

            onGroupCreated(res.data.group);
            onClose();
        } catch (err) {
            alert("Cannot create group!");
            console.log(err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md flex flex-col max-h-[90vh]">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="font-bold text-lg">Create New Group</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl">&times;</button>
                </div>
                
                <div className="p-4 flex flex-col gap-3 overflow-y-auto">
                    <input 
                        className="w-full p-2 border rounded focus:outline-blue-500"
                        placeholder="Group Name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />

                    <input 
                        className="w-full p-2 border rounded"
                        placeholder="Search users to add..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />

                    {/* Search Results */}
                    <div className="max-h-40 overflow-y-auto border rounded p-2">
                        {searchResults.length > 0 ? searchResults.map(u => (
                            <div 
                                key={u._id} 
                                onClick={() => toggleUser(u)}
                                className={`p-2 flex justify-between cursor-pointer rounded mb-1 ${selectedUsers.find(s => s._id === u._id) ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                            >
                                <span>{u.username}</span>
                                {selectedUsers.find(s => s._id === u._id) && <span className="text-blue-600">✓</span>}
                            </div>
                        )) : <p className="text-gray-400 text-xs text-center">Search results will show here</p>}
                    </div>

                    {/* Selected Chips */}
                    <div className="flex flex-wrap gap-2">
                        {selectedUsers.map(u => (
                            <span key={u._id} className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                {u.username}
                                <button onClick={() => toggleUser(u)} className="font-bold">×</button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t flex gap-2">
                    <button onClick={onClose} className="flex-1 py-2 bg-gray-200 rounded">Cancel</button>
                    <button onClick={handleCreate} className="flex-1 py-2 bg-blue-600 text-white rounded">Create Group</button>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupModal;