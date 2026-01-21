import React, { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'teacher' | 'student';

interface RoleContextType {
  role: Role;
  toggleRole: () => void;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>('student');

  const toggleRole = () => {
    setRole(prev => prev === 'teacher' ? 'student' : 'teacher');
  };

  return (
    <RoleContext.Provider value={{ role, toggleRole, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
