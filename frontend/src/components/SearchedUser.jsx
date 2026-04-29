import axios from 'axios';
import { URL } from '../config/constant';
import { toast } from 'react-toastify';

const SearchedUser = ({ user }) => {
  // const [invitedUsers, setInvitedUsers] = useState([]);


  async function handleInvite(searchUserId){
        try{
            if(!searchUserId){
                toast.error("Please invite some users");
            }
            const res = await axios.post(`${URL}/api/user/invite`, {searchUserId}, {withCredentials:true});
            console.log(res);
        }catch(err){
            console.log("Error in invite :", err);
        }
  }


  return (
    <div className="w-full flex items-center justify-between p-4 bg-white border border-gray-200  hover:shadow-md hover:border-blue-300 transition-all duration-200 mb-3">
      
      <div className="flex items-center gap-4">
        {/* <div className="h-12 w-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-bold text-lg shadow-sm">
          {user.username?.charAt(0).toUpperCase()}
        </div> */}

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
        onClick={()=>handleInvite(user._id)}
        className=" text-blue-500 px-5 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all cursor-pointer shadow-sm shadow-blue-100"
      >
        Invite
      </button>
    </div>
  );
};

export default SearchedUser;
