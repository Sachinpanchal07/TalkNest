import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { URL } from '../config/constant';
import SearchedUser from '../components/SearchedUser';

const Home = () => {
  const navigate = useNavigate();
  const [inviteData, setInviteData] = useState("");
  const [searchResults, setSearchResults] = useState([]); 
  const [isSearching, setIsSearching] = useState(false);

  async function handleSearch() {
    if (!inviteData) {
      toast.error("Please enter a username or email.");
      return;
    }
    try {
      setIsSearching(true);
      const res = await axios.post(`${URL}/api/user/search`, { query: inviteData }, { withCredentials: true });
      
      setSearchResults(res.data.users); 
      console.log(res.data.users)
      if(res.data.length === 0) {
        toast.info("No users found.");
      }
    } catch {
      console.log("error in searching");
      toast.error("Search failed.");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center">

      <main className="w-full max-w-6xl mt-8 px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
        
        {/* left column sections */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/chat')}
                className="w-full group flex items-center justify-between bg-blue-600 p-4 rounded-xl text-white font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                <span>Go to Messages</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
              </button>

              <button 
                onClick={() => navigate('/invitations')}
                className="w-full group flex items-center justify-between bg-gray-50 p-4 rounded-xl text-gray-700 border border-gray-200 font-semibold hover:bg-gray-100 transition-all"
              >
                <span>My Invitations</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              </button>
            </div>
          </div>
        </div>

        {/* right column search and results */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Find People</h2>
            <p className="text-gray-500 text-sm mb-6">Search by username or email to grow your network.</p>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </span>
                <input 
                  type="text" 
                  placeholder="Search 'sachin' or 'test@gmail.com'..." 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={inviteData}
                  onChange={(e) => setInviteData(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button 
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all disabled:bg-gray-400 cursor-pointer"
              >
                {isSearching ? '...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Results List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Search Results</h3>
            </div>
            
            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((user) => (
                      <SearchedUser key={user._id} user={user}></SearchedUser>
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-400 italic">No users to show. Enter a query above.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Home;
