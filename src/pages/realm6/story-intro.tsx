import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

// Ubuntu Village styling with Asha integration
const ubuntuTheme = {
  colors: {
    primary: "#E67A00", // Warm orange
    secondary: "#16A085", // Teal
    background: "#2C3E50", // Deep blue
    backgroundLight: "#34495E",
    cardBackground: "#ECF0F1",
    textDark: "#2C3E50",
    textLight: "#F5F5F5",
    accent1: "#E74C3C", // Red
    accent2: "#27AE60", // Green
    icon: "#F39C12",
    border: "#D35400"
  },
  gradients: {
    sunset: "linear-gradient(135deg, #2C3E50 0%, #E67A00 100%)",
    fire: "linear-gradient(135deg, #D35400 0%, #F39C12 100%)",
    light: "linear-gradient(135deg, #16A085 0%, #27AE60 100%)"
  }
};

// Type definitions
type ZoneType = 'harmony-grove' | 'wisdom-exchange' | 'shared-future' | 'lightning-ubuntu';
type InteractionType = 'dialogue' | 'trade' | 'contribution' | 'connection';

interface UbuntuElder {
  id: string;
  name: string;
  emoji: string;
  wisdom: string[];
  currentQuestion: number;
}

interface WisdomItem {
  id: string;
  name: string;
  emoji: string;
  value: number;
  giver: string;
  available: boolean;
  story: string;
}

interface CommunityVision {
  id: string;
  name: string;
  description: string;
  emoji: string;
  needed: number;
  contributed: number;
  supporters: number;
  ubuntuPrinciple: string;
}

interface ConnectionPath {
  id: string;
  path: string[];
  hops: number;
  fee: number;
  speed: 'fast' | 'medium' | 'slow';
  available: boolean;
  story: string;
}

interface ZoneProgress {
  harmony: number; // 0-100
  completed: boolean;
  message?: string;
}

