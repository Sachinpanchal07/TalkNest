import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col items-center justify-center text-gray-900">
      
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3">
          TalkNest
        </h1>
        <p className="text-gray-600 text-lg">
          Real-time chat for modern developers.
        </p>
      </div>

      <div className="flex gap-4">
        
        {/* Login */}
        <Link 
          to="/login" 
          className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </Link>

        {/* Signup */}
        <Link 
          to="/signup" 
          className="border border-gray-300 bg-white px-8 py-2 rounded-md hover:bg-gray-100 transition"
        >
          Signup
        </Link>

      </div>

      <div className="mt-12 flex gap-8 text-sm text-gray-500">
        <span>• Real-time Chat</span>
        <span>• User Search</span>
        <span>• Group Messaging</span>
      </div>

    </div>
  );
};

export default Landing;
