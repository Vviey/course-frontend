import { useEffect, useState, lazy, Suspense } from 'react';
import { useLocation, useParams, Link } from 'wouter';
import { ChevronRight, ChevronLeft, User, Award, Map as MapIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { realm2Missions } from '@/lib/realm2-missions';
import { citadelTheme } from '@/lib/realm-themes';

// Lazy load simulation components
const SurveillanceSimulator = lazy(() => import('./surveillance-simulator'));
const PrivacyBalanceSimulator = lazy(() => import('./privacy-balance-simulator'));
const CBDCSimulator = lazy(() => import('./cbdc-simulator'));
const LightningNetworkSimulator = lazy(() => import('./lightning-network-simulator'));
const SelfCustodySimulator = lazy(() => import('./self-custody-simulator'));

export default function Realm2Missions() {
  const [, setLocation] = useLocation();
  const { missionId } = useParams<{ missionId: string }>();
  const { user, loading } = useAuth();
  const [contentRead, setContentRead] = useState(false);

  // Mission data handling
  const missionNumber = parseInt(missionId || '1', 10);
  const missionDataId = 100 + missionNumber;
  const missionData = realm2Missions.find(m => m.id === missionDataId);

  // Theme colors with fallbacks
  const bgColor = citadelTheme?.colors?.background || "#00243F";

  useEffect(() => {
    if (!loading && !user) {
      setLocation('/auth');
    }
  }, [user, loading, setLocation]);

  if (loading || !missionData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: bgColor }}>
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: bgColor }}>
      <div className="max-w-6xl mx-auto">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/realm3">
            <a className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors">
              <ChevronLeft className="mr-2 h-5 w-5" />
              <span>Central Citadel</span>
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
                <MapIcon className="h-5 w-5 text-orange-400" />
              </a>
            </Link>
          </div>
        </div>

        {/* Mission Navigation */}
        <div className="flex justify-between items-center mb-8">
          {missionNumber > 101 ? (
            <Link href={`/realm2/mission/${missionNumber - 100}`}>
              <a className="inline-flex items-center px-4 py-2 bg-orange-600/20 rounded-lg hover:bg-orange-600/30 transition-colors">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Mission
              </a>
            </Link>
          ) : null}

          <div className="text-orange-400 text-sm font-medium">
            Mission {missionNumber} of {realm2Missions.length}
          </div>

          {missionNumber < realm2Missions.length ? (
            <Link href={`/realm2/mission/${missionNumber + 100}`}>
              <a className="inline-flex items-center px-4 py-2 bg-orange-600/20 rounded-lg hover:bg-orange-600/30 transition-colors">
                Next Mission
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Link>
          ) : (
            <Link href="/realm3">
              <a className="inline-flex items-center px-4 py-2 bg-purple-600/20 rounded-lg hover:bg-purple-600/30 transition-colors">
                Next Realm
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Link>
          )}
        </div>

        <main className="w-full">
          <h1 className="text-3xl font-bold mb-4">{missionData.title}</h1>
          <h2 className="text-2xl font-semibold mb-4">{missionData.subtitle}</h2>
          <div dangerouslySetInnerHTML={{ __html: missionData.content }} />
          <div className="mt-4">
            {renderSimulation(missionData.simulationType)}
          </div>
        </main>
      </div>
    </div>
  );
}

const renderSimulation = (simulationType: 'surveillance' | 'privacy' | 'cbdc' | 'bitcoin' | 'lightning' | 'selfcustody') => {
  const components: { [key in typeof simulationType]: JSX.Element } = {
    surveillance: <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-purple-500" />}><SurveillanceSimulator onComplete={function (): void {
      throw new Error('Function not implemented.');
    } } /></Suspense>,
    privacy: <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-purple-500" />}><PrivacyBalanceSimulator onComplete={function (): void {
      throw new Error('Function not implemented.');
    } } /></Suspense>,
    cbdc: <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-purple-500" />}><CBDCSimulator onComplete={function (): void {
      throw new Error('Function not implemented.');
    } } /></Suspense>,
    lightning: <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-purple-500" />}><LightningNetworkSimulator onComplete={function (): void {
      throw new Error('Function not implemented.');
    } } /></Suspense>,
    selfcustody: <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-purple-500" />}><SelfCustodySimulator onComplete={function (): void {
      throw new Error('Function not implemented.');
    } } /></Suspense>,
    bitcoin: <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-purple-500" />}><SelfCustodySimulator onComplete={function (): void {
      throw new Error('Function not implemented.');
    } } /></Suspense>,
  };

  return components[simulationType] || null;
};