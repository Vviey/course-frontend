import { useState, lazy, Suspense } from 'react';
import { Realm3MissionData } from '@/lib/realm3-missions';
import { Loader2, ChevronLeft, ChevronRight, Home, Award, Map, User } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { cryptographyTheme } from '@/lib/realm-themes';

// Import Realm 3 simulation components
const CryptographySimulator = lazy(() => import('../simulations/CryptographySimulator').then(module => ({ default: module.CryptographySimulator })));
const HashFunctionSimulator = lazy(() => import('../simulations/HashFunctionSimulator').then(module => ({ default: module.HashFunctionSimulator })));
const MerkleTreeSimulator = lazy(() => import('../simulations/MerkleTreeSimulator').then(module => ({ default: module.MerkleTreeSimulator })));
const ConsensusSimulator = lazy(() => import('../simulations/ConsensusSimulator').then(module => ({ default: module.ConsensusSimulator })));
const NetworkSimulator = lazy(() => import('../simulations/NetworkSimulator').then(module => ({ default: module.NetworkSimulator })));

interface Realm3MissionsProps {
  mission: Realm3MissionData;
  onComplete?: () => void;
  missionId: number;
  realmId: number;
  totalMissions: number;
}

export function Realm3Missions({ mission, onComplete, missionId, realmId, totalMissions }: Realm3MissionsProps) {
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
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </div>
      }>
        {(() => {
          switch (mission.simulationType) {
            case 'cryptography':
              return <CryptographySimulator 
                challenges={mission.simulationData?.challenges || []} 
                visualExplanations={mission.simulationData?.visualExplanations || []}
                onComplete={handleSimulationComplete} 
              />;
            case 'hash':
              return <HashFunctionSimulator 
                challenges={mission.simulationData?.challenges || []} 
                visualizations={mission.simulationData?.visualizations || []}
                onComplete={handleSimulationComplete} 
              />;
            case 'merkle':
              return <MerkleTreeSimulator 
                transactionData={mission.simulationData?.transactionData || []} 
                challenges={mission.simulationData?.challenges || []}
                onComplete={handleSimulationComplete} 
              />;
            case 'consensus':
              return <ConsensusSimulator 
                scenarios={mission.simulationData?.scenarios || []} 
                quizQuestions={mission.simulationData?.quizQuestions || []}
                onComplete={handleSimulationComplete} 
              />;
            case 'network':
              return <NetworkSimulator 
                network={mission.simulationData?.network || {}} 
                scenarios={mission.simulationData?.scenarios || []}
                interactiveTests={mission.simulationData?.interactiveTests || []}
                onComplete={handleSimulationComplete} 
              />;
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

    if (mission.content && typeof mission.content === 'object') {
      return (
        <div className="space-y-8">
          {mission.content.introduction && (
            <div className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: mission.content.introduction }} />
            </div>
          )}
          
          {mission.content.sections?.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-2xl font-bold text-green-400">{section.title}</h3>
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div 
      className="min-h-screen text-white p-6"
      style={{
        background: `linear-gradient(to bottom, ${cryptographyTheme.colors.background}, ${cryptographyTheme.colors.backgroundLight})`,
        backgroundImage: "url('/realms/birth.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundBlendMode: "overlay"
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/realm3">
            <a className="inline-flex items-center hover:text-green-300 transition-colors text-green-400">
              <ChevronLeft className="mr-2 h-5 w-5" />
              <span>Back to Realm Missions</span>
            </a>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/profile">
              <a className="p-2 rounded-full bg-green-600/20 hover:bg-green-600/30 transition-colors">
                <User className="h-5 w-5 text-green-400" />
              </a>
            </Link>
            <Link href="/badges">
              <a className="p-2 rounded-full bg-green-600/20 hover:bg-green-600/30 transition-colors">
                <Award className="h-5 w-5 text-green-400" />
              </a>
            </Link>
            <Link href="/map">
              <a className="p-2 rounded-full bg-green-600/20 hover:bg-green-600/30 transition-colors">
                <Map className="h-5 w-5 text-green-400" />
              </a>
            </Link>
          </div>
        </div>

        {/* Mission Navigation */}
        <div className="flex justify-between items-center mb-6">
          {missionId > 1 ? (
            <Link href={`/realm/3/mission/${missionId - 1}`}>
              <a className="inline-flex items-center px-4 py-2 bg-green-600/20 rounded-lg hover:bg-green-600/30 transition-colors">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Mission
              </a>
            </Link>
          ) : (
            <div></div>
          )}
          
          <div className="text-green-400 text-sm font-medium">
            Mission {missionId} of {totalMissions}
          </div>
          
          {missionId < totalMissions ? (
            <Link href={`/realm/3/mission/${missionId + 1}`}>
              <a className="inline-flex items-center px-4 py-2 bg-green-600/20 rounded-lg hover:bg-green-600/30 transition-colors">
                Next Mission
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Link>
          ) : (
            <Link href="/realm4">
              <a className="inline-flex items-center px-4 py-2 bg-orange-600/20 rounded-lg hover:bg-orange-600/30 transition-colors">
                Next Realm
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Link>
          )}
        </div>

        {/* Mission Content */}
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-green-400">{mission.title}</h1>
            <p className="text-xl text-green-300 mb-8">{mission.subtitle}</p>
          </div>

          {currentSection === 'intro' && (
            <div className="space-y-8">
              {renderContent()}
              
              <div className="text-center mt-8">
                <Button 
                  onClick={startSimulation}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                >
                  Begin Mission Challenge
                </Button>
              </div>
            </div>
          )}

          {currentSection === 'simulation' && (
            <div className="space-y-6">
              {renderSimulation()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}