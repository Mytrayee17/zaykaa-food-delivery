import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminContextType {
  isAdmin: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

const ADMIN_STORAGE_KEY = 'zaykaa_admin_session';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  // Check for existing admin session on mount
  useEffect(() => {
    const adminSession = localStorage.getItem(ADMIN_STORAGE_KEY);
    const sessionTimestamp = localStorage.getItem('zaykaa_admin_timestamp');
    
    if (adminSession === 'true' && sessionTimestamp) {
      const now = Date.now();
      const sessionTime = parseInt(sessionTimestamp);
      
      // Check if session has expired
      if (now - sessionTime < SESSION_TIMEOUT) {
        setIsAdmin(true);
        // Update timestamp to extend session
        localStorage.setItem('zaykaa_admin_timestamp', now.toString());
      } else {
        // Session expired, clear it
        localStorage.removeItem(ADMIN_STORAGE_KEY);
        localStorage.removeItem('zaykaa_admin_timestamp');
        setIsAdmin(false);
      }
    }
  }, []);

  // Set up activity listeners to extend session
  useEffect(() => {
    if (!isAdmin) return;

    const updateSessionTimestamp = () => {
      localStorage.setItem('zaykaa_admin_timestamp', Date.now().toString());
    };

    // Update timestamp on user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateSessionTimestamp, true);
    });

    // Check session timeout every minute
    const timeoutCheck = setInterval(() => {
      const sessionTimestamp = localStorage.getItem('zaykaa_admin_timestamp');
      if (sessionTimestamp) {
        const now = Date.now();
        const sessionTime = parseInt(sessionTimestamp);
        
        if (now - sessionTime >= SESSION_TIMEOUT) {
          logout();
        }
      }
    }, 60000); // Check every minute

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateSessionTimestamp, true);
      });
      clearInterval(timeoutCheck);
    };
  }, [isAdmin]);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const login = (password: string): boolean => {
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD
    if (!ADMIN_PASSWORD) return false
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      localStorage.setItem('zaykaa_admin_timestamp', Date.now().toString());
      setIsLoginModalOpen(false);
      navigate('/admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem('zaykaa_admin_timestamp');
    navigate('/');
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        login,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};