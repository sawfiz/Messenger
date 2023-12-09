// Library
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

// Routing
import RootLayout from './RootLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Page components
import Home from '../pages/Home';
import Signup from '../components/Signup';
// import Logout from '../components/user/Logout';
import Chats from '../components/Chats';
import ChatWindow from '../components/ChatWindow';
import AddChat from '../components/AddChat';
import Profile from '../components/Profile';

const routes = createRoutesFromElements(
  <Route path="/" element={<RootLayout />}>
    <Route index element={<Home />} />
    <Route path="/signup" element={<Signup />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/chats" element={<Chats />} />
      <Route path="/chat/:id" element={<ChatWindow />} />
      <Route path="/addchat" element={<AddChat />} />
      <Route path="/profile" element={<Profile />} />
    </Route>
  </Route>
);

const router = createBrowserRouter(routes);

export default router;
