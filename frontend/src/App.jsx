// Libraries
import { RouterProvider } from 'react-router-dom';

// Config
import router from './routing/Router';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
