'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUserData } from '@/services/users';

type PermissionContextType = {
  permissions: string[];
  roles: string[];
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  isLoading: boolean;
};

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{
  children: React.ReactNode;
  initialPermissions?: string[];
  initialRoles?: string[];
}> = ({ children, initialPermissions = [], initialRoles = [] }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['user-data'],
    queryFn: () => getCurrentUserData(),
    initialData: { permissions: initialPermissions, roles: initialRoles },
  });

  const permissions = data?.permissions || [];
  const roles = data?.roles || [];

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  const hasRole = (role: string) => {
    return roles.some((r) => r.toLowerCase() === role.toLowerCase());
  };

  return (
    <PermissionContext.Provider value={{ permissions, roles, hasPermission, hasRole, isLoading }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};
