// UserContext.tsx
import React, { createContext, ReactNode, useState, useEffect } from 'react';
import { AuthResponse, IUser, AuthTokens } from '@/types';

interface UserContextType {
  user: IUser | null;
  tokens: AuthTokens | null;
  isLoggedIn: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Charger les données depuis le localStorage au montage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedTokens = localStorage.getItem('tokens');
    if (storedUser && storedTokens) {
      setUser(JSON.parse(storedUser));
      setTokens(JSON.parse(storedTokens));
      setIsLoggedIn(true);
    }
  }, []);

  // Fonction de login
  const login = (data: AuthResponse) => {
    setUser(data.user);
    setTokens(data.tokens);
    setIsLoggedIn(true);
    // Stocker dans le localStorage pour persistance
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('tokens', JSON.stringify(data.tokens));
  };

  // Fonction de logout
  const logout = () => {
    setUser(null);
    setTokens(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('tokens');
  };

  return (
    <UserContext.Provider value={{ user, tokens, isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
