import { useState, lazy, Suspense } from 'react';
import { MissionContent } from '@/lib/realm4-missions';
import { Loader2, ChevronLeft, ChevronRight, User, Award, Map } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { miningTheme } from '@/lib/realm-themes';

// Import Realm 4 simulation components
const MiningSimulator = lazy(() => import('../simulations/MiningSimulator').then(module => ({ default: module.MiningSimulator })));
const ConsensusSimulator = lazy(() => import('../simulations/ConsensusSimulator').then(module => ({ default: module.ConsensusSimulator })));
const EnergySimulator = lazy(() => import('../simulations/EnergySimulator').then(module => ({ default: module.EnergySimulator })));
const AfricaSimulator = lazy(() => import('../simulations/AfricaSimulator').then(module => ({ default: module.AfricaSimulator })));
const KnowledgeSimulator = lazy(() => import('../simulations/KnowledgeSimulator').then(module => ({ default: module.KnowledgeSimulator })));
const HalvingSimulator = lazy(() => import('../simulations/HalvingSimulator').then(module => ({ default: module.HalvingSimulator })));

interface Realm4MissionsProps {
  mission: MissionContent;
  onComplete?: () => void;
  missionId: number;
  realmId: number;
  totalMissions: number;
}

export function Realm4Missions({ mission, onComplete, missionId, realmId, totalMissions }: Realm4MissionsProps) {
  const [isSimulationComplete, setIsSimulationComplete] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>('intro');

  const handleSimulationComplete = () => {
    setIsSimulationComplete(true);
    if (onComplete) {
      onComplete();
    }
  };

  const startSimulation = () => {
    setCurrentSection('simulation');
  };

  const renderSimulation = () => {
    return (
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      }>
        {(() => {
          switch (mission.simulationType) {
            case 'mining':
              return <MiningSimulator onComplete={handleSimulationComplete} />;
            case 'consensus':
              return <ConsensusSimulator onComplete={handleSimulationComplete} />;
            case 'energy':
              return <EnergySimulator onComplete={handleSimulationComplete} />;
            case 'africa':
              return <AfricaSimulator onComplete={handleSimulationComplete} />;
            case 'knowledge':
              return <KnowledgeSimulator onComplete={handleSimulationComplete} />;
            case 'halving':
              return <HalvingSimulator onComplete={handleSimulationComplete} />;
            default:
              return (
                <div className="text-center py-10">
                  <p className="text-red-400">Simulation not found for this mission type.</p>
                </div>
              );
          }
        })()}
      </Suspense>
    );
  };

  const renderContent = () => {
    if (typeof mission.content === 'string') {
      return (
        <div className="prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: mission.content }} />
        </div>
      );
    }

    // Handle React elements
    return (
      <div className="prose prose-invert max-w-none text-orange-100">
        {mission.content}
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen text-white"
      style={{
        background: `linear-gradient(to bottom, ${miningTheme.colors.background}, ${miningTheme.colors.backgroundLight})`,
        backgroundImage: "url('/realms/mining.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundBlendMode: "overlay"
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/realm4">
            <a className="inline-flex items-center hover:text-orange-300 transition-colors text-orange-400">
              <ChevronLeft className="mr-2 h-5 w-5" />
              <span>Back to The Mountain Forge</span>
            </a>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/profile">
              <a className="p-2 rounded-full bg-orange-600/20 hover:bg-orange-600/30 transition-colors">
                <User className="h-5 w-5 text-orange-400" />
              </a>
            </Link>
            <Link href="/badges">
              <a className="p-2 rounded-full bg-orange-600/20 hover:bg-orange-600/30 transition-colors">
                <Award className="h-5 w-5 text-orange-400" />
              </a>
            </Link>
            <Link href="/map">
              <a className="p-2 rounded-full bg-orange-600/20 hover:bg-orange-600/30 transition-colors">
                <Map className="h-5 w-5 text-orange-400" />
              </a>
            </Link>
          </div>
        </div>

        {/* Mission Navigation */}
        <div className="flex justify-between items-center mb-8">
          {missionId > 1 ? (
            <Link href={`/realm/4/mission/${missionId - 1}`}>
              <a className="inline-flex items-center px-4 py-2 bg-orange-600/20 rounded-lg hover:bg-orange-600/30 transition-colors">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Mission
              </a>
            </Link>
          ) : (
            <div></div>
          )}
          
          <div className="text-orange-400 text-sm font-medium">
            Mission {missionId} of {totalMissions}
          </div>
          
          {missionId < totalMissions ? (
            <Link href={`/realm/4/mission/${missionId + 1}`}>
              <a className="inline-flex items-center px-4 py-2 bg-orange-600/20 rounded-lg hover:bg-orange-600/30 transition-colors">
                Next Mission
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Link>
          ) : (
            <Link href="/realm5">
              <a className="inline-flex items-center px-4 py-2 bg-purple-600/20 rounded-lg hover:bg-purple-600/30 transition-colors">
                Next Realm
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Link>
          )}
        </div>

        {/* Mission Content - Full Width, No Card Wrapper */}
        <div className="w-full space-y-12">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-orange-400">{mission.title}</h1>
            <p className="text-2xl md:text-3xl text-orange-300 mb-12">{mission.subtitle}</p>
          </div>

          {currentSection === 'intro' && (
            <div className="w-full space-y-12">
              <div className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 backdrop-blur-sm rounded-2xl p-8 border border-orange-700/30">
                {renderContent()}
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={startSimulation}
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-4 text-xl rounded-xl shadow-lg"
                  style={{ 
                    background: `linear-gradient(45deg, ${miningTheme.colors.primary}, ${miningTheme.colors.secondary})`,
                    boxShadow: '0 8px 32px rgba(238, 114, 11, 0.3)'
                  }}
                >
                  Begin Mining Challenge
                </Button>
              </div>
            </div>
          )}

          {currentSection === 'simulation' && (
            <div className="w-full">
              {renderSimulation()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}