import { useEffect, useState, lazy, Suspense } from 'react';
import { useLocation, useParams } from 'wouter';
import { ChevronRight } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { realm3Missions } from '@/lib/realm3-missions';
import { Mission } from '@/components/ui/mission';
import { Realm2MissionData } from '@/lib/realm2-missions';
import { getRealmName } from '@/lib/realm-utils';
import { cryptographyTheme } from '@/lib/realm-themes';

// Lazy load simulation components for Realm 3
const TrustlessSimulator = lazy(() => import('./trustless-simulator'));
const KeysSimulator = lazy(() => import('./keys-simulator'));
const TransactionSimulator = lazy(() => import('./transaction-simulator'));
const ScriptSimulator = lazy(() => import('./script-simulator'));
const WalletSimulator = lazy(() => import('./wallet-simulator'));
const MempoolSimulator = lazy(() => import('./mempool-simulator'));
const ConsensusSimulator = lazy(() => import('./consensus-simulator'));
const NodeSimulator = lazy(() => import('./node-simulator'));
const ForksSimulator = lazy(() => import('./forks-simulator'));
const ScalingSimulator = lazy(() => import('./scaling-simulator'));
const LightningSimulator = lazy(() => import('./lightning-simulator'));
const LightningBitcoinSimulator = lazy(() => import('./lightning-bitcoin-simulator'));

