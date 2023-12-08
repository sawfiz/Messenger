import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import httpRequest from '../utils/apiServices';

import ChatItem from './ChatItem';

import { Button } from 'react-bootstrap';

import plusInCircle from '../assets/images/950764.png';

export default function Chats() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await httpRequest('GET', '/api/chats');
      console.log(
        '🚀 ~ file: ChatWindow.jsx:10 ~ fetchData ~ response:',
        response
      );
      setData(response.data.chats_list);
    } catch (error) {
      console.log('🚀 ~ file: ChatWindow.jsx:10 ~ fetchData ~ error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chatList = data.map((chat) => <ChatItem key={chat._id} chat={chat} />);

  const handleClick = () => {
    console.log('clicked');
    navigate('/addchat');
  };

  return (
    <div>
      <div className="my-8 mx-4 h-8 flex justify-between items-center ">
        <h1 className="my-auto">Chats</h1>
        <button onClick={handleClick}>
          <img src={plusInCircle} className="w-8 h-8"></img>
        </button>
      </div>
      <div className="m-4">{chatList}</div>
    </div>
  );
}