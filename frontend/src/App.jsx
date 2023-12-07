import { useState } from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import MessageWindow from './components/MessageWindow';
import ChatWindow from './components/ChatWindow';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ChatWindow />
      <MessageWindow />
    </>
  );
}

export default App;
