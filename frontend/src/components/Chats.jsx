import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import httpRequest from '../utils/apiServices';

import ChatItem from './ChatItem';
import ChatWindow from './ChatWindow';

import plusInCircle from '../assets/images/950764.png';

export default function Chats() {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery({ maxWidth: 768 }); // Define screen breakpoint
  console.log(
    '🚀 ~ file: Chats.jsx:15 ~ Chats ~ isSmallScreen:',
    isSmallScreen
  );

  const [data, setData] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null); // Track selected chat
  console.log('🚀 ~ file: Chats.jsx:19 ~ Chats ~ selectedChat:', selectedChat);

  const fetchData = async () => {
    try {
      const response = await httpRequest('GET', '/api/chats');

      // Filter out chats with not latest messages. Basically filter out empty chats.
      const filteredChats = response.data.chats_list.filter(
        (chat) => chat.latest
      );
      // Sort chats based on their latest timestamps
      const sortedChats = filteredChats.slice().sort((a, b) => {
        // Sort in descending order (latest date first)
        return new Date(b.latest) - new Date(a.latest);
      });

      setData(sortedChats);
    } catch (error) {
      console.log('🚀 ~ file: ChatWindow.jsx:10 ~ fetchData ~ error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chatList = data.map((chat) => (
    <ChatItem
      key={chat._id}
      chat={chat}
      onClick={() => handleChatClick(chat)}
    />
  ));

  const handleClick = () => {
    console.log('clicked');
    navigate('/addchat');
  };

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    if (isSmallScreen) {
      navigate(`/chat/${chat._id}`);
    }
  };
  return (
    <div className='flex container1'>
      <main className="flex border border-black">
        <div className="flex flex-col">
          <div className="mt-2 mx-4 h-8 flex justify-between items-center ">
            <h1 className="my-auto">Chats</h1>
            <button onClick={handleClick}>
              <img src={plusInCircle} className="w-8 h-8"></img>
            </button>
          </div>
          <div className="overflow-y-auto flex-1 p-2">{chatList}</div>
        </div>
      </main>
      {/* Conditionally render ChatWindow on larger screens */}
      {!isSmallScreen && selectedChat && (
        <div className='flex-1'>
          <ChatWindow chatId={selectedChat._id} />
        </div>
      )}
    </div>
  );
}
