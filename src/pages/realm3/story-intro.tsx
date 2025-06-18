import React, { useState, useRef, useEffect } from 'react';

// Type definitions
type ActType = 'open-access' | 'global-reach' | 'transparent-rules' | 'user-sovereignty';
type AshaState = 'neutral' | 'happy' | 'amazed' | 'confident' | 'radiant';
type OduState = 'hidden' | 'observing' | 'bowing' | 'departed';
type TransactionStatus = 'pending' | 'confirmed' | 'visible-forever';

interface BitcoinWallet {
  sats: number;
  privateKey: string;
  publicKey: string;
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  status: TransactionStatus;
  blockHeight?: number;
}

interface ActProgress {
  'open-access': { walletCreated: boolean; firstPayment: boolean; completed: boolean };
  'global-reach': { crossBorderSent: boolean; completed: boolean };
  'transparent-rules': { explorerViewed: boolean; rulesUnderstood: boolean; completed: boolean };
  'user-sovereignty': { keysSigned: boolean; nodeRunning: boolean; completed: boolean };
}

interface TooltipData {
  message: string;
  x: number;
  y: number;
}

// Act configurations
const ACTS: Record<ActType, {
  id: number;
  title: string;
  description: string;
  mood: string;
  icon: string;
}> = {
  'open-access': {
    id: 1,
    title: "The Gate With No Lock",
    description: "Asha discovers she can create a wallet without permission",
    mood: "mysterious",
    icon: "🔓"
  },
  'global-reach': {
    id: 2,
    title: "The Message Across Borders",
    description: "Asha sends value instantly across borders",
    mood: "liberating",
    icon: "🌍"
  },
  'transparent-rules': {
    id: 3,
    title: "The Ledger of Light",
    description: "Asha views the immutable transaction history",
    mood: "enlightening",
    icon: "📜"
  },
  'user-sovereignty': {
    id: 4,
    title: "The Key and the Flame",
    description: "Asha takes full control of her money",
    mood: "empowering",
    icon: "🗝️"
  }
};

