// Libraries
import { RouterProvider } from 'react-router-dom';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { ModalProvider } from './contexts/ModalContext';

// Config
import router from './routing/Router';

// Styles
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <RouterProvider router={router}></RouterProvider>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
