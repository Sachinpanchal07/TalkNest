import { useState } from "react";
import { URL } from "../config/constant";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();

  async function submitHandler() {
    try {
      if (!userName || !email || !password || !avatar) {
        toast.error("Please enter required fields !");
        return;
      }
      const res = await axios.post(
        `${URL}/api/auth/signup`,
        { userName, email, password, avatar },
        { withCredentials: true },
      );
      console.log("Success:", res);
      // localStorage.setItem("userId", res.data.user._id);
      navigate('/login')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Signup failed";
        toast.error(msg);
      } else {
        console.error("Non-Axios error:", error);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Signup
        </h2>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">
            Username
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 focus:outline-blue-500"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            type="text"
            placeholder="abc_codes"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Email</label>
          <input
            className="border border-gray-300 rounded-md p-2 focus:outline-blue-500"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="abc@example.com"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">
            Password
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 focus:outline-blue-500"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="•••••••"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">
            Image URL
          </label>
          <input
            className="border border-gray-300 rounded-md p-2 focus:outline-blue-500"
            onChange={(e) => setAvatar(e.target.value)}
            value={avatar}
            type="text"
            placeholder="https://..."
          />
        </div>

        <button
          onClick={submitHandler}
          className="bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition-colors mt-2 cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Signup;