const SparkBeneathStoneSimulation = () => {
  // Game state
  const [currentAct, setCurrentAct] = useState<ActType>('open-access');
  const [wallet, setWallet] = useState<BitcoinWallet>({
    sats: 0,
    privateKey: 'asha-private-key-demo',
    publicKey: 'asha-public-key-demo'
  });
  
  const [ashaState, setAshaState] = useState<AshaState>('neutral');
  const [oduState, setOduState] = useState<OduState>('hidden');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [blockHeight, setBlockHeight] = useState(850000);
  const [nodeActive, setNodeActive] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [actProgress, setActProgress] = useState<ActProgress>({
    'open-access': { walletCreated: false, firstPayment: false, completed: false },
    'global-reach': { crossBorderSent: false, completed: false },
    'transparent-rules': { explorerViewed: false, rulesUnderstood: false, completed: false },
    'user-sovereignty': { keysSigned: false, nodeRunning: false, completed: false }
  });
  
  const [showTooltip, setShowTooltip] = useState<TooltipData | null>(null);
  const [showPopup, setShowPopup] = useState<{ message: string; type: string; speaker?: string } | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [blockExplorerOpen, setBlockExplorerOpen] = useState(false);
  const [ashaMessage, setAshaMessage] = useState('');
  const [oduMessage, setOduMessage] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const actRefs = {
    'open-access': useRef<HTMLDivElement>(null),
    'global-reach': useRef<HTMLDivElement>(null),
    'transparent-rules': useRef<HTMLDivElement>(null),
    'user-sovereignty': useRef<HTMLDivElement>(null)
  };

  // Scroll to act when progressing
  useEffect(() => {
    if (actRefs[currentAct].current) {
      actRefs[currentAct].current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentAct]);

  // Character animations
  const triggerAshaEmotion = (emotion: AshaState, duration = 3000) => {
    setAshaState(emotion);
    setTimeout(() => {
      if (emotion === 'radiant') return; // Stay radiant once achieved
      setAshaState('neutral');
    }, duration);
  };

  const showCharacterDialog = (message: string, speaker: 'asha' | 'odu', type = 'insight', duration = 4000) => {
    setShowPopup({ message, type, speaker });
    if (speaker === 'asha') {
      setAshaMessage(message);
    } else {
      setOduMessage(message);
      setOduState('observing');
    }
    setTimeout(() => {
      setShowPopup(null);
      if (speaker === 'asha') {
        setAshaMessage('');
      } else {
        setOduMessage('');
        if (oduState !== 'bowing') setOduState('hidden');
      }
    }, duration);
  };

  // Act 1: Open Access - No permission needed
  const createWallet = () => {
    if (actProgress['open-access'].walletCreated) return;
    
    setWallet(prev => ({ ...prev, sats: 2100 }));
    setActProgress(prev => ({
      ...prev,
      'open-access': { ...prev['open-access'], walletCreated: true }
    }));
    
    triggerAshaEmotion('amazed');
    showCharacterDialog("I just... created money? No forms, no bank, no permission needed!", 'asha', 'amazed');
    
    setTimeout(() => {
      if (!actProgress['open-access'].firstPayment) {
        showCharacterDialog("🧓🏾 Odu: 'Yes, child. Bitcoin needs no gatekeepers. Try sending some sats now.'", 'odu', 'instruction');
      }
    }, 5000);
  };

  const makeFirstPayment = () => {
    if (wallet.sats < 100) return;
    
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      from: 'asha-wallet',
      to: 'village-keeper',
      amount: 100,
      timestamp: Date.now(),
      status: 'confirmed'
    };
    
    setWallet(prev => ({ ...prev, sats: prev.sats - 100 }));
    setTransactions(prev => [...prev, tx]);
    setActProgress(prev => ({
      ...prev,
      'open-access': { ...prev['open-access'], firstPayment: true, completed: true }
    }));
    
    triggerAshaEmotion('happy');
    showCharacterDialog("The payment went through instantly! No bank stood between us!", 'asha', 'success');
    
    setTimeout(() => setCurrentAct('global-reach'), 3000);
  };

  // Act 2: Global Reach - Borderless payments
  const sendCrossBorder = () => {
    if (wallet.sats < 300) return;
    
    const tx: Transaction = {
      id: `cross-border-${Date.now()}`,
      from: 'asha-wallet',
      to: 'distant-family',
      amount: 300,
      timestamp: Date.now(),
      status: 'pending'
    };
    
    setWallet(prev => ({ ...prev, sats: prev.sats - 300 }));
    setTransactions(prev => [...prev, tx]);
    
    setTimeout(() => {
      setTransactions(prev => prev.map(t => 
        t.id === tx.id ? { ...t, status: 'confirmed' as TransactionStatus } : t
      ));
      
      setActProgress(prev => ({
        ...prev,
        'global-reach': { crossBorderSent: true, completed: true }
      }));
      
      triggerAshaEmotion('amazed');
      showCharacterDialog("It reached across continents in seconds! No borders can stop this magic!", 'asha', 'amazed');
      
      setTimeout(() => {
        showCharacterDialog("🧓🏾 Odu: 'Money that flows like water, child. No walls can contain it.'", 'odu', 'insight');
        setTimeout(() => setCurrentAct('transparent-rules'), 3000);
      }, 3000);
    }, 2000);
  };

  // Act 3: Transparent Rules - Public ledger
  const openBlockExplorer = () => {
    setBlockExplorerOpen(true);
    setActProgress(prev => ({
      ...prev,
      'transparent-rules': { ...prev['transparent-rules'], explorerViewed: true }
    }));
    
    setTransactions(prev => prev.map(tx => ({
      ...tx,
      status: 'visible-forever' as TransactionStatus,
      blockHeight: blockHeight + Math.floor(Math.random() * 3)
    })));
    
    showCharacterDialog("I can see everything! Every transaction, every rule, forever!", 'asha', 'insight');
  };

  const understandRules = () => {
    setActProgress(prev => ({
      ...prev,
      'transparent-rules': { 
        ...prev['transparent-rules'], 
        rulesUnderstood: true, 
        completed: true 
      }
    }));
    
    triggerAshaEmotion('confident');
    showCharacterDialog("No one can change the rules in secret. The truth is written in light!", 'asha', 'confident');
    setTimeout(() => {
      showCharacterDialog("🧓🏾 Odu: 'Now you see, child. Truth that cannot be hidden. Are you ready for the final lesson?'", 'odu', 'instruction');
      setTimeout(() => setCurrentAct('user-sovereignty'), 3000);
    }, 3000);
  };

  // Act 4: User Sovereignty - Keys and nodes
  const chooseKey = () => {
    setSelectedChoice('key');
    setNodeActive(true);
    
    setActProgress(prev => ({
      ...prev,
      'user-sovereignty': { 
        ...prev['user-sovereignty'], 
        keysSigned: true, 
        nodeRunning: true,
        completed: true 
      }
    }));
    
    triggerAshaEmotion('radiant');
    setOduState('bowing');
    showCharacterDialog("This is MY money! My key, my rules, my sovereignty! No one can take this from me!", 'asha', 'sovereignty');
    
    setTimeout(() => {
      showCharacterDialog("🧓🏾 Odu: 'You have found the spark, child. You are now your own bank. I bow to your sovereignty.'", 'odu', 'sovereignty');
      setTimeout(() => {
        setGameComplete(true);
      }, 4000);
    }, 4000);
  };

  const handleTooltipShow = (message: string, event: React.MouseEvent<HTMLElement>) => {
    setShowTooltip({ message, x: event.clientX, y: event.clientY });
  };

  const handleTooltipHide = () => {
    setShowTooltip(null);
  };

  // Render progress indicator
  const renderProgressIndicator = () => {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex gap-2 bg-black bg-opacity-80 rounded-full p-2 border border-green-500 shadow-lg">
          {Object.entries(ACTS).map(([actKey, act]) => (
            <button
              key={actKey}
              onClick={() => {
                setCurrentAct(actKey as ActType);
                actRefs[actKey as ActType].current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center'
                });
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                actProgress[actKey as ActType].completed ? 'bg-green-600 text-white' :
                actKey === currentAct ? 'bg-yellow-500 text-black' :
                'bg-gray-700 text-gray-400'
              }`}
              title={act.title}
            >
              {act.icon}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-green-900 to-green-950">
        <div className="bg-green-800 text-white rounded-3xl shadow-2xl p-8 max-w-5xl w-full animate-fadeIn border border-green-500">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-4">
              <img 
                src="https://bitcoiners.africa/wp-content/uploads/2025/06/asha2.png" 
                alt="Asha"
                className="w-24 h-32 object-contain"
              />
              <div className="text-6xl">🧓🏾</div>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-green-300">Asha's Bitcoin Awakening</h2>
            <div className="text-6xl mb-4">🌿🗝️⚡</div>
            <p className="text-gray-300">"I understand now, Odu. Bitcoin is the spark that ignites true freedom."</p>
          </div>
          
          <div className="overflow-x-auto mb-8">
            <table className="w-full bg-green-900 rounded-lg">
              <thead>
                <tr className="bg-green-800">
                  <th className="p-4 text-left font-semibold text-green-300">What Asha Learned</th>
                  <th className="p-4 text-center font-semibold text-red-400">Old Money Ways</th>
                  <th className="p-4 text-center font-semibold text-green-300">Bitcoin Way</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-green-800">
                  <td className="p-4 font-medium">Permission to create wallet</td>
                  <td className="p-4 text-center text-red-400">✅ Needed</td>
                  <td className="p-4 text-center text-green-400">❌ Free access</td>
                </tr>
                <tr className="border-b border-green-800">
                  <td className="p-4 font-medium">Can be censored</td>
                  <td className="p-4 text-center text-red-400">✅ Often</td>
                  <td className="p-4 text-center text-green-400">❌ Unstoppable</td>
                </tr>
                <tr className="border-b border-green-800">
                  <td className="p-4 font-medium">Cross-border restrictions</td>
                  <td className="p-4 text-center text-red-400">✅ Many</td>
                  <td className="p-4 text-center text-green-400">❌ Borderless</td>
                </tr>
                <tr className="border-b border-green-800">
                  <td className="p-4 font-medium">You control your keys</td>
                  <td className="p-4 text-center text-red-400">❌ Bank holds</td>
                  <td className="p-4 text-center text-green-400">✅ Your keys</td>
                </tr>
                <tr className="border-b border-green-800">
                  <td className="p-4 font-medium">Transparent rules</td>
                  <td className="p-4 text-center text-red-400">❌ Hidden</td>
                  <td className="p-4 text-center text-green-400">✅ Public ledger</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Financial sovereignty</td>
                  <td className="p-4 text-center text-red-400">❌ Depends on others</td>
                  <td className="p-4 text-center text-green-400">✅ True ownership</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="text-center space-y-4">
            <div className="text-lg text-green-300 font-medium italic">
              "Asha, you have touched the spark. Now you understand why Bitcoin changes everything." - Odu
            </div>
            <button
              onClick={() => window.location.href = '/realm3'}
              className="bg-gradient-to-r from-green-600 to-teal-500 text-white font-bold py-4 px-8 rounded-xl hover:from-green-700 hover:to-teal-600 transition-all transform hover:scale-105 shadow-lg shadow-green-500/25"
            >
              🌿 Continue Asha's Journey - Learn How Bitcoin Actually Works
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative h-screen w-full overflow-y-auto scroll-smooth bg-gradient-to-b from-green-900 to-green-950"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(26, 143, 96, 0.2) 0%, transparent 20%),
          radial-gradient(circle at 80% 70%, rgba(6, 214, 160, 0.2) 0%, transparent 20%)
        `
      }}
    >
      {/* Styling and animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        
        .bitcoin-glow {
          box-shadow: 0 0 20px rgba(6, 214, 160, 0.5);
        }
        
        .node-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        .transaction-flow {
          animation: transaction-flow 3s ease-in-out;
        }
        
        @keyframes transaction-flow {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        
        .act-section {
          scroll-margin-top: 100px;
        }

        .asha-${ashaState} {
          animation: ${ashaState === 'amazed' ? 'bounce 0.5s ease-in-out' :
                      ashaState === 'happy' ? 'pulse 1s ease-in-out' :
                      ashaState === 'confident' ? 'glow 2s ease-in-out' :
                      ashaState === 'radiant' ? 'radiate 3s ease-in-out infinite' : 'none'};
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }

        @keyframes radiate {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 5px rgba(6, 214, 160, 0.5)); }
          50% { filter: brightness(1.2) drop-shadow(0 0 15px rgba(6, 214, 160, 0.8)); }
        }
      `}</style>

      {/* Progress indicator */}
      {renderProgressIndicator()}

      {/* Characters */}
      {/* Asha character */}
      <div className={`fixed bottom-8 right-8 z-40 asha-${ashaState} transition-all duration-500`}>
        <img 
          src="https://bitcoiners.africa/wp-content/uploads/2025/06/asha2.png" 
          alt="Asha"
          className="w-24 h-32 lg:w-32 lg:h-40 object-contain"
        />
        {ashaMessage && (
          <div className="absolute bottom-full right-0 mb-2 bg-green-800 text-green-100 p-2 rounded-lg max-w-xs text-sm border border-green-500">
            {ashaMessage}
          </div>
        )}
      </div>

      {/* Odu character */}
      {oduState !== 'hidden' && (
        <div className={`fixed bottom-8 left-8 z-40 transition-all duration-500 ${
          oduState === 'bowing' ? 'transform rotate-12' : ''
        }`}>
          <div className="text-6xl lg:text-7xl">🧓🏾</div>
          {oduMessage && (
            <div className="absolute bottom-full left-0 mb-2 bg-purple-800 text-purple-100 p-2 rounded-lg max-w-xs text-sm border border-purple-500">
              {oduMessage}
            </div>
          )}
        </div>
      )}

      {/* Bitcoin wallet floating panel */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-green-900 bg-opacity-90 rounded-lg p-4 min-w-[200px] border border-green-500 shadow-lg">
          <h3 className="font-semibold mb-2 text-green-300">⚡ Asha's Bitcoin Wallet</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">🌿 Sats:</span>
              <span className="text-green-300 font-mono">{wallet.sats.toLocaleString()}</span>
            </div>
            {currentAct === 'user-sovereignty' && (
              <div className="mt-3 pt-3 border-t border-green-700">
                <div className="text-xs text-gray-400">Private Key:</div>
                <div className="text-xs text-green-300 font-mono truncate">
                  {wallet.privateKey}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Character dialog popup */}
      {showPopup && (
        <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 max-w-md">
          <div className={`p-6 rounded-lg shadow-2xl animate-fadeIn border-2 ${
            showPopup.speaker === 'asha' ? 'bg-green-900 border-green-500 text-green-100' :
            showPopup.speaker === 'odu' ? 'bg-purple-900 border-purple-500 text-purple-100' :
            showPopup.type === 'insight' ? 'bg-green-900 border-green-500 text-green-100' :
            showPopup.type === 'success' ? 'bg-teal-900 border-teal-500 text-teal-100' :
            showPopup.type === 'sovereignty' ? 'bg-yellow-900 border-yellow-500 text-yellow-100' :
            'bg-blue-900 border-blue-500 text-blue-100'
          }`}>
            <div className="text-center">
              <div className="text-2xl mb-2">
                {showPopup.speaker === 'asha' ? '👧🏽' : 
                 showPopup.speaker === 'odu' ? '🧓🏾' : '🌿'}
              </div>
              <p className="font-medium">{showPopup.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div 
          className="fixed z-50 bg-black bg-opacity-90 text-green-400 px-3 py-2 rounded-lg text-sm pointer-events-none transform -translate-x-1/2 whitespace-nowrap border border-green-400"
          style={{ 
            left: showTooltip.x, 
            top: showTooltip.y - 40 
          }}
        >
          🌿 {showTooltip.message}
        </div>
      )}

      {/* Block explorer modal */}
      {blockExplorerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-green-900 rounded-lg p-6 max-w-2xl w-full mx-4 border border-teal-400">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-teal-400">🔍 The Ledger of Light - Asha's Discovery</h2>
              <button
                onClick={() => {
                  setBlockExplorerOpen(false);
                  understandRules();
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-gray-400">Block Height: {blockHeight}</div>
              {transactions.map(tx => (
                <div key={tx.id} className="bg-green-800 rounded p-3 border border-green-700">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">TX: {tx.id}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      tx.status === 'visible-forever' ? 'bg-teal-800 text-teal-300' :
                      'bg-yellow-800 text-yellow-300'
                    }`}>
                      {tx.status === 'visible-forever' ? 'Forever Visible' : 'Confirming'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {tx.from} → {tx.to}: {tx.amount} sats
                  </div>
                  {tx.blockHeight && (
                    <div className="text-xs text-teal-400">Block #{tx.blockHeight}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Act sections */}
      <div className="space-y-0">
        {/* Act 1: Open Access */}
        <section 
          ref={actRefs['open-access']}
          className="min-h-screen flex items-center justify-center p-4 act-section"
          id="act-1"
        >
          <div className="max-w-3xl w-full bg-green-900 bg-opacity-70 rounded-3xl p-8 border border-green-500 shadow-xl">
            <div className="text-center space-y-8">
              <div className="text-6xl animate-pulse">🔓</div>
              <h2 className="text-3xl font-bold text-green-300">{ACTS['open-access'].title}</h2>
              <p className="text-xl text-gray-300 mb-6">
                "Asha approaches the mystical gate. Odu whispers: 'Enter if you wish. No ID. No approval needed.'"
              </p>
              
              {!actProgress['open-access'].walletCreated ? (
                <div className="space-y-4">
                  <div className="italic text-green-200">
                    "I've never seen a gate without guards..." - Asha
                  </div>
                  <button
                    onClick={createWallet}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 bitcoin-glow"
                  >
                    🌿 Asha Creates Her Bitcoin Wallet
                  </button>
                </div>
              ) : !actProgress['open-access'].firstPayment ? (
                <div className="space-y-6">
                  <div className="text-green-300">
                    "Magic! I have 2,100 sats and no one asked my name!" - Asha
                  </div>
                  <button
                    onClick={makeFirstPayment}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105"
                  >
                    💸 Asha Sends 100 sats to Village Keeper
                  </button>
                </div>
              ) : (
                <div className="text-teal-400 text-lg">
                  ✅ "It worked! No bank stood between us!" - Asha
                </div>
              )}
              
              <div className="mt-8 text-left bg-green-800 bg-opacity-50 p-4 rounded-lg border border-green-600">
                <h3 className="text-green-300 font-semibold mb-2">Asha's Learning:</h3>
                <p className="text-gray-300">
                  Bitcoin wallets require no identification or permission to create. 
                  Unlike traditional banking, Asha can send value directly to anyone 
                  without intermediaries or gatekeepers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Act 2: Global Reach */}
        <section 
          ref={actRefs['global-reach']}
          className="min-h-screen flex items-center justify-center p-4 act-section"
          id="act-2"
        >
          <div className="max-w-3xl w-full bg-green-900 bg-opacity-70 rounded-3xl p-8 border border-green-500 shadow-xl">
            <div className="text-center space-y-8">
              <div className="text-6xl">🌍</div>
              <h2 className="text-3xl font-bold text-green-300">{ACTS['global-reach'].title}</h2>
              <p className="text-xl text-gray-300 mb-6">
                "Odu points across the shimmering ravine: 'Send value to distant lands, child. No borders exist here.'"
              </p>
              
              {!actProgress['global-reach'].crossBorderSent ? (
                <div className="space-y-6">
                  <div className="text-green-300 italic">
                    "Can money really travel faster than a bird flies?" - Asha
                  </div>
                  <button
                    onClick={sendCrossBorder}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105"
                  >
                    🌐 Asha Sends 300 sats Across Borders
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-blue-400 text-lg transaction-flow">
                    ⚡ → 🌍 → ✅
                  </div>
                  <div className="text-teal-400">"Incredible! It arrived instantly!" - Asha</div>
                </div>
              )}
              
              <div className="mt-8 text-left bg-green-800 bg-opacity-50 p-4 rounded-lg border border-green-600">
                <h3 className="text-green-300 font-semibold mb-2">Asha's Discovery:</h3>
                <p className="text-gray-300">
                  Bitcoin transactions cross borders instantly without permission. 
                  There are no geographic restrictions or special approvals needed 
                  for international payments - something impossible with traditional money.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Act 3: Transparent Rules */}
        <section 
          ref={actRefs['transparent-rules']}
          className="min-h-screen flex items-center justify-center p-4 act-section"
          id="act-3"
        >
          <div className="max-w-3xl w-full bg-green-900 bg-opacity-70 rounded-3xl p-8 border border-green-500 shadow-xl">
            <div className="text-center space-y-8">
              <div className="text-6xl">📜</div>
              <h2 className="text-3xl font-bold text-green-300">{ACTS['transparent-rules'].title}</h2>
              <p className="text-xl text-gray-300 mb-6">
                "Odu gestures to the flowing river of light: 'Behold the eternal record, child. Every truth preserved forever.'"
              </p>
              
              {!actProgress['transparent-rules'].explorerViewed ? (
                <div className="space-y-6">
                  <div className="text-green-300 italic">
                    "A book that writes itself and never lies?" - Asha
                  </div>
                  <button
                    onClick={openBlockExplorer}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105"
                  >
                    🔍 Asha Views the Ledger of Light
                  </button>
                </div>
              ) : (
                <div className="text-purple-400 text-lg">
                  ✅ "Every transaction lives forever in the light!" - Asha
                </div>
              )}
              
              <div className="mt-8 text-left bg-green-800 bg-opacity-50 p-4 rounded-lg border border-green-600">
                <h3 className="text-green-300 font-semibold mb-2">Asha's Revelation:</h3>
                <p className="text-gray-300">
                  Every Bitcoin transaction is recorded permanently on the blockchain. 
                  The rules are transparent and apply equally to everyone. No hidden 
                  fees or secret changes to the monetary policy - unlike traditional banking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Act 4: User Sovereignty */}
        <section 
          ref={actRefs['user-sovereignty']}
          className="min-h-screen flex items-center justify-center p-4 act-section"
          id="act-4"
        >
          <div className="max-w-3xl w-full bg-green-900 bg-opacity-70 rounded-3xl p-8 border border-green-500 shadow-xl">
            <div className="text-center space-y-8">
              <div className="text-6xl">🗝️</div>
              <h2 className="text-3xl font-bold text-green-300">{ACTS['user-sovereignty'].title}</h2>
              <p className="text-xl text-gray-300 mb-6">
                "Odu presents two choices: 'Choose wisely, child. One grants true sovereignty, one merely glitters.'"
              </p>
              
              {!selectedChoice ? (
                <div className="space-y-6">
                  <div className="text-green-300 italic">
                    "Which holds the real power?" - Asha wonders
                  </div>
                  <div className="flex flex-col md:flex-row gap-8 justify-center">
                    <div className="bg-yellow-600 bg-opacity-20 rounded-lg p-6 border border-yellow-500 cursor-not-allowed">
                      <div className="text-4xl mb-2">🪙</div>
                      <div className="text-yellow-400 font-semibold">Shiny Gold Coin</div>
                      <div className="text-sm text-gray-300">Beautiful but controlled by others</div>
                    </div>
                    <button
                      onClick={chooseKey}
                      className="bg-green-600 bg-opacity-20 rounded-lg p-6 border border-green-500 hover:bg-opacity-30 transition-all"
                    >
                      <div className="text-4xl mb-2">🗝️</div>
                      <div className="text-green-400 font-semibold">The Cryptographic Key</div>
                      <div className="text-sm text-gray-300">Simple cube with a glowing green dot</div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-green-400 text-lg">
                    ✅ "I choose sovereignty over beauty!" - Asha
                  </div>
                  {nodeActive && (
                    <div className="text-center">
                      <div className="text-6xl node-pulse">🌿</div>
                      <div className="text-sm text-gray-300">"My own node blooms beside me - I am now my own bank!" - Asha</div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-8 text-left bg-green-800 bg-opacity-50 p-4 rounded-lg border border-green-600">
                <h3 className="text-green-300 font-semibold mb-2">Asha's Final Understanding:</h3>
                <p className="text-gray-300">
                  With Bitcoin, she holds her own private keys and can verify all transactions herself. 
                  She doesn't need to trust any third party. This is true financial sovereignty - 
                  something impossible with traditional money systems.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SparkBeneathStoneSimulation;