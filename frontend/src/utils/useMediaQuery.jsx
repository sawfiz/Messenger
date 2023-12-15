import { useEffect, useState } from 'react';

const maxWidth = 768;

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

function useMediaQuery() {
  const { width } = useWindowSize();
  return width <= maxWidth;
}

export default useMediaQuery;
