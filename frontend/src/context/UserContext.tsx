import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
}

interface UserContextType {
  user: UserProfile;
  updateUser: (data: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_USER: UserProfile = {
  id: 'guest',
  name: 'User',
  email: '',
  role: 'EDITOR',
  avatar: null,
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const savedUser = localStorage.getItem('admin_user');
      return savedUser ? { ...DEFAULT_USER, ...JSON.parse(savedUser) } : DEFAULT_USER;
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      return DEFAULT_USER;
    }
  });

  useEffect(() => {
    localStorage.setItem('admin_user', JSON.stringify(user));
  }, [user]);

  const updateUser = (data: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
