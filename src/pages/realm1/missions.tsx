import { useEffect, useState, lazy, Suspense } from 'react';
import { useLocation, useParams } from 'wouter';
import { Mission } from '@/components/missions/Mission';
import { realm1Missions } from '@/lib/realm1-missions';
import { useAuth } from '@/context/AuthContext';
import { originTheme } from '@/lib/realm-themes';
import { Loader2, Lock, CheckCircle } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

// Lazy load simulation components
const BarterWebChallenge = lazy(() => import('./barter-web-challenge'));
const TimelineBuilder = lazy(() => import('./timeline-builder'));
const InflationSimulator = lazy(() => import('./inflation-simulator'));
const AfricanCurrencyEducation = lazy(() => import('./african-currency-education'));
const QuizChallenge = lazy(() => import('@/components/simulations/QuizChallenge').then(module => ({ default: module.QuizChallenge })));
const TradeRouteMap = lazy(() => import('@/components/simulations/TradeRouteMap').then(module => ({ default: module.TradeRouteMap })));

export default function Realm1Mission() {
  const [, setLocation] = useLocation();
  const { missionId } = useParams<{ missionId: string }>();
  const { 
    user, 
    loading, 
    completedMissions, 
    completeMission, 
    completeRealm,
    testingMode 
  } = useAuth();
  const [missionComplete, setMissionComplete] = useState(false);
  const [contentRead, setContentRead] = useState(false);
  const [shareContent, setShareContent] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  // Parse mission ID from URL
  const missionNumber = parseInt(missionId || '1');
  const missionDataId = 100 + missionNumber;

  // Current mission data
  const missionData = realm1Missions.find(m => m.id === missionDataId);

  // Check if mission is unlocked
  const isMissionUnlocked = (missionNum: number): boolean => {
    if (testingMode) return true; // All missions unlocked in testing mode
    if (missionNum === 1) return true; // First mission is always unlocked
    
    // Mission N is unlocked if mission N-1 is completed
    const previousMissionId = 100 + (missionNum - 1);
    return completedMissions.includes(previousMissionId);
  };

  // Check if mission is completed
  const isMissionCompleted = (missionNum: number): boolean => {
    const missionId = 100 + missionNum;
    return completedMissions.includes(missionId);
  };

  // Check if this is the last mission in the realm
  const isLastMission = (): boolean => {
    return missionNumber === realm1Missions.length;
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      setLocation('/auth');
    }
  }, [user, loading, setLocation]);

  // Check if user can access this mission
  useEffect(() => {
    if (!loading && missionData && !isMissionUnlocked(missionNumber)) {
      // Redirect to realm home if mission is locked
      setLocation('/realm/1/home');
    }
  }, [loading, missionData, missionNumber, completedMissions, testingMode]);

  // Handle mission completion
  const handleMissionComplete = () => {
    if (!missionData) return;

    // Mark mission as completed
    completeMission(missionDataId);
    setMissionComplete(true);

    // Check if this is the last mission in the realm
    if (isLastMission()) {
      // Mark realm as completed
      completeRealm(1);
      
      setTimeout(() => {
        setLocation('/realm/1/home?completed=true');
      }, 3000); // Longer delay for realm completion celebration
    } else {
      setTimeout(() => {
        setLocation('/realm/1/home');
      }, 2000);
    }
  };

  // Render appropriate simulation based on mission type
  const renderSimulation = () => {
    if (!missionData) return null;

    return (
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      }>
        {(() => {
          switch (missionData.simulationType) {
            case 'barter':
              return <BarterWebChallenge onComplete={handleMissionComplete} />;
            case 'timeline':
              return <TimelineBuilder onComplete={handleMissionComplete} />;
            case 'inflation':
              return <InflationSimulator onComplete={handleMissionComplete} />;
            case 'reflection':
              return <AfricanCurrencyEducation onComplete={handleMissionComplete} />;
            case 'quiz':
              return <QuizChallenge questions={missionData.simulationData?.questions || []} onComplete={handleMissionComplete} />;
            case 'map':
              return <TradeRouteMap 
                cities={missionData.simulationData?.cities || []} 
                routes={missionData.simulationData?.routes || []} 
                onComplete={handleMissionComplete} 
              />;
            default:
              return <div className="text-center text-amber-300 py-10">
                <p>Challenge not found for this mission type.</p>
              </div>;
          }
        })()}
      </Suspense>
    );
  };

  if (loading || !missionData) {
    const bgColor = originTheme?.colors?.background || "#38290E";
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: bgColor }}>
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-32 rounded-full mb-4" style={{ backgroundColor: originTheme?.colors?.primary || "#B87F31" }}></div>
          <div className="h-6 w-48 rounded-full" style={{ backgroundColor: originTheme?.colors?.primary || "#B87F31" }}></div>
        </div>
      </div>
    );
  }

  // Define theme colors
  const bgColor = originTheme?.colors?.background || "#38290E";
  const primaryColor = originTheme?.colors?.primary || "#B87F31";
  const secondaryColor = originTheme?.colors?.secondary || "#E6A23C";

  // Check if mission is locked
  const isLocked = !isMissionUnlocked(missionNumber);
  const isCompleted = isMissionCompleted(missionNumber);

  // If mission is locked, show lock screen
  if (isLocked && !testingMode) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: bgColor }}>
        <div className="max-w-md mx-auto text-center p-8 rounded-xl bg-black/30 border border-gray-600">
          <Lock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>
            Mission Locked
          </h2>
          <p className="text-gray-300 mb-6">
            Complete Mission {missionNumber - 1} to unlock this mission.
          </p>
          <button
            onClick={() => setLocation('/realm/1/home')}
            className="px-6 py-3 rounded-lg font-medium transition-colors"
            style={{ backgroundColor: primaryColor, color: 'white' }}
          >
            Return to Realm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen" style={{ backgroundColor: bgColor }}>
      {/* Mission completion message */}
      {missionComplete && (
        <div className="fixed top-0 left-0 right-0 z-50">
          {isLastMission() ? (
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 text-center">
              <CheckCircle className="inline h-6 w-6 mr-2" />
              🎉 Realm 1 Complete! You've mastered the origins of money! 🎉
              <div className="text-sm mt-1">Unlocking next realm...</div>
            </div>
          ) : (
            <div className="bg-green-600 text-white p-3 text-center">
              <CheckCircle className="inline h-5 w-5 mr-2" />
              Mission complete! Great job! Next mission unlocked!
            </div>
          )}
        </div>
      )}

      {/* Mission status indicator */}
      <div className="fixed top-4 right-4 z-40">
        <div className="flex items-center space-x-2 bg-black/50 rounded-lg px-3 py-2">
          <span className="text-sm text-gray-300">Mission {missionNumber}</span>
          {isCompleted && <CheckCircle className="h-4 w-4 text-green-400" />}
          {testingMode && <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">TEST</span>}
        </div>
      </div>
      
      {/* Mission content */}
      {missionData && (
        <main className="w-full mx-auto">
          {!contentRead ? (
            <div>
              <Mission 
                mission={missionData}
                onComplete={handleMissionComplete}
                realmTheme="amber"
              />
              <div className="flex justify-center">
                <button
                  onClick={() => setContentRead(true)}
                  className="text-white font-semibold rounded-lg transition-colors shadow-lg flex items-center group px-8 py-4"
                  style={{ 
                    backgroundColor: primaryColor,
                    boxShadow: `0 0 20px ${primaryColor}40`
                  }}
                  disabled={isCompleted}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Mission Completed
                    </>
                  ) : (
                    <>
                      Start Challenge
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
                    Challenge: {missionData?.title}
                  </h2>
                  <p className="text-gray-300 mb-4">
                    Complete this challenge to unlock the next mission and continue your journey through the Realm of Origins.
                  </p>
                  
                  {/* Mission progress indicator */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm" style={{ color: secondaryColor }}>
                        Progress:
                      </span>
                      <div className="flex space-x-1">
                        {realm1Missions.map((_, index) => {
                          const missionNum = index + 1;
                          const isCurrentMission = missionNum === missionNumber;
                          const isMissionDone = isMissionCompleted(missionNum);
                          const isMissionUnlock = isMissionUnlocked(missionNum);
                          
                          return (
                            <div
                              key={missionNum}
                              className={`h-3 w-8 rounded-full ${
                                isMissionDone 
                                  ? 'bg-green-500' 
                                  : isCurrentMission 
                                    ? 'bg-blue-500' 
                                    : isMissionUnlock 
                                      ? 'bg-gray-500' 
                                      : 'bg-gray-700'
                              }`}
                              title={`Mission ${missionNum} ${isMissionDone ? '(Completed)' : isCurrentMission ? '(Current)' : isMissionUnlock ? '(Available)' : '(Locked)'}`}
                            />
                          );
                        })}
                      </div>
                      <span className="text-sm text-gray-400">
                        {completedMissions.filter(id => id >= 101 && id <= 100 + realm1Missions.length).length}/{realm1Missions.length}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/20 rounded-xl p-6">
                  {renderSimulation()}
                </div>
              </div>
            </div>
          )}
          
          {/* Social media sharing section */}
          {showShareModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="rounded-xl p-6 max-w-md w-full mx-4" style={{ backgroundColor: originTheme?.colors?.backgroundLight || "#694E1E" }}>
                <h3 className="text-2xl font-bold mb-4" style={{ color: secondaryColor }}>
                  Share Your Insight
                </h3>
                <textarea
                  className="w-full rounded-lg border-2 p-3 mb-4"
                  style={{ 
                    borderColor: `${primaryColor}40`,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    color: 'white'
                  }}
                  rows={5}
                  value={shareContent}
                  onChange={(e) => setShareContent(e.target.value)}
                  placeholder="Share what you learned..."
                />
                <div className="flex flex-wrap gap-3 mb-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors">X (Twitter)</button>
                  <button className="bg-blue-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-900 transition-colors">Facebook</button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors">WhatsApp</button>
                  <button className="bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-800 transition-colors">Nostr</button>
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    onClick={() => setShowShareModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleMissionComplete}
                    className="text-white px-6 py-2 rounded-lg shadow-md transition-colors"
                    style={{ 
                      backgroundColor: primaryColor,
                      boxShadow: `0 0 10px ${primaryColor}80`
                    }}
                  >
                    Continue Journey
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}