import React, { ReactNode, useEffect } from 'react';
import { MissionNavigation } from './mission-navigation';
import { useMissionNavigation } from '@/hooks/use-mission-navigation';
import { getRealmTheme } from '@/lib/realm-themes';
import { motion } from 'framer-motion';

interface UniversalMissionLayoutProps {
  realmId: number;
  children: ReactNode;
  onMissionComplete?: () => void;
  showProgress?: boolean;
  progress?: number;
  className?: string;
  customTitle?: string;
  enableCrossRealmNavigation?: boolean;
}

export function UniversalMissionLayout({
  realmId,
  children,
  onMissionComplete,
  showProgress = true,
  progress = 0,
  className = '',
  customTitle,
  enableCrossRealmNavigation = true
}: UniversalMissionLayoutProps) {
  const {
    currentMissionId,
    totalMissions,
    missionTitle,
    user,
    loading,
    checkAuth,
    handleMissionComplete
  } = useMissionNavigation({ 
    realmId, 
    onMissionComplete 
  });

  const realmTheme = getRealmTheme(realmId);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [user, loading]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(to bottom, ${realmTheme.colors.background}, ${realmTheme.colors.backgroundLight})`,
        }}
      >
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2"
          style={{ borderColor: realmTheme.colors.primary }}
        />
      </div>
    );
  }

  // Show auth required state
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(to bottom, ${realmTheme.colors.background}, ${realmTheme.colors.backgroundLight})`,
        }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: realmTheme.colors.primary }}>
            Authentication Required
          </h1>
          <p className="text-gray-300">Please log in to access this mission.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`min-h-screen ${className}`}
      style={{
        background: `linear-gradient(to bottom, ${realmTheme.colors.background}, ${realmTheme.colors.backgroundLight})`,
      }}
    >
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <MissionNavigation
            realmId={realmId}
            missionId={currentMissionId}
            totalMissions={totalMissions}
            progress={progress}
            title={customTitle || missionTitle}
            showProgress={showProgress}
            enableCrossRealmNavigation={enableCrossRealmNavigation}
          />
        </div>
      </div>

      {/* Mission Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Footer Navigation (optional - for mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-t border-white/10 px-4 py-2">
        <MissionNavigation
          realmId={realmId}
          missionId={currentMissionId}
          totalMissions={totalMissions}
          showHomeButton={false}
          showMapButton={false}
          showProgress={false}
          enableCrossRealmNavigation={enableCrossRealmNavigation}
          className="max-w-xs mx-auto"
        />
      </div>
    </motion.div>
  );
}