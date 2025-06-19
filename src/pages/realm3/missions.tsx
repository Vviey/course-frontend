import { useEffect, useState, lazy, Suspense } from 'react';
import { useLocation, useParams } from 'wouter';
import { ChevronRight } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { realm3Missions } from '@/lib/realm3-missions';
import { Mission } from '@/components/ui/mission';
import { Realm2MissionData } from '@/lib/realm2-missions';
import { getRealmName } from '@/lib/realm-utils';

// Lazy load simulation components to improve performance
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

  // Current mission data
  const missionData = realm3Missions.find(m => m.id === missionDataId);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      setLocation('/auth');
    }
  }, [user, setLocation]);

  // Define theme for Realm 3 - Cryptography
  const cryptographyTheme = {
    colors: {
      primary: "#1A8F60",
      secondary: "#46D1A2",
      background: "#0D3D29",
      backgroundLight: "#134935",
      cardBackground: "#F0FFF9",
      textDark: "#0D3D29",
      textLight: "#F0FFF9",
      accent1: "#46D1A2",
      accent2: "#16FFBD",
      lightText: "#000000",
      gradientStart: "#0D3D29",
      gradientEnd: "#165E40",
      success: "#15803d",
    },
    patterns: {
      adinkra: `repeating-linear-gradient(
        45deg,
        rgba(26, 143, 96, 0.1),
        rgba(26, 143, 96, 0.1) 10px,
        rgba(26, 143, 96, 0.2) 10px,
        rgba(26, 143, 96, 0.2) 20px
      )`,
      code: `url('/textures/code-pattern.svg')`
    },
    gradients: {
      main: "linear-gradient(to right, #1A8F60, #46D1A2)",
      glow: "linear-gradient(to right, #1A8F60, #46D1A2)",
      blue: "linear-gradient(to bottom, #46D1A2, #16FFBD)",
      radial: "radial-gradient(circle, rgba(13, 61, 41, 0.0) 0%, rgba(13, 61, 41, 0.8) 80%)",
      aurora: "linear-gradient(to bottom right, rgba(6, 214, 160, 0.7), rgba(17, 138, 178, 0.5))",
    },
    shadows: {
      card: "0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)",
      button: "0 2px 4px rgba(26, 143, 96, 0.3)",
      glow: "0 0 20px rgba(6, 214, 160, 0.7)"
    },
    animations: {
      glow: "pulse 2s infinite",
    },
  };

  // Generate social media sharing message based on mission
  const generateSharingMessage = () => {
    if (!missionData) return '';

    const messages: Record<string, string> = {
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

    return messages[missionData.simulationType] || `🚀 Completing mission "${missionData.title}" in ${getRealmName(3)}. Learning more about Bitcoin every day! #BitcoinQuest`;
  };

  // Handle mission completion
  const handleMissionComplete = () => {
    setMissionComplete(true);
    setTimeout(() => {
      setLocation('/realm/3');
    }, 2000);
  };

  const handleChallengeComplete = () => {
    setShareContent(generateSharingMessage());
    setShowShareModal(true);
  };

  // Render appropriate simulation based on mission type
  const renderSimulation = () => {
    if (!missionData) return null;

    return (
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: cryptographyTheme.colors.primary }} />
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
              return <div className="text-center py-10" style={{ color: cryptographyTheme.colors.secondary }}>
                <p>Challenge not found for this mission type.</p>
              </div>;
          }
        })()}
      </Suspense>
    );
  };

  if (!missionData) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: cryptographyTheme.gradients.radial,
          backgroundImage: cryptographyTheme.patterns.code,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundBlendMode: "overlay"
        }}
      >
        <div className="animate-pulse backdrop-blur-md bg-black/60 rounded-xl p-8 flex flex-col items-center">
          <div className="h-32 w-32 rounded-full mb-4" style={{ backgroundColor: cryptographyTheme.colors.primary }}></div>
          <div className="h-6 w-48 rounded-full" style={{ backgroundColor: cryptographyTheme.colors.primary }}></div>
        </div>
      </div>
    );
  }

  function handleStartChallenge(event: React.MouseEvent<HTMLButtonElement>): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{
        background: cryptographyTheme.gradients.radial,
        backgroundImage: cryptographyTheme.patterns.code,
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
          Back to Missions
        </button>
      </header>

      {/* Mission completion message */}
      {missionComplete && (
        <div className="fixed top-0 left-0 right-0 text-white p-3 text-center z-50"
          style={{ backgroundColor: cryptographyTheme.colors.success }}
        >
          Mission complete! Great job! Redirecting to Realm...
        </div>
      )}

      {/* Mission content */}
      {missionData && <main className="max-w-4xl mx-auto">
        {!contentRead ? (
          <div className="backdrop-blur-md bg-black/60 p-8 rounded-xl border shadow-xl"
            style={{ 
              borderColor: `${cryptographyTheme.colors.primary}40`,
              boxShadow: cryptographyTheme.shadows.card
            }}
          >
            <Mission 
              mission={{
                id: missionData.id,
                title: missionData.title,
                subtitle: missionData.subtitle || "Default subtitle",
                description: missionData.description || "Explore cryptography concepts in Bitcoin.",
                objectives: missionData.objectives || ["Complete the interactive simulation"],
                simulationType: missionData.simulationType,
                content: typeof missionData.content === 'string' ? missionData.content : "Learn about cryptographic concepts in Bitcoin."
              }}
              onComplete={handleMissionComplete}
              realmTheme="green"
            />

            {/* Challenge button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleStartChallenge}
                className="px-6 py-3 text-white font-semibold rounded-lg transition-colors shadow-lg flex items-center group hover:shadow-glow"
                style={{ 
                  background: cryptographyTheme.gradients.main,
                  boxShadow: cryptographyTheme.shadows.button
                }}
              >
                Start Challenge
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ) : (
          <div className="backdrop-blur-md bg-black/60 p-8 rounded-xl border shadow-xl"
            style={{ 
              borderColor: `${cryptographyTheme.colors.primary}40`,
              boxShadow: cryptographyTheme.shadows.card
            }}
          >
            {renderSimulation()}
          </div>
        )}
      </main>}
    </div>
  );
}