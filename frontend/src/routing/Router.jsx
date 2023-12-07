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
// import Signup from '../components/user/Signup';
// import Login from '../components/user/Login';
// import Logout from '../components/user/Logout';
import Chat from '../components/ChatWindow'


const routes = createRoutesFromElements(
  <Route path="/" element={<RootLayout />}>
    <Route index element={<Home />} />
    {/* <Route path="/signup" element={<Signup />} /> */}
    {/* <Route path="/login" element={<Login />} /> */}
    <Route path="/chat" element={<Chat />} />


  </Route>
);

const router = createBrowserRouter(routes);

export default router;
