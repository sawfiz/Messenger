// Libraries
import { Outlet } from 'react-router-dom';

// Components
import Footer from '../pages/Footer';
import Header from '../pages/Header';

export default function RootLayout() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
