// Libraries
import { Outlet } from 'react-router-dom';

// Components
import Footer from '../pages/Footer';

export default function RootLayout() {
  return (
    <div>
      <Outlet />
      <Footer />
    </div>
  );
}
