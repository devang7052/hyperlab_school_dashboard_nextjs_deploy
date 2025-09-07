'use client';

import { useSession } from 'next-auth/react';
import { DashboardConfig, getDashboardConfig } from '../utils/dashboardConfig';
import { DashboardType } from '../models/schoolInstitute';
import { useEffect } from 'react';



export const useDashboardConfig = () => {
  const { data: session } = useSession();
  
  // Get userType from session, fallback to 'school'
  const userType: DashboardType = (session?.user?.userType?.trim() || 'school') as DashboardType;
  
  // Get the config based on current session userType
  const config: DashboardConfig = getDashboardConfig(userType);

  useEffect(() => {
    if (config) {
      Object.entries(config.theme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key.replace(/_/g, '-')}`, value);
      });
    }
  }, [config]);

  return {
    config,
    userType,
  };
}; 