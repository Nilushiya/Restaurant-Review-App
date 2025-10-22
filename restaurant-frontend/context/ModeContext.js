// context/ModeContext.tsx
import React, { createContext, useContext, useState } from 'react';

// Create context
const ModeContext = createContext(undefined);

// Provider component
export const ModeProvider = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false); // default false => Add mode

  return (
    <ModeContext.Provider value={{ isEditMode, setIsEditMode }}>
      {children}
    </ModeContext.Provider>
  );
};

// Custom hook for easier usage
export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) throw new Error('useMode must be used within ModeProvider');
  return context;
};
