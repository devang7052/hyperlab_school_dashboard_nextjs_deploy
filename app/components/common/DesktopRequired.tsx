'use client'

import { useState, useEffect } from 'react';

interface DesktopRequiredProps {
  minWidth?: number; // Minimum width required for the desktop view, defaults to 768px (md breakpoint)
  children: React.ReactNode;
}

export default function DesktopRequired({ minWidth = 1000, children }: DesktopRequiredProps) {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= minWidth);
    };

    // Set initial state
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [minWidth]);

  if (!isDesktop) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-sm">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Desktop Required</h2>
          <p className="text-gray-700">This application is designed to be viewed on a desktop or larger screen.</p>
          <p className="text-gray-700 mt-2">Please access it from a device with a wider screen.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 