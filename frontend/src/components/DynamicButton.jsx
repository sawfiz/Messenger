/* eslint-disable react/prop-types */
// Libraries
import { Link } from 'react-router-dom';

// Vite handles .env differently from create-react-app
const BASE_URL = import.meta.env.VITE_BASE_URL; // Set the base URL

export default function DynamicButton({ data,  dataKey }) {
  const imgSrc = data.photoUrl
    ? `${BASE_URL}/${data.photoUrl}`
    : data.gender === 'male'
    ? '/images/boy.png'
    : data.gender === 'female'
    ? '/images/girl.png'
    : '/images/unknown.png';

  const image = (
    <img
      className="w-full h-full object-cover object-center rounded-md"
      src={imgSrc}
      alt="profile"
    />
  );

  return (
    <Link to={`/${dataKey}/${data._id}`} className="no-underline text-slate-700">
      { data.active ? (
        <div className="h-10 outline-dashed outline-1 outline-pink-300 flex justify-between items-center p-1">
          {data.name}
          <div className="w-8 h-8">{image}</div>
        </div>
      ) : (
        <div className="h-10 outline-dashed outline-1 outline-slate-300 bg-gray-300 opacity-50 flex justify-between items-center p-1">
          {data.name}
          <div className="w-8 h-8">{image}</div>
        </div>
      )}
    </Link>
  );
}
