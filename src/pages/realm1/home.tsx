import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronRightIcon, LockIcon, CheckIcon, Star } from 'lucide-react';
import { originTheme } from '@/lib/realm-themes'; // Theme for Realm of Origins (Realm 1)
import { realm1Missions } from '@/lib/realm1-missions';
import { useAuth } from '@/context/AuthContext';

export default function RealmHome() {
  const [, setLocation] = useLocation();
  const { 
    completedMissions, 
    testingMode,
    isRealmCompleted 
  } = useAuth();
  
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [lockedMissionTitle, setLockedMissionTitle] = useState('');
  
  // Check if mission is unlocked based on previous mission completion
  const isMissionUnlocked = (missionId: number) => {
    if (testingMode) return true; // All missions unlocked in testing mode
    
    const missionNumber = missionId - 100;
    if (missionNumber === 1) return true; // First mission is always unlocked
    
    // Mission N is unlocked if mission N-1 is completed
    const previousMissionId = 100 + (missionNumber - 1);
    return completedMissions.includes(previousMissionId);
  };
  
  const isMissionCompleted = (missionId: number) => {
    return completedMissions.includes(missionId);
  };
  
  // Get the next mission that should be completed
  const getNextMissionToComplete = () => {
    for (let i = 1; i <= realm1Missions.length; i++) {
      const missionId = 100 + i;
      if (!isMissionCompleted(missionId) && isMissionUnlocked(missionId)) {
        return i;
      }
    }
    return null;
  };
  
  // Calculate completion percentage
  const completionPercentage = (completedMissions.filter(id => id >= 101 && id <= 100 + realm1Missions.length).length / realm1Missions.length) * 100;
  

  // Mission cards are styled with African patterns
  const patternStyles = {
    spirals: {
      backgroundImage: 'url("https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-1-The-First-Exchange.png")',
      backgroundSize: '60px 60px',
      backgroundColor: '#FBF4D2',
      borderColor: '#FFC567'
    },
    zigzag: {
      backgroundImage: 'url("https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-1-The-First-Exchange.png")',
      borderColor: '#FBF4D2'
    },
    geometric: {
      backgroundImage: `url("https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-1-The-First-Exchange.png")`,
      backgroundSize: '20px 20px',
      backgroundColor: '#FBF4D2',
      borderColor: '#FFC567'
    }
  };
  
  const handleMissionClick = (mission: any) => {
    if (isMissionUnlocked(mission.id)) {
      // ID is indexed starting from 101, so mission number is id - 100
      setLocation(`/realm/1/mission/${mission.id - 100}`);
    } else {
      // Show locked modal
      setLockedMissionTitle(mission.title);
      setShowLockedModal(true);
    }
  };
  
  return (
    <div 
      className="min-h-screen py-12 px-6 md:px-12"
      style={{
        background: "linear-gradient(to bottom, #1a0f00, #2d1b00)",
       }}>
    
      {/* Header with progress indicator */}
      <header className="max-w-6xl mx-auto mb-12 relative">
        <div className="absolute inset-0 z-0 opacity-10" style={patternStyles.spirals}></div>
        <div className="relative z-10">
          <h1 
            className="text-4xl md:text-5xl font-bold text-amber-300 text-center mb-6"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            Realm of Origins
          </h1>
          <p className="text-xl text-center text-amber-100 max-w-3xl mx-auto mb-6">
            In this realm, you'll discover how money began in African societies, from direct barter 
            to cowrie shells and beyond. Complete each mission to unlock the next chapter in this journey.
          </p>
          
          {/* Progress bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-300 font-medium">Progress</span>
              <span className="text-amber-300 font-medium">
                {completedMissions.filter(id => id >= 101 && id <= 100 + realm1Missions.length).length}/{realm1Missions.length}
              </span>
            </div>
            <div className="h-3 bg-amber-900/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            {testingMode && (
              <div className="mt-2 text-center">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                  Testing Mode Active
                </span>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Path visual representation with mission indicators */}
      <div className="max-w-6xl mx-auto relative mb-16">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-amber-600/50 transform -translate-x-1/2 z-0"></div>
        
        {/* Mission markers on the path */}
        {realm1Missions.map((mission, index) => {
          const isCompleted = isMissionCompleted(mission.id);
          const isUnlocked = isMissionUnlocked(mission.id);
          const position = ((index + 1) / (realm1Missions.length + 1)) * 100;
          
          return (
            <div
              key={mission.id}
              className="absolute left-1/2 transform -translate-x-1/2 z-10"
              style={{ top: `${position}%` }}
            >
              <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                isCompleted 
                  ? 'bg-green-500 border-green-400 shadow-lg shadow-green-400/50' 
                  : isUnlocked 
                    ? 'bg-amber-300 border-amber-500 shadow-lg shadow-amber-400/50' 
                    : 'bg-gray-600 border-gray-500'
              }`}>
                {isCompleted ? (
                  <CheckIcon className="h-4 w-4 text-white" />
                ) : isUnlocked ? (
                  <Star className="h-4 w-4 text-amber-800" />
                ) : (
                  <LockIcon className="h-3 w-3 text-gray-300" />
                )}
              </div>
              
              {/* Glowing effect for completed missions */}
              {isCompleted && (
                <div className="absolute inset-0 w-8 h-8 rounded-full bg-green-400 opacity-20 animate-pulse"></div>
              )}
            </div>
          );
        })}
        
        {/* Start marker */}
        <div className="absolute left-1/2 top-0 w-6 h-6 rounded-full bg-amber-300 border-4 border-amber-600 transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
        
        {/* End marker */}
        <div className={`absolute left-1/2 bottom-0 w-6 h-6 rounded-full border-4 transform -translate-x-1/2 translate-y-1/2 z-10 transition-all duration-500 ${
          isRealmCompleted(1) 
            ? 'bg-green-500 border-green-400 shadow-lg shadow-green-400/50' 
            : 'bg-amber-300 border-amber-600'
        }`}>
          {isRealmCompleted(1) && (
            <div className="absolute inset-0 w-6 h-6 rounded-full bg-green-400 opacity-20 animate-pulse"></div>
          )}
        </div>
      </div>
      
      {/* Mission cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {realm1Missions.map((mission, index) => {
          const isUnlocked = isMissionUnlocked(mission.id);
          const isCompleted = isMissionCompleted(mission.id);
          const patternStyle = Object.values(patternStyles)[index % 3];
          
          return (
            <div 
              key={mission.id}
              className={`backdrop-blur-sm rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 relative ${
                isUnlocked 
                  ? 'hover:scale-105 hover:shadow-2xl cursor-pointer bg-amber-900/80' 
                  : 'opacity-50 cursor-pointer bg-gray-800/60'
              }`}
              onClick={() => handleMissionClick(mission)}
            >
              {/* Glowing border for completed missions */}
              {isCompleted && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-amber-400/20 animate-pulse"></div>
              )}
              
              {/* Mission header with pattern */}
              <div 
                className={`h-24 flex items-center justify-center relative ${
                  isUnlocked ? '' : 'grayscale'
                }`}
                style={isUnlocked ? patternStyle : { ...patternStyle, opacity: 0.3 }}
              >
                <div className={`absolute inset-0 ${isUnlocked ? 'bg-black/30' : 'bg-black/60'}`}></div>
                <h2 className={`text-xl font-bold relative z-10 px-6 text-center ${
                  isUnlocked ? 'text-white' : 'text-gray-400'
                }`}>
                  {mission.title}
                </h2>
                
                {/* Status indicator */}
                {isCompleted ? (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-400/50">
                    <CheckIcon className="h-5 w-5 text-white" />
                  </div>
                ) : !isUnlocked ? (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <LockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-500/80 flex items-center justify-center shadow-lg shadow-amber-400/50">
                    <Star className="h-5 w-5 text-amber-900" />
                  </div>
                )}
              </div>
              
              {/* Mission content */}
              <div className="p-6 border-t-4" style={{ 
                borderColor: isUnlocked ? patternStyle.borderColor : '#4a5568' 
              }}>
                <h3 className={`text-lg font-semibold mb-3 ${
                  isUnlocked ? 'text-amber-300' : 'text-gray-500'
                }`}>
                  {mission.subtitle}
                </h3>
                <p className={`mb-4 ${
                  isUnlocked ? 'text-amber-100' : 'text-gray-400'
                }`}>
                  {mission.description.substring(0, 120)}...
                </p>
                
                {/* Mission objectives summary */}
                <div className="mt-4 space-y-2">
                  <h4 className={`font-semibold text-sm ${
                    isUnlocked ? 'text-amber-300' : 'text-gray-500'
                  }`}>
                    Objectives:
                  </h4>
                  <ul className={`text-sm ${
                    isUnlocked ? 'text-amber-100' : 'text-gray-400'
                  }`}>
                    {mission.objectives.slice(0, 2).map((objective, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className={`mr-2 ${
                          isUnlocked ? 'text-amber-300' : 'text-gray-500'
                        }`}>•</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                    {mission.objectives.length > 2 && (
                      <li className={`text-sm ${
                        isUnlocked ? 'text-amber-300' : 'text-gray-500'
                      }`}>
                        + {mission.objectives.length - 2} more
                      </li>
                    )}
                  </ul>
                </div>
                
                {/* Button to start or indicate locked status */}
                <div className="mt-6 flex justify-end">
                  {isUnlocked ? (
                    <button 
                      className={`flex items-center transition-colors ${
                        isCompleted 
                          ? 'text-green-400 hover:text-green-300' 
                          : 'text-amber-300 hover:text-amber-200'
                      }`}
                    >
                      <span>{isCompleted ? 'Revisit' : 'Start'} Mission</span>
                      <ChevronRightIcon className="ml-1 h-5 w-5" />
                    </button>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <LockIcon className="mr-1 h-4 w-4" />
                      <span className="text-sm">Locked</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Locked Mission Modal */}
      {showLockedModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-amber-900/90 backdrop-blur-sm rounded-xl p-6 max-w-md w-full border border-amber-700">
            <div className="text-center">
              <LockIcon className="h-16 w-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-amber-300 mb-3">
                Mission Locked
              </h3>
              <p className="text-amber-100 mb-2">
                <strong>{lockedMissionTitle}</strong> is currently locked.
              </p>
              <p className="text-amber-200 mb-6">
                Complete the previous missions in order to unlock this one and continue your journey through the Realm of Origins.
              </p>
              
              {/* Show which mission needs to be completed */}
              {(() => {
                const nextMission = getNextMissionToComplete();
                return nextMission ? (
                  <div className="bg-amber-800/50 rounded-lg p-3 mb-4">
                    <p className="text-amber-200 text-sm">
                      <strong>Next:</strong> Complete Mission {nextMission} to continue
                    </p>
                  </div>
                ) : null;
              })()}
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLockedModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Close
                </button>
                {(() => {
                  const nextMission = getNextMissionToComplete();
                  return nextMission ? (
                    <button
                      onClick={() => {
                        setShowLockedModal(false);
                        setLocation(`/realm/1/mission/${nextMission}`);
                      }}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Go to Mission {nextMission}
                    </button>
                  ) : null;
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}