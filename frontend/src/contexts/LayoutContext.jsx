import React, { createContext, useState } from 'react';

const LayoutContext = createContext();

const LayoutProvider = ({ children }) => {
  const [showHeader, setShowHeader] = useState(true);

  const layoutContextValue = { showHeader, setShowHeader };

  return (
    <LayoutContext.Provider value={layoutContextValue}>
      {children}
    </LayoutContext.Provider>
  );
};

export { LayoutProvider, LayoutContext };
