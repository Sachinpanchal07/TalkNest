import Login from './pages/Login'
import Signup from './pages/Signup'
import Landing from './pages/Landing'
import Home from './pages/Home'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Chat from './pages/Chat';
import { ToastContainer } from 'react-toastify';


function App() {

  return (
    <>
      <ToastContainer></ToastContainer>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Landing></Landing>}></Route>
            <Route path='/home' element={<Home></Home>}></Route>
            <Route path='/chat' element={<Chat></Chat>}></Route>
            <Route path='/login' element={<Login></Login>}></Route>
            <Route path='/signup' element={<Signup></Signup>}></Route>
          </Routes>
      </BrowserRouter>
    </>
  ) 
}

export default App
