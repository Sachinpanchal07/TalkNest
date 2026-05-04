import axios from 'axios';
import { URL } from '../config/constant';
import { toast } from 'react-toastify';
import { useState } from 'react';

const SearchedUser = ({ user, isAlreadyInvited }) => {
  const [isInvited, setIsInvited] = useState(isAlreadyInvited);
  const [loading, setLoading] = useState(false);

  async function handleInvite(searchUserId) {
    try {
      setLoading(true);
      const res = await axios.post(`${URL}/api/user/invite`, { searchUserId }, { withCredentials: true });
      
      setIsInvited(true); // Update UI state
      toast.success("Invite sent successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to Send Invite");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 mb-3">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <h3 className="font-bold text-gray-800 text-sm md:text-base leading-tight">
            {user.username}
          </h3>
          <p className="text-gray-500 text-xs md:text-sm truncate max-w-[150px] md:max-w-xs">
            {user.email}
          </p>
        </div>
      </div>

      <button
        onClick={() => !isInvited && handleInvite(user._id)}
        disabled={isInvited || loading}
        className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
          isInvited 
            ? "text-green-600 bg-green-50 cursor-default" 
            : "text-blue-500 bg-white hover:bg-blue-50 cursor-pointer shadow-blue-100"
        }`}
      >
        {loading ? "..." : isInvited ? "Invited" : "Invite"}
      </button>
    </div>
  );
};

export default SearchedUser;