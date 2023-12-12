import React, { createContext, useState } from 'react';

const LayoutContext = createContext();

const LayoutProvider = ({ children }) => {
  const [showHeader, setShowHeader] = useState(true);
  console.log("🚀 ~ file: LayoutContext.jsx:7 ~ LayoutProvider ~ showHeader:", showHeader)

  const layoutContextValue = { showHeader, setShowHeader };

  return (
    <LayoutContext.Provider value={layoutContextValue}>
      {children}
    </LayoutContext.Provider>
  );
};

export { LayoutProvider, LayoutContext };
