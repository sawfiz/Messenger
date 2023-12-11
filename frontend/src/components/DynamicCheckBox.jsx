// Libraries
import React, { useState, useEffect } from 'react';

// Vite handles .env differently from create-react-app
const BASE_URL = import.meta.env.VITE_BASE_URL; // Set the base URL

export default function DynamicCheckBox({ data, list, addItem, removeItem }) {
  const [isChecked, setIsChecked] = useState(false);

  // Perhaps list is updated after the initial rendering
  useEffect(() => {
    const found = list.some((item) => item.id === data.id);
    setIsChecked(found);
  }, [list, data]);

  const handleChange = (e) => {
    if (e.target.checked) {
      setIsChecked(true);
      addItem(data);
    } else {
      setIsChecked(false);
      removeItem(data);
    }
  };

  // The substring(7) method will create a new string starting from the character at index 7
  // (after the 'public/' part) to the end of the string, effectively removing the 'public/'
  // part from the data.photoUrl.
  const imgSrc = data.photoUrl
  ? `${BASE_URL}/${data.photoUrl.substring(7)}`
    : '/images/unknown.png';

  const image = (
    <img
      className="w-full h-full object-cover object-center rounded-xl"
      src={imgSrc}
      alt="profile"
    />
  );

  return (
    <div className="m-0">
      <div className="h-10 outline-dashed outline-1 outline-pink-300 flex justify-between items-center p-1">
        <div className="w-8 h-8">{image}</div>
        <div className='flex-1 align-left ml-1'>{data.name}</div>
        <input type="checkbox" checked={isChecked} onChange={handleChange} />
      </div>
    </div>
  );
}
