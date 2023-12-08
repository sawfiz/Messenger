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
    const found = list.some(item => item.id === data.id);
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

  return (
    <div className='m-0'>
      <input type="checkbox" checked={isChecked} onChange={handleChange} />{' '}
      {data.name}
    </div>
  );
}