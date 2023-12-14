// Library
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { useResponsiveQuery } from './useResponsiveQuery'; // Import the custom hook

// Routing
import RootLayout from './RootLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Page components
import Home from '../pages/Home';
import Signup from '../components/Signup';
import Chats from '../components/Chats';
import ChatWindow from '../components/ChatWindow';
import AddChat from '../components/AddChat';
import Profile from '../components/Profile';

// Create routes based on the screen size
const createRoutes = (isSmallScreen) => {
  return createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/chats"
          element={isSmallScreen ? <Chats /> : <ChatsWithChatWindow />}
        />
        <Route path="/chat/:id" element={<ChatWindow />} />
        <Route path="/addchat" element={<AddChat />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Route>
  );
};

function ChatsWithChatWindow() {
  return (
    <>
      <Chats />
      <ChatWindow />
    </>
  );
}

const AppRoutes = () => {
  console.log("AppRoutes");
  const isSmallScreen = useResponsiveQuery();

  const routes = createRoutes(isSmallScreen);

  return createBrowserRouter(routes);
};

export default AppRoutes;
