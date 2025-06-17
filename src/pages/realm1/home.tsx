import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronRightIcon, LockIcon, CheckIcon } from 'lucide-react';
import { originTheme } from '@/lib/realm-themes'; // Theme for Realm of Origins (Realm 1)
import { realm1Missions } from '@/lib/realm1-missions';

export default function RealmHome() {
  const [, setLocation] = useLocation();
  // Track completed missions (in a real app, this would come from a database)
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  
  // All missions are unlocked
  const getNextUnlockedMission = () => {
    return 999; // Return a high number to unlock all missions
  };
  
  const isMissionUnlocked = (missionId: number) => {
    return true; // All missions are unlocked
  };
  
  const isMissionCompleted = (missionId: number) => {
    return completedMissions.includes(missionId);
  };
  
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
  
  const handleMissionClick = (missionId: number) => {
    if (isMissionUnlocked(missionId)) {
      // ID is indexed starting from 101, so mission number is id - 100
      setLocation(`/realm/1/mission/${missionId - 100}`);
    }
  };
  
  return (
    <div 
      className="min-h-screen py-12 px-6 md:px-12"
      style={{
        //  background: "linear-gradient(to bottom, #000000, #1a001a)",
         backgroundImage: "url(https://bitcoiners.africa/wp-content/uploads/2025/06/1-1.png)",
         backgroundSize: "cover",
        //  backgroundPosition: "center",
        //  backgroundAttachment: "fixed",
        //  backgroundBlendMode: "overlay"
       }}>
    
      {/* Header with adinkra-inspired patterns */}
      <header className="max-w-6xl mx-auto mb-12 relative">
        <div className="absolute inset-0 z-0 opacity-10" style={patternStyles.spirals}></div>
        <div className="relative z-10">
          <h1 
            className="text-4xl md:text-5xl font-bold text-amber-300 text-center mb-6"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            Realm of Origins
          </h1>
          <p className="text-xl text-center text-amber-100 max-w-3xl mx-auto">
            In this realm, you'll discover how money began in African societies, from direct barter 
            to cowrie shells and beyond. Complete each mission to unlock the next chapter in this journey.
          </p>
        </div>
      </header>
      
      {/* Path visual representation */}
      <div className="max-w-6xl mx-auto relative mb-16">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-amber-600 transform -translate-x-1/2 z-0"></div>
        
        {/* Circular marker for journey start */}
        <div className="absolute left-1/2 top-0 w-6 h-6 rounded-full bg-amber-300 border-4 border-amber-600 transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
        
        {/* Circular marker for journey end */}
        <div className="absolute left-1/2 bottom-0 w-6 h-6 rounded-full bg-amber-300 border-4 border-amber-600 transform -translate-x-1/2 translate-y-1/2 z-10"></div>
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
              className={`bg-amber-900/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 ${isUnlocked ? 'hover:scale-105 hover:shadow-2xl cursor-pointer' : 'opacity-75 cursor-not-allowed'}`}
              onClick={() => handleMissionClick(mission.id)}
            >
              {/* Mission header with pattern */}
              <div 
                className="h-24 flex items-center justify-center relative"
                style={patternStyle}
              >
                <div className="absolute inset-0 bg-black/30"></div>
                <h2 className="text-xl font-bold text-white relative z-10 px-6 text-center">{mission.title}</h2>
                
                {/* Status indicator */}
                {isCompleted ? (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckIcon className="h-5 w-5 text-white" />
                  </div>
                ) : !isUnlocked ? (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-amber-900/80 flex items-center justify-center">
                    <LockIcon className="h-5 w-5 text-amber-300" />
                  </div>
                ) : null}
              </div>
              
              {/* Mission content */}
              <div className="p-6 border-t-4" style={{ borderColor: patternStyle.borderColor }}>
                <h3 className="text-lg font-semibold text-amber-300 mb-3">{mission.subtitle}</h3>
                <p className="text-amber-100 mb-4">{mission.description.substring(0, 120)}...</p>
                
                {/* Mission objectives summary */}
                <div className="mt-4 space-y-2">
                  <h4 className="font-semibold text-amber-300 text-sm">Objectives:</h4>
                  <ul className="text-sm text-amber-100">
                    {mission.objectives.slice(0, 2).map((objective, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-amber-300 mr-2">•</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                    {mission.objectives.length > 2 && (
                      <li className="text-amber-300 text-sm">+ {mission.objectives.length - 2} more</li>
                    )}
                  </ul>
                </div>
                
                {/* Button to start or indicate locked status */}
                <div className="mt-6 flex justify-end">
                  {isUnlocked ? (
                    <button 
                      className="flex items-center text-amber-300 hover:text-amber-200 transition-colors"
                    >
                      <span>{isCompleted ? 'Revisit' : 'Start'} Mission</span>
                      <ChevronRightIcon className="ml-1 h-5 w-5" />
                    </button>
                  ) : (
                    <div className="flex items-center text-amber-700">
                      <LockIcon className="mr-1 h-4 w-4" />
                      <span>Complete previous mission to unlock</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}