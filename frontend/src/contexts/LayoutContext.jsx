import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

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

LayoutProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { LayoutProvider, LayoutContext };
