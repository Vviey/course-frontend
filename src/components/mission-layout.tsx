import React, { ReactNode, useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { getRealmName } from '@/lib/realm-utils';
import { MissionNavigation } from '@/components/ui/mission-navigation';

interface MissionLayoutProps {
  children: ReactNode;
  realmId: string | number;
  missionId?: string | number;
  totalMissions?: number;
  title?: string;
  subtitle?: string;
  progress?: number;
}

export default function MissionLayout({
  children,
  realmId,
  missionId,
  totalMissions = 1,
  title = "Mission",
  subtitle = "",
  progress = 0
}: MissionLayoutProps) {
  const [, setLocation] = useLocation();
  const [scrollProgress, setScrollProgress] = useState(progress);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const scrollPercentage = Math.min(
        100,
        Math.max(0, Math.round((scrollY / (documentHeight - windowHeight)) * 100))
      );
      
      if (progress === 0 || scrollPercentage > scrollProgress) {
        setScrollProgress(scrollPercentage);
      }
    };    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [progress, scrollProgress]);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - now with lighter styling
      <header className="bg-white dark:bg-gray-950 shadow-sm sticky top-0 z-10 border-b">
        <div className="container mx-auto px-4 py-3">
          <MissionNavigation 
            realmId={Number(realmId)}
            missionId={missionId ? Number(missionId) : undefined}
            totalMissions={totalMissions}
            progress={scrollProgress}
            title={`${getRealmName(Number(realmId))} - ${title}`}
            showHomeButton={true}
            showMapButton={true}
            showProgress={true}
          />
        </div>
      </header> */}
      
      {/* Main content area - now full width */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Title section with updated styling */}
        {/* <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div> */}
        
        {/* Children content - now full width within container */}
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
}