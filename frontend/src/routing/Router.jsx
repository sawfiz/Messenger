// Library
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

// Routing
import RootLayout from './RootLayout';
// import { ProtectedRoute } from './ProtectedRoute';

// Page components
import Home from '../pages/Home';
import Signup from '../components/Signup';
// import Login from '../components/user/Login';
// import Logout from '../components/user/Logout';
import Chats from '../components/Chats'
import ChatWindow from '../components/ChatWindow'
import AddChat from '../components/AddChat';


const routes = createRoutesFromElements(
  <Route path="/" element={<RootLayout />}>
    <Route index element={<Home />} />
    <Route path="/signup" element={<Signup />} />
    {/* <Route path="/login" element={<Login />} /> */}
    <Route path="/chats" element={<Chats />} />
    <Route path="/chat/:id" element={<ChatWindow />} />
    <Route path="/addchat" element={<AddChat />} />


  </Route>
);

const router = createBrowserRouter(routes);

export default router;
