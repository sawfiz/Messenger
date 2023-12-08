import React, {useContext} from 'react'
import { AuthContext } from '../contexts/AuthContext'


export default function Message({message}) {
  const {currentUser} = useContext(AuthContext)
  return (
    <div className='message-container'>
      {message.senderId === currentUser._id ?
      <div className='message-bubble-send'>
        <p className="message-content">{message.text}</p>
        </div>
        :
      <div className='message-bubble-received'>
        <p className="message-content">{message.text}</p>
        </div>

        }
    </div>
  )
}
