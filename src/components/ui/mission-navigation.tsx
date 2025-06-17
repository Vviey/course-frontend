import React from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, ChevronRight, Home, Map, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getRealmTheme } from '@/lib/realm-themes';
import { getTotalMissionsForRealm, getMissionTitle, getNextRealmInfo, getRealmName } from '@/lib/realm-utils';

interface MissionNavigationProps {
  realmId: number;
  missionId?: number;
  totalMissions?: number;
  progress?: number;
  title?: string;
  showHomeButton?: boolean;
  showMapButton?: boolean;
  showProgress?: boolean;
  className?: string;
  enableCrossRealmNavigation?: boolean;
}

export function MissionNavigation({
  realmId,
  missionId,
  totalMissions,
  progress = 0,
  title,
  showHomeButton = true,
  showMapButton = true,
  showProgress = true,
  className = '',
  enableCrossRealmNavigation = true,
}: MissionNavigationProps) {
  const [, setLocation] = useLocation();
  const realmTheme = getRealmTheme(realmId);

  // Get actual mission count from realm data if not provided
  const actualTotalMissions = totalMissions || getTotalMissionsForRealm(realmId);
  const currentMission = missionId || 1;
  const actualTitle = title || getMissionTitle(realmId, currentMission);
  
  // Navigation logic
  const hasPrevious = currentMission > 1;
  const hasNext = currentMission < actualTotalMissions;
  
  // Cross-realm navigation
  const nextRealmInfo = getNextRealmInfo(realmId, currentMission);
  const canGoToNextRealm = enableCrossRealmNavigation && !hasNext && nextRealmInfo.hasNextRealm;

  // Navigation handlers
  const goToPreviousMission = () => {
    if (hasPrevious) {
      setLocation(`/realm/${realmId}/mission/${currentMission - 1}`);
    }
  };

  const goToNextMission = () => {
    if (hasNext) {
      setLocation(`/realm/${realmId}/mission/${currentMission + 1}`);
    }
  };

  const goToNextRealm = () => {
    if (canGoToNextRealm && nextRealmInfo.nextRealmId && nextRealmInfo.nextMissionId) {
      setLocation(`/realm/${nextRealmInfo.nextRealmId}/mission/${nextRealmInfo.nextMissionId}`);
    }
  };

  const goToRealmHome = () => {
    setLocation(`/realm/${realmId}`);
  };

  const goToMap = () => {
    setLocation('/map');
  };

  const goToHome = () => {
    setLocation('/home');
  };

  // Get colors based on realm theme
  const primaryColor = realmTheme.colors?.primary || '#FFB400';
  const secondaryColor = realmTheme.colors?.secondary || '#FFD700';
  const accent1Color = realmTheme.colors?.accent1 || '#FFA000';
  const progressBgColor = `${accent1Color}20`;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col gap-3">
        {/* Top row with mission title and navigation */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {showHomeButton && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToRealmHome}
                className="flex items-center justify-center w-8 h-8 rounded-full"
                style={{
                  backgroundColor: `${primaryColor}30`,
                  color: primaryColor,
                }}
              >
                <BookOpen size={16} />
              </motion.button>
            )}

            {showMapButton && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToMap}
                className="flex items-center justify-center w-8 h-8 rounded-full"
                style={{
                  backgroundColor: `${primaryColor}30`,
                  color: primaryColor,
                }}
              >
                <Map size={16} />
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToHome}
              className="flex items-center justify-center w-8 h-8 rounded-full"
              style={{
                backgroundColor: `${primaryColor}30`,
                color: primaryColor,
              }}
            >
              <Home size={16} />
            </motion.button>

            {title && (
              <h1 className="text-lg font-semibold ml-2" style={{ color: primaryColor }}>
                {title}
              </h1>
            )}
          </div>

          {/* Mission progress text */}
          {missionId && actualTotalMissions > 1 && (
            <div className="text-sm font-medium" style={{ color: secondaryColor }}>
              Mission {currentMission} of {actualTotalMissions}
            </div>
          )}
        </div>

        {/* Progress bar */}
        {showProgress && (
          <div 
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: progressBgColor }}
          >
            <div 
              className="h-full transition-all duration-300 ease-out"
              style={{ 
                width: `${progress}%`,
                backgroundColor: primaryColor,
              }}
            />
          </div>
        )}

        {/* Bottom row with previous/next buttons */}
        {missionId && actualTotalMissions > 1 && (
          <div className="flex justify-between items-center mt-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={goToPreviousMission}
              disabled={!hasPrevious}
              className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
                hasPrevious ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
              }`}
              style={{
                backgroundColor: hasPrevious ? `${primaryColor}30` : 'transparent',
                color: hasPrevious ? primaryColor : `${primaryColor}60`,
              }}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </motion.button>

            {/* Next Mission or Next Realm Button */}
            {hasNext ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goToNextMission}
                className="flex items-center gap-1 px-3 py-1 rounded-md transition-colors cursor-pointer"
                style={{
                  backgroundColor: `${primaryColor}30`,
                  color: primaryColor,
                }}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </motion.button>
            ) : canGoToNextRealm ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goToNextRealm}
                className="flex items-center gap-1 px-3 py-1 rounded-md transition-colors cursor-pointer"
                style={{
                  backgroundColor: `${primaryColor}30`,
                  color: primaryColor,
                }}
                title={`Continue to ${getRealmName(nextRealmInfo.nextRealmId!)}`}
              >
                <span>Next Realm</span>
                <ArrowRight size={16} />
              </motion.button>
            ) : (
              <motion.button
                disabled={true}
                className="flex items-center gap-1 px-3 py-1 rounded-md transition-colors cursor-not-allowed opacity-50"
                style={{
                  backgroundColor: 'transparent',
                  color: `${primaryColor}60`,
                }}
              >
                <span>Complete</span>
                <ChevronRight size={16} />
              </motion.button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}