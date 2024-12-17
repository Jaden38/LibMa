import React, { createContext, useState, ReactNode } from 'react';

interface User {
  loggedIn: boolean;
  role: string | null;
}

interface UserContextType {
  user: User;
  login: (token: string) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType>({
  user: { loggedIn: false, role: null },
  login: () => {
    throw new Error('UserContext login method must be used within a UserProvider');
  },
  logout: () => {
    throw new Error('UserContext logout method must be used within a UserProvider');
  }
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User>({ loggedIn: false, role: null });

  const login = (token: string) => {
    const userData = decodeJwt(token);
    setUser({ loggedIn: true, role: userData.role });
  };

  const logout = () => {
    setUser({ loggedIn: false, role: null });
  };

  const decodeJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
