import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { URL } from '../config/constant';

interface Invitation {
  _id: string;
  from: {
    _id: string;
    username: string;
    avatar?: string;  
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

const Invitations: React.FC = () => {
  const navigate = useNavigate();
  const [invites, setInvites] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvites = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${URL}/api/user/invite/received`, { withCredentials: true });
      setInvites(res.data.data);
      console.log(res.data.data);
    } catch (err: any) {
      toast.error("Failed to load invitations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const handleReview = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      await axios.post(`${URL}/api/user/invite/review`, { requestId, status }, { withCredentials: true });
      toast.success(`Request ${status}!`);
      fetchInvites(); 
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Action failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
           </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-800">Connection Requests</h1>
      </header>

      <main className="max-w-3xl mx-auto mt-8 px-6">
        {loading ? (
          <div className="flex justify-center mt-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : invites.length > 0 ? (
          <div className="space-y-4">
            {invites.map((invite) => (
              <div key={invite._id} className="bg-white p-5 rounded-2xl border border-gray-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  {/* Updated to use 'avatar' and 'username' */}
                  {/* <img 
                    src={invite.from.avatar || "https://ui-avatars.com/api/?name=" + invite.from.username} 
                    className="w-14 h-14 rounded-xl object-cover bg-gray-100 border border-gray-100" 
                    alt={invite.from.username} 
                  /> */}
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">@{invite.from.username}</h3>
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        invite.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                        invite.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                        {invite.status}
                        </span>
                        <span className="text-gray-400 text-[10px]">
                            {new Date(invite.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                  </div>
                </div>

                {invite.status === 'pending' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleReview(invite._id, 'rejected')}
                      className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
                    >
                      Ignore
                    </button>
                    <button 
                      onClick={() => handleReview(invite._id, 'accepted')}
                      className="px-5 py-2 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-95 transition-all"
                    >
                      Accept
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>
            </div>
            <h2 className="text-gray-800 text-xl font-bold">Inbox is empty</h2>
            <p className="text-gray-500 mt-2">Grow your network by searching for other developers!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Invitations;