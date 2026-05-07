import { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../config/constant';
import { toast } from 'react-toastify';

const SearchInChat = ({ onSelectUser }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length > 0) {
                setIsSearching(true);
                try {
                    const res = await axios.post(`${URL}/api/user/serachConnections`, 
                        { query: query }, 
                        { withCredentials: true }
                    );
                    // console.log(res.data);
                    setResults(res.data.filteredFriends || []);
                } catch (err) {
                    console.error("Search error", err);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults([]);
            }
        }, 300); 

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSelect = (user) => {
        onSelectUser(user);
        setQuery(""); 
        setResults([]);
    };

    return (
        <div className="relative p-4 border-b border-gray-200 bg-gray-50">
            <input
                type="text"
                placeholder="Search connections..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />

            {/* Search Results Dropdown */}
            {results.length > 0 && (
                <div className="absolute left-0 right-0 z-50 mt-1 mx-4 bg-white border rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {results.map((user) => (
                        <div
                            key={user._id}
                            onClick={() => handleSelect(user)}
                            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-50 transition-colors border-b last:border-0"
                        >
                            <img 
                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}`} 
                                className="w-8 h-8 rounded-full" 
                                alt={user.username}
                            />
                            <span className="text-sm font-medium text-gray-700">{user.username}</span>
                        </div>
                    ))}
                </div>
            )}
            
            {isSearching && query && (
                <p className="absolute right-6 top-7 text-xs text-gray-400">Searching...</p>
            )}
        </div>
    );
};

export default SearchInChat;