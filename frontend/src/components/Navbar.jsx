import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; 
import axios from 'axios';
import { URL } from '../config/constant';
import { toast } from 'react-toastify';

function Navbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const  handleLogout = async () => {
    const res = await axios.get(`${URL}/api/auth/logout`, {withCredentials : true});
    console.log(res);
    toast.success("User Logged Out");
    setUser(null); 
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
      <div 
        className="text-2xl font-extrabold text-blue-600 cursor-pointer tracking-tight"
        onClick={() => navigate('/home')}
      >
        TalkNest
      </div>

      {/* User Actions Section */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              {/* User Avatar - using UI Avatars if user.avatar is missing */}
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=2563eb&color=fff`} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover border border-blue-200"
              />
              <span className="font-medium text-gray-700 hidden sm:block">
                {user.username}
              </span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="cursor-pointer text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;