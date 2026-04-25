import React, { useState } from 'react';
import { URL } from '../config/constant';
import axios from 'axios';
import Loader from '../components/Loader';
import { redirect, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    async function submitHandler(): Promise<void> {
        try {
            setLoading(true);
            if(!email || !password){
                toast.error("Please enter required fields")
                return;
            }
            const res : any = await axios.post(`${URL}/api/auth/login`, 
                {  email, password },
                { withCredentials: true }
            );
            console.log("Success:", res);
            navigate("/home")
        } catch (err) {
            console.error("Login Error:", err);
        } finally{
            setLoading(false)
        };
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Login</h2>
                

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
                    <label className="text-sm font-semibold text-gray-600">Password</label>
                    <input 
                        className="border border-gray-300 rounded-md p-2 focus:outline-blue-500"
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        type="password" 
                        placeholder="•••••••"
                    />
                </div>

                <button 
                    onClick={submitHandler}
                    className="bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition-colors mt-2 cursor-pointer"
                >
                    {
                        loading ? <Loader></Loader> : "Submit"
                    }
                    
                </button>
            </div>
        </div>
    );
};

export default Login;