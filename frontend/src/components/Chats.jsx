import React from 'react';
import { useNavigate } from 'react-router-dom';

import plusInCircle from '../assets/images/950764.png'

export default function Chats() {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("clicked");
    navigate('/addchat')
  }

  return (
    <div>
      <div className="my-2 mx-4 h-8 flex justify-between items-center ">
        <h1 className='my-auto'>Chats</h1>
        <button
        onClick={handleClick}>
          <img src={plusInCircle} className='w-8 h-8'></img>
        </button>
      </div>
    </div>
  );
}