export default function Realm3Missions() {
  const [, setLocation] = useLocation();
  const { missionId } = useParams<{ missionId: string }>();
  const { user } = useAuth();
  const [missionComplete, setMissionComplete] = useState(false);
  const [contentRead, setContentRead] = useState(false);
  const [shareContent, setShareContent] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  // Parse mission ID from URL
  const missionNumber = parseInt(missionId || '1');
  const missionDataId = missionNumber;
  const missionData = realm3Missions.find(m => m.id === missionDataId);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      setLocation('/auth');
    }
  }, [user, setLocation]);

  // Generate social media sharing message
  const generateSharingMessage = () => {
    if (!missionData) return '';

    const messages = {
      trustless: `🔐 Exploring Bitcoin's trustless revolution in ${getRealmName(3)}. Learning how cryptographic proofs replace intermediaries. #BitcoinQuest #Trustless`,
      keys: `🔑 Mastering private keys and public addresses in ${getRealmName(3)}. Understanding the cryptographic foundation of Bitcoin ownership. #BitcoinQuest #Keys`,
      hashing: `⚡ Studying Bitcoin transactions and UTXO model in ${getRealmName(3)}. Learning how digital value transfers work. #BitcoinQuest #Transactions`,
      merkletree: `📜 Exploring Bitcoin Script in ${getRealmName(3)}. Understanding Bitcoin's simple yet powerful programming language. #BitcoinQuest #Script`,
      cryptography: `💼 Building Bitcoin wallets in ${getRealmName(3)}. Learning about key management and security best practices. #BitcoinQuest #Wallets`,
      mempool: `⏳ Navigating the Bitcoin mempool in ${getRealmName(3)}. Understanding transaction lifecycle and fee markets. #BitcoinQuest #Mempool`,
      consensus: `🤝 Achieving network consensus in ${getRealmName(3)}. Learning how Bitcoin nodes agree without central authority. #BitcoinQuest #Consensus`,
      node: `🖥️ Running Bitcoin nodes in ${getRealmName(3)}. Understanding the backbone of the decentralized network. #BitcoinQuest #Nodes`,
      forks: `🔀 Exploring Bitcoin forks in ${getRealmName(3)}. Learning about protocol upgrades and network splits. #BitcoinQuest #Forks`,
      scaling: `📈 Scaling Bitcoin in ${getRealmName(3)}. Understanding layer 2 solutions and block size debates. #BitcoinQuest #Scaling`,
      lightning: `⚡ Experiencing the Lightning Network in ${getRealmName(3)}. Instant, low-cost Bitcoin payments! #BitcoinQuest #Lightning`,
      'lightning-bitcoin': `🌐 Comparing Bitcoin and Lightning in ${getRealmName(3)}. Understanding the two-layer system. #BitcoinQuest #BitcoinLightning`,
      script: `📜 Exploring Bitcoin Script in ${getRealmName(3)}. Understanding Bitcoin's simple yet powerful programming language. #BitcoinQuest #Script`,
    };

    return messages[missionData.simulationType] || `🌲 Exploring ${getRealmName(3)} in my Bitcoin education journey! #BitcoinQuest`;
  };

  const handleMissionComplete = () => {
    setMissionComplete(true);
    setTimeout(() => setLocation('/realm/3'), 2000);
  };

  const handleChallengeComplete = () => {
    setShareContent(generateSharingMessage());
    setShowShareModal(true);
  };

  const handleStartChallenge = () => {
    setContentRead(true);
  };

  const renderSimulation = () => {
    if (!missionData) return null;

    return (
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: cryptographyTheme.colors.accent2 }} />
        </div>
      }>
        {(() => {
          switch(missionData.simulationType) {
            case 'trustless':
              return <TrustlessSimulator onComplete={handleChallengeComplete} />;
            case 'keys':
              return <KeysSimulator onComplete={handleChallengeComplete} />;
            case 'hashing':
              return <TransactionSimulator onComplete={handleChallengeComplete} />;
            case 'merkletree':
              return <ScriptSimulator onComplete={handleChallengeComplete} />;
            case 'cryptography':
              return <WalletSimulator onComplete={handleChallengeComplete} />;
            case 'mempool':
              return <MempoolSimulator onComplete={handleChallengeComplete} />;
            case 'consensus':
              return <ConsensusSimulator onComplete={handleChallengeComplete} />;
            case 'node':
              return <NodeSimulator onComplete={handleChallengeComplete} />;
            case 'forks':
              return <ForksSimulator onComplete={handleChallengeComplete} />;
            case 'scaling':
              return <ScalingSimulator onComplete={handleChallengeComplete} />;
            case 'lightning':
              return <LightningSimulator onComplete={handleChallengeComplete} />;
            case 'lightning-bitcoin':
              return <LightningBitcoinSimulator onComplete={handleChallengeComplete} />;
            default:
              return (
                <div className="text-center py-10" style={{ color: cryptographyTheme.colors.textLight }}>
                  <p>Challenge not found for this mission type.</p>
                </div>
              );
          }
        })()}
      </Suspense>
    );
  };

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{
        background: cryptographyTheme.gradients?.radial ?? 'transparent',
        backgroundImage: `${cryptographyTheme.patterns?.adinkra ?? ''}, url('/realms/forest-sparks.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundBlendMode: "overlay",
        color: cryptographyTheme.colors.textLight
      }}
    >
      {/* Mission navigation header */}
      <header className="max-w-4xl mx-auto mb-6">
        <button 
          onClick={() => setLocation('/realm/3')} 
          className="flex items-center transition-colors font-medium hover:text-green-300"
          style={{ color: cryptographyTheme.colors.secondary }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to {getRealmName(3)}
        </button>
      </header>

      {missionComplete && (
        <div className="fixed top-0 left-0 right-0 text-white p-3 text-center z-50"
          style={{ backgroundColor: cryptographyTheme.colors.primary }}
        >
          Mission complete! Great job! Redirecting...
        </div>
      )}

      {!missionData && (
        <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg"
          style={{ 
            backgroundColor: cryptographyTheme.colors.backgroundLight,
            border: `1px solid ${cryptographyTheme.colors.accent1}`
          }}
        >
          <h2 className="text-2xl font-bold mb-2" style={{ color: cryptographyTheme.colors.accent2 }}>
            Mission Not Found
          </h2>
          <p className="mb-4" style={{ color: cryptographyTheme.colors.textLight }}>
            This mission doesn't exist yet or may have been moved.
          </p>
          <button 
            onClick={() => setLocation('/realm/3')} 
            className="px-4 py-2 font-medium rounded transition-colors"
            style={{ 
              backgroundColor: cryptographyTheme.colors.accent1,
              color: cryptographyTheme.colors.textDark
            }}
          >
            Return to {getRealmName(3)}
          </button>
        </div>
      )}

      {missionData && (
        <main className="max-w-4xl mx-auto">
          {!contentRead ? (
            <div className="p-8 rounded-xl shadow-xl backdrop-blur-sm"
              style={{ 
                backgroundColor: 'rgba(13, 61, 41, 0.7)',
                border: `1px solid ${cryptographyTheme.colors.accent1}`,
                boxShadow: cryptographyTheme.shadows?.card ?? 'none'
              }}
            >
              <Mission 
                mission={{
                  id: missionData.id,
                  title: missionData.title,
                  subtitle: missionData.subtitle,
                  description: "Explore Bitcoin's technical foundations",
                  objectives: [
                    "Understand Bitcoin's core concepts",
                    "Learn technical implementation details",
                    "Complete the interactive challenge"
                  ],
                  simulationType: missionData.simulationType,
                  content: typeof missionData.content === 'string' ? 
                    missionData.content : 
                    "Learn about Bitcoin's technical architecture."
                } as unknown as Realm2MissionData}
                onComplete={handleMissionComplete}
                realmTheme="green"
              />

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleStartChallenge}
                  className="px-6 py-3 font-semibold rounded-lg transition-all shadow-lg flex items-center group hover:shadow-green-400/30"
                  style={{ 
                    background: cryptographyTheme.gradients?.glow ?? 'transparent',
                    color: cryptographyTheme.colors.textDark,
                    boxShadow: cryptographyTheme.shadows?.button ?? 'none'
                  }}
                >
                  Start Technical Challenge
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-xl shadow-xl backdrop-blur-sm"
              style={{ 
                backgroundColor: 'rgba(13, 61, 41, 0.7)',
                border: `1px solid ${cryptographyTheme.colors.accent1}`,
                boxShadow: cryptographyTheme.shadows?.card ?? 'none'
              }}
            >
              {renderSimulation()}
            </div>
          )}
        </main>
      )}
    </div>
  );
}