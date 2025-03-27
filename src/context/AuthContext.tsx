import { createContext, ReactNode, useState } from "react";

interface AuthContextType {
  user: {};
  setUser: React.Dispatch<React.SetStateAction<{}>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState({});

  const authInfo = {
    user,
    setUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
