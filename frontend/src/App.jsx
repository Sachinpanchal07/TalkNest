import Login from './pages/Login'
import Signup from './pages/Signup'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Groups from './pages/Groups'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Chat from './pages/Chat';
import { ToastContainer } from 'react-toastify';
import Invitations from './components/Invitations';
import Navbar from './components/Navbar'
import { useUser } from './context/UserContext'
import { Navigate } from 'react-router-dom'
import InviteSent from './components/InviteSent'
import InviteReceived from './components/InviteReceived'


function App() {
  
  const { user } = useUser();

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Landing />} />
          {user ? (
            <>
              <Route path='/home' element={<Home />} />
              <Route path='/chat' element={<Chat />} />
              <Route path="/invitations" element={<Invitations />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/invite-sent" element={<InviteSent />} />
              <Route path="/invite-received" element={<InviteReceived />} />

              <Route path="/login" element={<Navigate to="/home" />} />
            </>
          ) : (
            <>
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
