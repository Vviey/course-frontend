import { useEffect, useState, lazy, Suspense } from 'react';
import { useLocation, useParams } from 'wouter';
import { Mission } from '@/components/missions/Mission';
import { realm1Missions } from '@/lib/realm1-missions';
import { useAuth } from '@/context/AuthContext';
import { originTheme } from '@/lib/realm-themes';
import { Loader2 } from 'lucide-react';
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
  const { user, loading } = useAuth();
  const [missionComplete, setMissionComplete] = useState(false);
  const [contentRead, setContentRead] = useState(false);
  const [shareContent, setShareContent] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  // Parse mission ID from URL
  const missionNumber = parseInt(missionId || '1');
  const missionDataId = 100 + missionNumber;

  // Current mission data
  const missionData = realm1Missions.find(m => m.id === missionDataId);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      setLocation('/auth');
    }
  }, [user, loading, setLocation]);

  // Handle mission completion
  const handleMissionComplete = () => {
    setMissionComplete(true);
    setTimeout(() => {
      setLocation('/realm/1/home');
    }, 2000);
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

   // Background image configuration
   const backgroundStyles = {
    backgroundImage: `url('https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-1-African-Currency-Eolution.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  };

  return (
    <div className="h-screen" style={{ backgroundColor: bgColor }}>
      {/* Mission navigation header
      <header className="mx-auto">
        <button 
          onClick={() => setLocation('/realm/1/home')} 
          className="flex items-center transition-colors font-medium"
          style={{ color: secondaryColor }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>
      </header> */}
      
      {/* Mission completion message */}
      {missionComplete && (
        <div className="fixed top-0 left-0 right-0 bg-green-600 text-white p-3 text-center z-50">
          Mission complete! Great job! Redirecting to Realm...
        </div>
      )}
      
      {/* Mission not found message */}
      {!missionData && (
        <div className="mx-auto bg-amber-100 border-2 border-amber-500 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-amber-900">Mission Not Found</h2>
          <p className="text-amber-800">This mission doesn't exist yet or may have been moved.</p>
          <button 
            onClick={() => setLocation('/realm/1/home')} 
            className="bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors"
          >
            Return to Realm
          </button>
        </div>
      )}
      
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
                  className="text-white font-semibold rounded-lg transition-colors shadow-lg flex items-center group"
                  style={{ 
                    backgroundImage: `url('https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-1-African-Currency-Eolution.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                  }}
                >
                  Start Challenge
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold" style={{ color: primaryColor }}>
                Challenge: {missionData?.title}
              </h2>
              <p className="text-gray-300">
                Complete this challenge to unlock the next mission and continue your journey through the Realm of Origins.
              </p>
              <div>
                {renderSimulation()}
              </div>
            </div>
          )}
          
          {/* Social media sharing section */}
          {showShareModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="rounded-xl" style={{ backgroundColor: originTheme?.colors?.backgroundLight || "#694E1E" }}>
                <h3 className="text-2xl font-bold" style={{ color: secondaryColor }}>
                  Share Your Insight
                </h3>
                <textarea
                  className="w-full rounded-lg border-2"
                  style={{ 
                    borderColor: `${primaryColor}40`,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    color: 'white'
                  }}
                  rows={5}
                  value={shareContent}
                  onChange={(e) => setShareContent(e.target.value)}
                />
                <div className="flex flex-wrap gap-3">
                  <button className="bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors">X (Twitter)</button>
                  <button className="bg-blue-800 text-white rounded-lg shadow-md hover:bg-blue-900 transition-colors">Facebook</button>
                  <button className="bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors">WhatsApp</button>
                  <button className="bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors">Telegram</button>
                  <button className="bg-purple-700 text-white rounded-lg shadow-md hover:bg-purple-800 transition-colors">Nostr</button>
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={() => setShowShareModal(false)}
                    className="bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleMissionComplete}
                    className="text-white rounded-lg shadow-md transition-colors"
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