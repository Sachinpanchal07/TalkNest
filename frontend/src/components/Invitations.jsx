import React from 'react';
import { useNavigate } from 'react-router-dom';

const Invitations = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 font-semibold group"
        >
          <svg 
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">Manage Invitations</h1>
          <p className="text-gray-500 mt-2">Track your sent requests and check your incoming connections.</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Sent Section Card */}
          <button 
            onClick={() => navigate('/invite-sent')}
            className="group relative overflow-hidden bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all text-left"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Sent Invitations</h2>
              <p className="text-sm text-gray-500 mt-1">Check the status of requests you've sent to others.</p>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-blue-600">→</span>
            </div>
          </button>

          {/* Received Section Card */}
          <button 
            onClick={() => navigate('/invite-received')}
            className="group relative overflow-hidden bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all text-left"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Received Requests</h2>
              <p className="text-sm text-gray-500 mt-1">Review connection requests from other developers.</p>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-emerald-600">→</span>
            </div>
          </button>

        </main>
      </div>
    </div>
  );
};

export default Invitations;