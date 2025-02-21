import { createContext, useContext, useState } from "react";

// Create a context
const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userImage, setUserImage] = useState(null);

  return (
    <AppContext.Provider
      value={{
        userId,
        setUserId,
        userName,
        setUserName,
        userEmail,
        setUserEmail,
        userRole,
        setUserRole,
        userImage,
        setUserImage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