const UbuntuEconomicsSimulation = () => {
  const [, setLocation] = useLocation();
  const [currentZone, setCurrentZone] = useState<ZoneType>('harmony-grove');
  const [harmonyPoints, setHarmonyPoints] = useState(0);
  const [showWisdom, setShowWisdom] = useState<{message: string; from: string} | null>(null);
  const [ashaPosition, setAshaPosition] = useState<'left' | 'center' | 'right'>('center');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Game states
  const [odu, setOdu] = useState<UbuntuElder>({
    id: 'odu',
    name: 'Odu',
    emoji: '🧙🏾',
    wisdom: [
      "In Ubuntu, we don't say 'I think therefore I am.' We say 'I am because we are.'",
      "The tree does not eat its own fruit. The river does not drink its own water. What sustains us is meant to sustain others.",
      "Bitcoin gives us tools for transparency, but Ubuntu gives us the wisdom to use them well.",
      "When you have much, you don't build higher fences. You build longer tables."
    ],
    currentQuestion: 0
  });
  
  const [wisdomGifts, setWisdomGifts] = useState<WisdomItem[]>([]);
  const [communityVisions, setCommunityVisions] = useState<CommunityVision[]>([]);
  const [connectionPaths, setConnectionPaths] = useState<ConnectionPath[]>([]);
  const [selectedVision, setSelectedVision] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  
  const [zoneProgress, setZoneProgress] = useState<Record<ZoneType, ZoneProgress>>({
    'harmony-grove': { harmony: 0, completed: false },
    'wisdom-exchange': { harmony: 0, completed: false },
    'shared-future': { harmony: 0, completed: false },
    'lightning-ubuntu': { harmony: 0, completed: false }
  });

  // Initialize zone data
  useEffect(() => {
    initializeZoneData();
  }, [currentZone]);

  const initializeZoneData = () => {
    switch (currentZone) {
      case 'harmony-grove':
        // Reset Odu's dialogue position
        setOdu(prev => ({ ...prev, currentQuestion: 0 }));
        break;
      case 'wisdom-exchange':
        setWisdomGifts([
          { 
            id: 'seeds', 
            name: 'Heritage Seeds', 
            emoji: '🌱', 
            value: 20, 
            giver: 'Amara', 
            available: true, 
            story: 'These seeds have fed our family for generations. Plant them and share the harvest.' 
          },
          { 
            id: 'song', 
            name: 'Healing Song', 
            emoji: '🎵', 
            value: 15, 
            giver: 'Fatima', 
            available: true, 
            story: 'This melody has healed our village for centuries. Sing it to those in need.' 
          },
          { 
            id: 'story', 
            name: 'Ancestral Story', 
            emoji: '📜', 
            value: 25, 
            giver: 'Chidi', 
            available: true, 
            story: 'This tale teaches how our people survived hard times together. Share it around the fire.' 
          }
        ]);
        break;
      case 'shared-future':
        setCommunityVisions([
          { 
            id: 'water', 
            name: 'Community Well', 
            description: 'Clean water for all families', 
            emoji: '💧', 
            needed: 100, 
            contributed: 30, 
            supporters: 12,
            ubuntuPrinciple: 'Water is life - shared by all' 
          },
          { 
            id: 'school', 
            name: 'Children\'s Library', 
            description: 'Books and learning space', 
            emoji: '📚', 
            needed: 80, 
            contributed: 45, 
            supporters: 8,
            ubuntuPrinciple: 'Education lifts all of us together' 
          },
          { 
            id: 'network', 
            name: 'Lightning Network', 
            description: 'Connect to global Ubuntu villages', 
            emoji: '⚡', 
            needed: 120, 
            contributed: 60, 
            supporters: 15,
            ubuntuPrinciple: 'Our connections make us stronger' 
          }
        ]);
        break;
      case 'lightning-ubuntu':
        setConnectionPaths([
          { 
            id: 'trust', 
            path: ['Ubuntu Village', 'Sister Village'], 
            hops: 1, 
            fee: 0, 
            speed: 'fast', 
            available: true,
            story: 'Direct connection through community trust' 
          },
          { 
            id: 'coop', 
            path: ['Ubuntu Village', 'Cooperative Hub', 'Sister Village'], 
            hops: 2, 
            fee: 5, 
            speed: 'medium', 
            available: true,
            story: 'Through our cooperative network' 
          },
          { 
            id: 'global', 
            path: ['Ubuntu Village', 'City Node', 'Global Network', 'Sister Village'], 
            hops: 3, 
            fee: 10, 
            speed: 'slow', 
            available: true,
            story: 'Connecting Ubuntu to the world' 
          }
        ]);
        break;
    }
  };

  // Scroll to current zone
  useEffect(() => {
    if (scrollContainerRef.current) {
      const zoneElement = document.getElementById(`zone-${currentZone}`);
      if (zoneElement) {
        zoneElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentZone]);

  const showUbuntuWisdom = (message: string, from: string, duration = 4000) => {
    setShowWisdom({ message, from });
    setTimeout(() => setShowWisdom(null), duration);
  };

  // Zone 1: Harmony Grove (Dialogue with Odu)
  const continueDialogue = () => {
    if (odu.currentQuestion >= odu.wisdom.length - 1) {
      // Dialogue complete
      setHarmonyPoints(prev => prev + 25);
      setZoneProgress(prev => ({
        ...prev,
        'harmony-grove': { 
          harmony: 100, 
          completed: true,
          message: "Understood Ubuntu economics: 'I am because we are'"
        }
      }));
      showUbuntuWisdom("Now you see. The economy is not about things, but about relationships.", "Odu");
      return;
    }
    
    // Move Asha's position for animation
    setAshaPosition(prev => prev === 'left' ? 'right' : 'left');
    
    // Continue to next question
    setOdu(prev => ({
      ...prev,
      currentQuestion: prev.currentQuestion + 1
    }));
    
    // Update partial progress
    const progress = ((odu.currentQuestion + 1) / odu.wisdom.length) * 100;
    setZoneProgress(prev => ({
      ...prev,
      'harmony-grove': { 
        ...prev['harmony-grove'],
        harmony: progress
      }
    }));
  };

  // Zone 2: Wisdom Exchange (Gift economy)
  const receiveWisdom = (itemId: string) => {
    const item = wisdomGifts.find(t => t.id === itemId);
    if (!item || !item.available) return;
    
    setHarmonyPoints(prev => prev + item.value);
    setWisdomGifts(prev => prev.map(t => t.id === itemId ? { ...t, available: false } : t));
    
    setZoneProgress(prev => ({
      ...prev,
      'wisdom-exchange': { 
        harmony: 100,
        completed: true,
        message: `Received ${item.name} from ${item.giver}`
      }
    }));
    
    showUbuntuWisdom(item.story, item.giver);
  };

  // Zone 3: Shared Future (Community funding)
  const contributeToVision = (visionId: string) => {
    const vision = communityVisions.find(v => v.id === visionId);
    if (!vision) return;
    
    const contribution = 10; // Fixed contribution for simplicity
    
    setHarmonyPoints(prev => prev + 5);
    setCommunityVisions(prev => prev.map(v => 
      v.id === visionId ? { 
        ...v, 
        contributed: Math.min(v.contributed + contribution, v.needed),
        supporters: v.supporters + 1
      } : v
    ));
    
    setZoneProgress(prev => ({
      ...prev,
      'shared-future': { 
        harmony: (vision.contributed + contribution) / vision.needed * 100,
        completed: (vision.contributed + contribution) >= vision.needed,
        message: `Supported ${vision.name} (${vision.ubuntuPrinciple})`
      }
    }));
    
    showUbuntuWisdom(`Thank you for supporting ${vision.name}. ${vision.ubuntuPrinciple}`, "Community");
  };

  // Zone 4: Lightning Ubuntu (Global connections)
  const makeConnection = (pathId: string) => {
    const path = connectionPaths.find(p => p.id === pathId);
    if (!path || !path.available) return;
    
    setSelectedPath(pathId);
    setHarmonyPoints(prev => prev + (path.fee === 0 ? 30 : 15));
    
    setTimeout(() => {
      setZoneProgress(prev => ({
        ...prev,
        'lightning-ubuntu': { 
          harmony: 100,
          completed: true,
          message: `Connected via ${path.speed} path (${path.story})`
        }
      }));
      
      showUbuntuWisdom(`Ubuntu scales globally! ${path.story}`, "Lightning Network");
    }, path.speed === 'fast' ? 500 : path.speed === 'medium' ? 1500 : 2500);
  };

  // Render each zone section
  const renderZoneSection = (zone: ZoneType) => {
    const isCurrent = currentZone === zone;
    const progress = zoneProgress[zone];

    return (
      <section 
        id={`zone-${zone}`}
        key={zone}
        className={`min-h-screen flex flex-col justify-center p-8 transition-all duration-500 ${isCurrent ? 'opacity-100' : 'opacity-60'}`}
        style={{ 
          background: zone === 'harmony-grove' ? ubuntuTheme.gradients.sunset :
                     zone === 'wisdom-exchange' ? ubuntuTheme.gradients.fire :
                     zone === 'shared-future' ? ubuntuTheme.colors.background :
                     ubuntuTheme.gradients.light
        }}
      >
        <div className="max-w-4xl mx-auto bg-black bg-opacity-40 rounded-xl p-8 border border-orange-500 backdrop-blur-sm">
          {/* Zone header */}
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold" style={{ color: ubuntuTheme.colors.textLight }}>
              {zone === 'harmony-grove' && '🌳 Harmony Grove'}
              {zone === 'wisdom-exchange' && '🔄 Wisdom Exchange'}
              {zone === 'shared-future' && '🤝 Shared Future'}
              {zone === 'lightning-ubuntu' && '⚡ Lightning Ubuntu'}
            </h2>
            <div className="flex-1 h-2 bg-gray-700 rounded-full">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-green-400"
                style={{ width: `${progress.harmony}%` }}
              />
            </div>
          </div>
          
          {/* Zone-specific content */}
          {zone === 'harmony-grove' && (
            <div className="space-y-8">
              <div className="flex justify-center space-x-8 items-end">
                {/* Odu */}
                <div 
                  className={`transition-all duration-500 ${ashaPosition === 'left' ? 'translate-x-4' : ashaPosition === 'right' ? '-translate-x-4' : ''}`}
                  style={{ textAlign: 'center' }}
                >
                  <div className="text-6xl mb-2">🧙🏾</div>
                  <div className="bg-orange-800 text-white px-4 py-2 rounded-lg max-w-xs">
                    <p>{odu.wisdom[odu.currentQuestion]}</p>
                    <p className="text-right text-orange-300 text-sm mt-1">- Odu</p>
                  </div>
                </div>
                
                {/* Asha */}
                <div className="transition-all duration-500">
                  <img 
                    src="https://bitcoiners.africa/wp-content/uploads/2025/06/asha2.png" 
                    alt="Asha" 
                    className="h-32 mx-auto"
                  />
                  <div className="bg-blue-800 text-white px-4 py-2 rounded-lg max-w-xs mt-2">
                    <p>
                      {odu.currentQuestion === 0 ? "How can an economy thrive without self-interest?" :
                       odu.currentQuestion === 1 ? "But how does this work with digital money?" :
                       odu.currentQuestion === 2 ? "So Bitcoin can support Ubuntu principles?" :
                       "I'm beginning to understand..."}
                    </p>
                    <p className="text-right text-blue-300 text-sm mt-1">- Asha</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={continueDialogue}
                  className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  {odu.currentQuestion < odu.wisdom.length - 1 ? "Continue Dialogue" : "Understand Ubuntu"}
                </button>
              </div>
            </div>
          )}
          
          {zone === 'wisdom-exchange' && (
            <div className="space-y-6">
              <div className="bg-orange-100 text-red-800 p-4 rounded-lg">
                <p className="italic">"In Ubuntu, we don't say 'thank you' with words alone. We give back in kind when we can."</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {wisdomGifts.map(item => (
                  <div 
                    key={item.id} 
                    className={`bg-white bg-opacity-10 rounded-lg p-4 border backdrop-blur-sm ${
                      item.available ? 'border-orange-500 hover:border-orange-300 cursor-pointer' : 'border-gray-600'
                    } transition-all`}
                    onClick={() => item.available && receiveWisdom(item.id)}
                  >
                    <div className="text-4xl mb-3 text-center">{item.emoji}</div>
                    <div className="text-white text-lg font-semibold text-center">{item.name}</div>
                    <div className="text-orange-300 text-sm text-center mb-3">From {item.giver}</div>
                    
                    {item.available ? (
                      <div className="text-center">
                        <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded">
                          +{item.value} Harmony
                        </span>
                      </div>
                    ) : (
                      <div className="text-center text-green-300 text-sm">
                        Gift Received
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {progress.completed && (
                <div className="mt-6 bg-green-900 bg-opacity-50 p-4 rounded-lg border border-green-400">
                  <div className="text-center text-white">
                    <p>🎉 You've experienced Ubuntu gift economics!</p>
                    <p className="text-orange-300">"What is given multiplies when shared"</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {zone === 'shared-future' && (
            <div className="space-y-6">
              <div className="bg-orange-100 text-red-800 p-4 rounded-lg">
                <p className="italic">"No one person builds a village. Our strength is in our shared vision."</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {communityVisions.map(vision => (
                  <div 
                    key={vision.id} 
                    className="bg-white bg-opacity-10 rounded-lg p-4 border border-orange-500 backdrop-blur-sm"
                  >
                    <div className="text-4xl mb-3 text-center">{vision.emoji}</div>
                    <div className="text-white text-lg font-semibold text-center">{vision.name}</div>
                    <div className="text-orange-300 text-sm text-center mb-3">{vision.description}</div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-orange-300">Community Support</span>
                        <span className="text-white">{Math.round((vision.contributed / vision.needed) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-400 to-green-400 h-2 rounded-full"
                          style={{ width: `${(vision.contributed / vision.needed) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={() => contributeToVision(vision.id)}
                      className="w-full bg-orange-500 hover:bg-orange-400 text-white py-2 rounded transition-all"
                    >
                      Contribute (10 Harmony)
                    </button>
                    
                    <div className="text-xs text-center mt-2 text-orange-300">
                      {vision.ubuntuPrinciple}
                    </div>
                  </div>
                ))}
              </div>
              
              {progress.completed && (
                <div className="mt-6 bg-green-900 bg-opacity-50 p-4 rounded-lg border border-green-400">
                  <div className="text-center text-white">
                    <p>✨ Community vision achieved!</p>
                    <p className="text-orange-300">"Together we accomplish what none can do alone"</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {zone === 'lightning-ubuntu' && (
            <div className="space-y-6">
              <div className="bg-orange-100 text-red-800 p-4 rounded-lg">
                <p className="italic">"Ubuntu says 'I am because we are.' Lightning says 'We are because we connect.'"</p>
              </div>
              
              <div className="text-center text-orange-300">
                Send Harmony to our sister Ubuntu village in Kenya
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {connectionPaths.map(path => (
                  <button
                    key={path.id}
                    onClick={() => makeConnection(path.id)}
                    disabled={!path.available}
                    className={`bg-white bg-opacity-10 rounded-lg p-4 border transition-all ${
                      path.available ? 
                      'border-orange-500 hover:border-orange-300' : 
                      'border-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-3xl mb-2">
                      {path.speed === 'fast' ? '⚡' : path.speed === 'medium' ? '🔗' : '🌍'}
                    </div>
                    <div className="text-white text-sm">{path.hops} hop{path.hops > 1 ? 's' : ''}</div>
                    <div className="text-orange-400 text-sm my-1">
                      {path.fee === 0 ? 'Trust-based (Free)' : `Fee: ${path.fee} sats`}
                    </div>
                    <div className="text-xs text-orange-300">
                      {path.path.join(' → ')}
                    </div>
                  </button>
                ))}
              </div>
              
              {selectedPath && (
                <div className="text-center text-orange-400">
                  ⚡ Connecting through Lightning Network...
                </div>
              )}
              
              {progress.completed && (
                <div className="mt-6 bg-green-900 bg-opacity-50 p-4 rounded-lg border border-green-400">
                  <div className="text-center text-white">
                    <p className="text-xl mb-2">🌍 Ubuntu Goes Global!</p>
                    <p className="text-orange-300">"I am because we are - now connecting every village on Earth"</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Navigation to next zone */}
          {progress.completed && zone !== 'lightning-ubuntu' && (
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  const zones: ZoneType[] = ['harmony-grove', 'wisdom-exchange', 'shared-future', 'lightning-ubuntu'];
                  const nextZone = zones[zones.indexOf(zone) + 1];
                  setCurrentZone(nextZone);
                }}
                className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                Continue to {zone === 'harmony-grove' ? 'Wisdom Exchange' : 
                            zone === 'wisdom-exchange' ? 'Shared Future' : 'Lightning Ubuntu'} →
              </button>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div 
      ref={scrollContainerRef}
      className="relative overflow-y-auto h-screen snap-y snap-mandatory"
      style={{ background: ubuntuTheme.colors.background }}
    >
      {/* Wisdom popup */}
      {showWisdom && (
        <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 max-w-lg w-full px-4">
          <div className="bg-orange-800 border-2 border-orange-500 text-white p-4 rounded-lg shadow-2xl">
            <p className="text-center font-medium">{showWisdom.message}</p>
            <p className="text-right text-orange-300 text-sm mt-1">- {showWisdom.from}</p>
          </div>
        </div>
      )}

      {/* Navigation header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-orange-900 bg-opacity-90 border-b border-orange-500">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button 
            onClick={() => setLocation('/realm/6')}
            className="flex items-center text-orange-300 hover:text-white"
          >
             Continue to Ubuntu Village→
          </button>
          
          <h1 className="text-xl font-bold text-orange-300">
            Asha's Ubuntu Economics Journey
          </h1>
          
          <div className="flex items-center space-x-2">
            <span className="text-orange-300">{harmonyPoints} Harmony</span>
            <span className="text-orange-400">🕊️</span>
          </div>
        </div>
      </header>

      {/* Zone navigation */}
      <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex space-x-2 bg-orange-900 bg-opacity-90 rounded-full px-4 py-2 border border-orange-500">
          {Object.keys(zoneProgress).map((zone) => (
            <button
              key={zone}
              onClick={() => setCurrentZone(zone as ZoneType)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                zone === currentZone ? 'bg-orange-500 scale-110' :
                zoneProgress[zone as ZoneType].completed ? 'bg-green-500' : 'bg-orange-800'
              }`}
            >
              {zone === 'harmony-grove' && '🌳'}
              {zone === 'wisdom-exchange' && '🔄'}
              {zone === 'shared-future' && '🤝'}
              {zone === 'lightning-ubuntu' && '⚡'}
            </button>
          ))}
        </div>
      </nav>

      {/* Render all zones */}
      {(['harmony-grove', 'wisdom-exchange', 'shared-future', 'lightning-ubuntu'] as ZoneType[]).map(zone => 
        renderZoneSection(zone)
      )}
    </div>
  );
};

export default UbuntuEconomicsSimulation;