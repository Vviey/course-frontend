import { useState, lazy, Suspense } from 'react';
import { Realm2MissionData } from '@/lib/realm2-missions';
import { Loader2, ChevronLeft, ChevronRight, Home, Award, Map, User } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { governanceTheme } from '@/lib/realm-themes';

// Import Realm 2 simulation components
import { FinancialSurveillanceSimulator } from '../simulations/FinancialSurveillanceSimulator';
import { PrivacyBalanceSimulator } from '../simulations/PrivacyBalanceSimulator';
import { CBDCSimulator } from '../simulations/CBDCSimulator';
import { BitcoinPrivacySimulator } from '../simulations/BitcoinPrivacySimulator';
import { LightningPrivacySimulator } from '../simulations/LightningPrivacySimulator';
import { SelfCustodySimulator } from '../simulations/SelfCustodySimulator';

// Lazy load additional components
const RolePlaySimulator = lazy(() => import('../simulations/RolePlaySimulator').then(module => ({ default: module.RolePlaySimulator })));
const PaymentPrivacySimulator = lazy(() => import('../simulations/PaymentPrivacySimulator').then(module => ({ default: module.PaymentPrivacySimulator })));

interface Realm2MissionsProps {
  mission: Realm2MissionData;
  onComplete?: () => void;
  missionId: number;
  realmId: number;
  totalMissions: number;
}

export function Realm2Missions({ mission, onComplete, missionId, realmId, totalMissions }: Realm2MissionsProps) {
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
    switch (mission.simulationType) {
      case 'surveillance':
        return (
          <FinancialSurveillanceSimulator 
            onComplete={handleSimulationComplete}
          />
        );
      case 'privacy':
        return (
          <PrivacyBalanceSimulator 
            onComplete={handleSimulationComplete}
          />
        );
      case 'cbdc':
        return (
          <CBDCSimulator 
            onComplete={handleSimulationComplete}
          />
        );
      case 'bitcoin':
        return (
          <BitcoinPrivacySimulator 
            onComplete={handleSimulationComplete}
          />
        );
      case 'lightning':
        return (
          <LightningPrivacySimulator 
            onComplete={handleSimulationComplete}
          />
        );
      case 'selfcustody':
        return (
          <SelfCustodySimulator 
            onComplete={handleSimulationComplete}
          />
        );
      default:
        return (
          <div className="text-center py-10">
            <p className="text-red-400">Simulation not found for this mission type.</p>
          </div>
        );
    }
  };

  const renderContent = () => {
    return (
      <div className="prose prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: mission.content }} />
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen text-white p-6"
      style={{
        background: `linear-gradient(to bottom, ${governanceTheme.colors.background}, ${governanceTheme.colors.backgroundLight})`,
        backgroundImage: "url('/realms/governance.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundBlendMode: "overlay"
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/realm2">
            <a className="inline-flex items-center hover:text-blue-300 transition-colors text-blue-400">
              <ChevronLeft className="mr-2 h-5 w-5" />
              <span>Back to Realm Missions</span>
            </a>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/profile">
              <a className="p-2 rounded-full bg-blue-600/20 hover:bg-blue-600/30 transition-colors">
                <User className="h-5 w-5 text-blue-400" />
              </a>
            </Link>
            <Link href="/badges">
              <a className="p-2 rounded-full bg-blue-600/20 hover:bg-blue-600/30 transition-colors">
                <Award className="h-5 w-5 text-blue-400" />
              </a>
            </Link>
            <Link href="/map">
              <a className="p-2 rounded-full bg-blue-600/20 hover:bg-blue-600/30 transition-colors">
                <Map className="h-5 w-5 text-blue-400" />
              </a>
            </Link>
          </div>
        </div>

        {/* Mission Navigation */}
        <div className="flex justify-between items-center mb-6">
          {missionId > 1 ? (
            <Link href={`/realm/2/mission/${missionId - 1}`}>
              <a className="inline-flex items-center px-4 py-2 bg-blue-600/20 rounded-lg hover:bg-blue-600/30 transition-colors">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Mission
              </a>
            </Link>
          ) : (
            <div></div>
          )}
          
          <div className="text-blue-400 text-sm font-medium">
            Mission {missionId} of {totalMissions}
          </div>
          
          {missionId < totalMissions ? (
            <Link href={`/realm/2/mission/${missionId + 1}`}>
              <a className="inline-flex items-center px-4 py-2 bg-blue-600/20 rounded-lg hover:bg-blue-600/30 transition-colors">
                Next Mission
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Link>
          ) : (
            <Link href="/realm3">
              <a className="inline-flex items-center px-4 py-2 bg-green-600/20 rounded-lg hover:bg-green-600/30 transition-colors">
                Next Realm
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Link>
          )}
        </div>

        {/* Mission Content */}
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-blue-400">{mission.title}</h1>
            <p className="text-xl text-blue-300 mb-8">{mission.subtitle}</p>
          </div>

          {currentSection === 'intro' && (
            <div className="space-y-8">
              {renderContent()}
              
              <div className="text-center mt-8">
                <Button 
                  onClick={startSimulation}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
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