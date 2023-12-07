import { useState } from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import MessageWindow from './components/MessageWindow';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <MessageWindow />
    </>
  );
}

export default App;
