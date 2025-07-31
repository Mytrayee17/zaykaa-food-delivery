import { useState } from 'react';

export const useAdminMode = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
  };

  return {
    isAdmin,
    toggleAdminMode
  };
};