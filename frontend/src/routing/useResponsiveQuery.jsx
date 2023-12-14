import { useMediaQuery } from 'react-responsive';

export const useResponsiveQuery = () => {
  console.log("useMediaQuery");
  return useMediaQuery({ maxWidth: 768 });
};