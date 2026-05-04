import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { URL } from '../config/constant';

const InviteSent = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSentInvites = async () => {
      try {
        setLoading(true);
       
        const res = await axios.get(`${URL}/api/user/invite/sent`, { 
          withCredentials: true 
        });
        
        if (res.data.success) {
          setInvites(res.data.invitations);
          console.log(res.data.invitations)
        }
      } catch (err) {
        console.error("Error fetching sent invites:", err);
        toast.error(err.response?.data?.message || "Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchSentInvites();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Sent Requests</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : invites.length > 0 ? (
          <div className="space-y-4">
            {invites.map((invite) => (
              <div key={invite._id} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {invite.to?.username?.charAt(0).toUpperCase()}
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-gray-900">@{invite.to?.username}</h3>
                    <p className="text-xs text-gray-400">
                      Sent on {new Date(invite.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                    invite.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                    invite.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {invite.status}
                  </span>
                  {invite.status === 'pending' && (
                    <span className="text-[10px] text-gray-400 italic">Awaiting response</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-500">You haven't sent any invitations yet.</p>
            <button 
              onClick={() => navigate('/home')}
              className="mt-4 text-blue-600 font-bold hover:underline"
            >
              Find developers to connect
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteSent;