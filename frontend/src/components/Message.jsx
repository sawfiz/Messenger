import React from 'react'

export default function Message({text}) {
  return (
    <div>
      <div className='message-bubble'>
        <p className="message-content">{text}</p>
        </div>
    </div>
  )
}
