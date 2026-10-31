import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '../types/procurement';
import { MOCK_AUTH_USERS } from '../data/mockData';

export interface RegisterUserData {
  name: string;
  email: string;
  password?: string;
  role: string;
  department: string;
  organization: string;
  authorityLimit: number;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  users: AuthUser[];
  login: (email: string, password?: string) => { success: boolean; error?: string };
  register: (userData: RegisterUserData) => { success: boolean; error?: string };
  demoLogin: (userId: string) => void;
  logout: () => void;
  updateCurrentUserProfile: (updates: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'procure_ai_auth_user_v2';
const USERS_STORAGE_KEY = 'procure_ai_all_users_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load registered users list
  const [users, setUsers] = useState<AuthUser[]>(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse stored users:', e);
    }
    return MOCK_AUTH_USERS;
  });

  // Load current active user
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse stored auth user:', e);
    }
    // Default to the Senior Director Rachel Chen for seamless first load
    return MOCK_AUTH_USERS[0];
  });

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users to storage:', e);
    }
  }, [users]);

  // Sync current user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save auth state:', e);
    }
  }, [currentUser]);

  const login = (email: string, _password?: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!found) {
      return {
        success: false,
        error: 'No registered evaluator account found with this corporate email.',
      };
    }

    setCurrentUser(found);
    return { success: true };
  };

  const register = (userData: RegisterUserData): { success: boolean; error?: string } => {
    const trimmedEmail = userData.email.trim().toLowerCase();
    
    // Check if user already exists
    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return {
        success: false,
        error: 'An account with this work email address already exists. Please log in instead.',
      };
    }

    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: userData.name.trim(),
      email: trimmedEmail,
      role: userData.role.trim() || 'Procurement Evaluator',
      department: userData.department.trim() || 'Strategic Sourcing',
      organization: userData.organization.trim() || 'Global Enterprise Consortium',
      authorityLimit: Number(userData.authorityLimit) || 10000000,
      currency: 'INR',
      avatarColor: 'bg-emerald-800',
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);

    return { success: true };
  };

  const demoLogin = (userId: string) => {
    const found = users.find(u => u.id === userId) || MOCK_AUTH_USERS.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateCurrentUserProfile = (updates: Partial<AuthUser>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        users,
        login,
        register,
        demoLogin,
        logout,
        updateCurrentUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
