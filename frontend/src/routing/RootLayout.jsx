// Libraries
import { Outlet } from 'react-router-dom';

import { LayoutContext } from '../contexts/LayoutContext';

// Components
import Footer from '../pages/Footer';
import Header from '../pages/Header';
import { useContext } from 'react';

export default function RootLayout() {
  const {showHeader} = useContext(LayoutContext)

  return (
    <div>
      {showHeader && <Header />}
      <Outlet />
      <Footer />
    </div>
  );
}
