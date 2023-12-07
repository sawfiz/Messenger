// Libraries
import React, { useState, useEffect } from 'react';

export default function DynamicCheckBox({
  data,
  list,
  addItem,
  removeItem,
}) {
  const [isChecked, setIsChecked] = useState(false);

  // Perhaps list is updated after the initial rendering
  useEffect(() => {
    setIsChecked(list.includes(data.id));
  }, [list]);

  const handleChange = (e) => {
    if (e.target.checked) {
      setIsChecked(true);
      addItem(data.id);
    } else {
      setIsChecked(false);
      removeItem(data.id);
    }
  };

  return (
    <div className='m-0'>
      <input type="checkbox" checked={isChecked} onChange={handleChange} />{' '}
      {data.name}
    </div>
  );
}