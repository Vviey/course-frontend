import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

// Ubuntu Village styling
const ubuntuTheme = {
  colors: {
    primary: "#A32D00",
    secondary: "#D0330D",
    background: "#541400",
    backgroundLight: "#7A1E00",
    cardBackground: "#FFF0EC",
    textDark: "#3E1E00",
    textLight: "#FBF4D2",
    accent1: "#FF6D4D",
    accent2: "#FF9B85",
    icon: "#FF6D4D",
    border: "#A32D00"
  },
  gradients: {
    sunset: "linear-gradient(135deg, #541400 0%, #7A1E00 50%, #A32D00 100%)",
    fire: "linear-gradient(135deg, #D0330D 0%, #FF6D4D 50%, #FF9B85 100%)",
    light: "linear-gradient(135deg, #FF6D4D 0%, #FF9B85 50%, #FFF0EC 100%)"
  }
};

// Type definitions
type ZoneType = 'savings-circle' | 'market-web' | 'village-treasury' | 'lightning-circle';
type TransactionType = 'rosca' | 'trade' | 'donation' | 'lightning';

interface CommunityMember {
  id: string;
  name: string;
  emoji: string;
  contribution: number;
  receivedTurn: boolean;
  trustScore: number;
  relationship?: string;
}

interface ROSCAState {
  currentWeek: number;
  potAmount: number;
  currentReceiver: string;
  userJoined: boolean;
  userTurn: number;
  totalMembers: number;
}

interface TradeItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  seller: string;
  available: boolean;
  story?: string;
}

interface CommunityProject {
  id: string;
  name: string;
  description: string;
  emoji: string;
  cost: number;
  raised: number;
  votes: number;
  priority: number;
  ubuntuValue?: string;
}

interface LightningRoute {
  id: string;
  path: string[];
  hops: number;
  fee: number;
  speed: 'fast' | 'medium' | 'slow';
  available: boolean;
  story?: string;
}

interface ZoneProgress {
  joined: boolean;
  completed: boolean;
  message?: string;
}

const CircleOfTrustSimulation = () => {
  const [, setLocation] = useLocation();
  const [currentZone, setCurrentZone] = useState<ZoneType>('savings-circle');
  const [userSats, setUserSats] = useState(5000);
  const [showPopup, setShowPopup] = useState<{message: string; type: string} | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Zone states
  const [roscaState, setRoscaState] = useState<ROSCAState>({
    currentWeek: 1,
    potAmount: 0,
    currentReceiver: '',
    userJoined: false,
    userTurn: 0,
    totalMembers: 5
  });
  
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>([]);
  const [tradeItems, setTradeItems] = useState<TradeItem[]>([]);
  const [communityProjects, setCommunityProjects] = useState<CommunityProject[]>([]);
  const [lightningRoutes, setLightningRoutes] = useState<LightningRoute[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  
  const [zoneProgress, setZoneProgress] = useState<Record<ZoneType, ZoneProgress>>({
    'savings-circle': { joined: false, completed: false },
    'market-web': { joined: false, completed: false },
    'village-treasury': { joined: false, completed: false },
    'lightning-circle': { joined: false, completed: false }
  });

  // Initialize zone data
  useEffect(() => {
    initializeZoneData();
  }, [currentZone]);

  const initializeZoneData = () => {
    switch (currentZone) {
      case 'savings-circle':
        setCommunityMembers([
          { id: 'amara', name: 'Amara', emoji: '👩🏿‍🌾', contribution: 1000, receivedTurn: false, trustScore: 95, relationship: 'Crop sharing partner' },
          { id: 'kwame', name: 'Kwame', emoji: '👨🏿‍🔧', contribution: 1000, receivedTurn: true, trustScore: 100, relationship: 'Village mechanic' },
          { id: 'fatima', name: 'Fatima', emoji: '👩🏾‍⚕️', contribution: 1000, receivedTurn: false, trustScore: 90, relationship: 'Community healer' },
          { id: 'chidi', name: 'Chidi', emoji: '👨🏾‍🏫', contribution: 1000, receivedTurn: false, trustScore: 85, relationship: 'School teacher' },
          { id: 'zara', name: 'Zara', emoji: '👩🏽‍💼', contribution: 1000, receivedTurn: false, trustScore: 88, relationship: 'Market coordinator' }
        ]);
        break;
      case 'market-web':
        setTradeItems([
          { id: 'grain', name: 'Grain Surplus', emoji: '🌾', price: 500, seller: 'Amara', available: true, story: 'Excess from good harvest - sharing abundance' },
          { id: 'healing', name: 'Herbal Medicine', emoji: '🌿', price: 300, seller: 'Fatima', available: true, story: 'Traditional remedies for community health' },
          { id: 'education', name: 'Tutoring Service', emoji: '📚', price: 200, seller: 'Chidi', available: true, story: 'Knowledge shared freely, tips appreciated' }
        ]);
        break;
      case 'village-treasury':
        setCommunityProjects([
          { 
            id: 'borehole', 
            name: 'Community Borehole', 
            description: 'Clean water access for 200 families', 
            emoji: '💧', 
            cost: 50000, 
            raised: 12000, 
            votes: 15, 
            priority: 1,
            ubuntuValue: 'Water is life - shared by all'
          },
          { 
            id: 'medical', 
            name: 'Medical Clinic Supplies', 
            description: 'Essential medicines and equipment', 
            emoji: '💊', 
            cost: 30000, 
            raised: 8000, 
            votes: 12, 
            priority: 2,
            ubuntuValue: 'Health strengthens the whole community'
          },
          { 
            id: 'school', 
            name: 'School Roof Repair', 
            description: 'Fixing storm damage for safe learning', 
            emoji: '🏫', 
            cost: 25000, 
            raised: 15000, 
            votes: 8, 
            priority: 3,
            ubuntuValue: 'Education lifts all of us together'
          }
        ]);
        break;
      case 'lightning-circle':
        setLightningRoutes([
          { 
            id: 'direct', 
            path: ['Ubuntu Village', 'Sister Village'], 
            hops: 1, 
            fee: 1, 
            speed: 'fast', 
            available: true,
            story: 'Direct connection through community trust'
          },
          { 
            id: 'through-city', 
            path: ['Ubuntu Village', 'City Hub', 'Sister Village'], 
            hops: 2, 
            fee: 5, 
            speed: 'medium', 
            available: true,
            story: 'Through urban network - still community powered'
          },
          { 
            id: 'cooperative', 
            path: ['Ubuntu Village', 'Cooperative Network', 'Sister Village'], 
            hops: 3, 
            fee: 0, 
            speed: 'slow', 
            available: true,
            story: 'Free routing through Ubuntu cooperative'
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

  const showUbuntuPopup = (message: string, type = 'ubuntu', duration = 4000) => {
    setShowPopup({ message, type });
    setTimeout(() => setShowPopup(null), duration);
  };

  // Zone 1: Savings Circle (ROSCA)
  const joinROSCA = () => {
    if (userSats < 1000 || roscaState.userJoined) return;
    
    setUserSats(prev => prev - 1000);
    setRoscaState(prev => ({
      ...prev,
      userJoined: true,
      potAmount: prev.potAmount + 1000,
      userTurn: Math.floor(Math.random() * 4) + 2 // User gets turn in 2-5 weeks
    }));
    
    setZoneProgress(prev => ({
      ...prev,
      'savings-circle': { 
        ...prev['savings-circle'], 
        joined: true,
        message: "Joined the Ubuntu Savings Circle"
      }
    }));
    
    showUbuntuPopup("No interest. No bank. Just trust. The pot returns when the community remembers.", 'ubuntu');
    
    // Simulate weekly progression
    setTimeout(() => simulateROSCAWeeks(), 2000);
  };

  const simulateROSCAWeeks = () => {
    let week = roscaState.currentWeek;
    const weekInterval = setInterval(() => {
      week++;
      setRoscaState(prev => ({ ...prev, currentWeek: week }));
      
      if (week === roscaState.userTurn) {
        // User's turn to receive
        const totalPot = roscaState.totalMembers * 1000;
        setUserSats(prev => prev + totalPot);
        
        setZoneProgress(prev => ({
          ...prev,
          'savings-circle': { 
            ...prev['savings-circle'], 
            completed: true,
            message: "Received the pot! Trust creates wealth without exploitation."
          }
        }));
        
        showUbuntuPopup("Your turn! The community remembers. Trust creates wealth without exploitation.", 'success');
        clearInterval(weekInterval);
      }
    }, 1000);
  };

  // Zone 2: Market Web (Peer-to-peer trading)
  const scanQRCode = (itemId: string) => {
    const item = tradeItems.find(t => t.id === itemId);
    if (!item || !item.available) return;
    
    setUserSats(prev => prev + item.price);
    setTradeItems(prev => prev.map(t => t.id === itemId ? { ...t, available: false } : t));
    
    setZoneProgress(prev => ({
      ...prev,
      'market-web': { 
        ...prev['market-web'], 
        joined: true,
        completed: true,
        message: `Received gift from ${item.seller}! ${item.story}`
      }
    }));
    
    showUbuntuPopup(`Gift received from ${item.seller}! ${item.story}`, 'trade');
  };

  // Zone 3: Village Treasury (Community funding)
  const donateToProject = (projectId: string) => {
    if (userSats < 500) return;
    
    setUserSats(prev => prev - 500);
    setCommunityProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, raised: p.raised + 500 } : p
    ));
    
    setZoneProgress(prev => ({
      ...prev,
      'village-treasury': { 
        ...prev['village-treasury'], 
        joined: true,
        message: "Contributed to community project"
      }
    }));
    
    const project = communityProjects.find(p => p.id === projectId);
    showUbuntuPopup(`Contributed to ${project?.name}! ${project?.ubuntuValue}`, 'collective');
  };

  const voteForProject = (projectId: string) => {
    setSelectedProject(projectId);
    setCommunityProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, votes: p.votes + 1 } : p
    ));
    
    setZoneProgress(prev => ({
      ...prev,
      'village-treasury': { 
        ...prev['village-treasury'], 
        completed: true,
        message: "Voted for community project"
      }
    }));
    
    const project = communityProjects.find(p => p.id === projectId);
    showUbuntuPopup(`Voted for ${project?.name}! Community decides together.`, 'collective');
  };

  // Zone 4: Lightning Circle (Fast payments)
  const selectLightningRoute = (routeId: string) => {
    const route = lightningRoutes.find(r => r.id === routeId);
    if (!route || !route.available) return;
    
    setSelectedRoute(routeId);
    
    // Simulate payment
    setTimeout(() => {
      setUserSats(prev => prev - 1000 - route.fee);
      
      setZoneProgress(prev => ({
        ...prev,
        'lightning-circle': { 
          ...prev['lightning-circle'], 
          joined: true,
          completed: true,
          message: `Payment sent via ${route.speed} route`
        }
      }));
      
      showUbuntuPopup(`Payment sent! ${route.story}. Ubuntu scales globally.`, 'lightning');
    }, route.speed === 'fast' ? 500 : route.speed === 'medium' ? 2000 : 3000);
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
          background: zone === 'savings-circle' ? ubuntuTheme.gradients.sunset :
                     zone === 'market-web' ? ubuntuTheme.gradients.fire :
                     zone === 'village-treasury' ? ubuntuTheme.colors.background :
                     ubuntuTheme.gradients.light
        }}
      >
        <div className="max-w-4xl mx-auto bg-black bg-opacity-40 rounded-xl p-8 border border-orange-500 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Zone content */}
            <div className="flex-grow">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-3xl font-bold" style={{ color: ubuntuTheme.colors.textLight }}>
                  {zone === 'savings-circle' && '🌳 Ubuntu Savings Circle'}
                  {zone === 'market-web' && '🏪 Ubuntu Market Web'}
                  {zone === 'village-treasury' && '🏛️ Village Treasury'}
                  {zone === 'lightning-circle' && '⚡ Lightning Circle'}
                </h2>
                <span className="bg-orange-900 text-orange-200 px-3 py-1 rounded-full text-sm">
                  {zone === 'savings-circle' && 'Trust Without Banks'}
                  {zone === 'market-web' && 'Gifts & Gratitude'}
                  {zone === 'village-treasury' && 'Collective Decisions'}
                  {zone === 'lightning-circle' && 'Global Ubuntu'}
                </span>
              </div>
              
              <p className="text-lg mb-6" style={{ color: ubuntuTheme.colors.textLight }}>
                {zone === 'savings-circle' && "Rotating savings and credit association built on trust, not interest"}
                {zone === 'market-web' && "Peer-to-peer exchange where gifts flow and gratitude is given"}
                {zone === 'village-treasury' && "Community funding with full transparency and collective voting"}
                {zone === 'lightning-circle' && "Ubuntu values scaled globally through Lightning Network"}
              </p>
              
              {/* Current progress */}
              {progress.joined && (
                <div className="mb-6">
                  <div className={`p-3 rounded-lg ${
                    progress.completed ? 'bg-green-900 bg-opacity-50' : 'bg-orange-900 bg-opacity-50'
                  }`}>
                    <p className="text-sm" style={{ color: ubuntuTheme.colors.textLight }}>
                      {progress.message}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Zone-specific content */}
              {zone === 'savings-circle' && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                      roscaState.userJoined ? 'bg-orange-500 animate-pulse' : 'bg-red-800'
                    }`}>
                      {roscaState.potAmount.toLocaleString()} sats
                    </div>
                  </div>
                  
                  {!roscaState.userJoined ? (
                    <div className="space-y-4">
                      <div className="bg-orange-100 text-red-800 p-4 rounded-lg">
                        <p className="italic">"Join our Ubuntu Savings Circle - give first, receive later. No interest, just trust."</p>
                      </div>
                      <button
                        onClick={joinROSCA}
                        disabled={userSats < 1000}
                        className={`w-full py-3 px-6 rounded-lg font-bold transition-all ${
                          userSats >= 1000 ? 
                          'bg-orange-500 hover:bg-orange-400 text-white' :
                          'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        🤝 Join Circle (1000 sats)
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-orange-300">Your turn comes in week {roscaState.userTurn}</p>
                        <p className="text-sm text-orange-400">Current week: {roscaState.currentWeek}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {communityMembers.map(member => (
                      <div key={member.id} className="bg-red-900 bg-opacity-60 rounded-lg p-4 border border-orange-500">
                        <div className="text-2xl mb-2">{member.emoji}</div>
                        <div className="text-white text-sm">{member.name}</div>
                        <div className="text-orange-400 text-xs">{member.contribution} sats</div>
                        {member.receivedTurn && (
                          <div className="text-xs text-orange-300">✅ Received</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {zone === 'market-web' && (
                <div className="space-y-6">
                  <div className="bg-orange-100 text-red-800 p-4 rounded-lg">
                    <p className="italic">"No buying and selling here - we share abundance and accept gratitude."</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tradeItems.map(item => (
                      <div key={item.id} className={`bg-red-900 bg-opacity-60 rounded-lg p-4 border ${
                        item.available ? 'border-orange-500' : 'border-gray-600'
                      }`}>
                        <div className="text-3xl mb-2">{item.emoji}</div>
                        <div className="text-white text-lg">{item.name}</div>
                        <div className="text-orange-300 text-sm">From {item.seller}</div>
                        <div className="text-orange-400 text-lg my-2">🙏 {item.price} sats</div>
                        
                        {item.available ? (
                          <button
                            onClick={() => scanQRCode(item.id)}
                            className="w-full bg-orange-500 hover:bg-orange-400 text-white py-2 rounded transition-all"
                          >
                            Accept Gift
                          </button>
                        ) : (
                          <div className="text-orange-300 text-center py-2">
                            Gift Received
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {zone === 'village-treasury' && (
                <div className="space-y-6">
                  <div className="bg-orange-100 text-red-800 p-4 rounded-lg">
                    <p className="italic">"Every satoshi visible, every decision together. Ubuntu transparency."</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {communityProjects.map(project => (
                      <div key={project.id} className="bg-red-900 bg-opacity-60 rounded-lg p-4 border border-orange-500">
                        <div className="text-3xl mb-2">{project.emoji}</div>
                        <div className="text-white text-lg font-semibold">{project.name}</div>
                        <div className="text-orange-300 text-sm mb-2">{project.description}</div>
                        
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-orange-300">Raised</span>
                            <span className="text-white">{Math.round((project.raised / project.cost) * 100)}%</span>
                          </div>
                          <div className="w-full bg-red-800 rounded-full h-2">
                            <div 
                              className="bg-orange-400 h-2 rounded-full"
                              style={{ width: `${(project.raised / project.cost) * 100}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => donateToProject(project.id)}
                            disabled={userSats < 500}
                            className={`flex-1 py-2 rounded text-sm ${
                              userSats >= 500 ?
                              'bg-orange-500 hover:bg-orange-400 text-white' :
                              'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            Donate 500
                          </button>
                          <button
                            onClick={() => voteForProject(project.id)}
                            className="flex-1 bg-orange-400 hover:bg-orange-300 text-red-900 py-2 rounded text-sm"
                          >
                            Vote ({project.votes})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {zone === 'lightning-circle' && (
                <div className="space-y-6">
                  <div className="bg-orange-100 text-red-800 p-4 rounded-lg">
                    <p className="italic">"Ubuntu wisdom, global reach. 'I am because we are' - now connecting every village."</p>
                  </div>
                  
                  <div className="text-center text-orange-300">
                    Send 1000 sats to our sister Ubuntu village in Kenya
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {lightningRoutes.map(route => (
                      <button
                        key={route.id}
                        onClick={() => selectLightningRoute(route.id)}
                        disabled={!route.available}
                        className={`bg-red-900 bg-opacity-60 rounded-lg p-4 border transition-all ${
                          route.available ? 
                          'border-orange-500 hover:border-orange-400' : 
                          'border-gray-600 cursor-not-allowed'
                        }`}
                      >
                        <div className="text-2xl mb-2">
                          {route.speed === 'fast' ? '🚀' : route.speed === 'medium' ? '🚗' : '🤝'}
                        </div>
                        <div className="text-white text-sm">{route.hops} hop{route.hops > 1 ? 's' : ''}</div>
                        <div className="text-orange-400 text-sm my-1">
                          {route.fee === 0 ? 'Free (Ubuntu)' : `Fee: ${route.fee} sats`}
                        </div>
                        <div className="text-xs text-orange-300">
                          {route.path.join(' → ')}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {selectedRoute && (
                    <div className="text-center text-orange-400">
                      ⚡ Payment routing through Lightning Network...
                    </div>
                  )}
                </div>
              )}
              
              {/* Navigation to next zone */}
              {progress.completed && zone !== 'lightning-circle' && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      const zones: ZoneType[] = ['savings-circle', 'market-web', 'village-treasury', 'lightning-circle'];
                      const nextZone = zones[zones.indexOf(zone) + 1];
                      setCurrentZone(nextZone);
                    }}
                    className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 px-6 rounded-lg transition-all"
                  >
                    Continue to {zone === 'savings-circle' ? 'Market Web' : 
                                zone === 'market-web' ? 'Village Treasury' : 'Lightning Circle'} →
                  </button>
                </div>
              )}
              
              {/* Completion message */}
              {zone === 'lightning-circle' && progress.completed && (
                <div className="mt-6 bg-green-900 bg-opacity-50 p-4 rounded-lg border border-green-400">
                  <div className="text-center text-white">
                    <p className="text-xl mb-2">🎉 Ubuntu + Bitcoin = Scalable Humanity</p>
                    <p className="text-orange-300">"I am because we are - now connecting every village on Earth"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
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
      {/* Ubuntu popup */}
      {showPopup && (
        <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 max-w-lg">
          <div className={`p-4 rounded-lg shadow-2xl border-2 ${
            showPopup.type === 'ubuntu' ? 'bg-red-900 border-red-600 text-white' :
            showPopup.type === 'trade' ? 'bg-orange-500 border-orange-400 text-red-900' :
            showPopup.type === 'collective' ? 'bg-red-800 border-orange-500 text-white' :
            'bg-orange-400 border-orange-300 text-red-900'
          }`}>
            <p className="text-center font-medium">{showPopup.message}</p>
          </div>
        </div>
      )}

      {/* Navigation header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-red-900 bg-opacity-90 border-b border-orange-500">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button 
            onClick={() => setLocation('/realm/2')}
            className="flex items-center text-orange-300 hover:text-white"
          >
            ← Back to Realm
          </button>
          
          <h1 className="text-xl font-bold text-orange-300">
            Ubuntu Village: Circle of Trust
          </h1>
          
          <div className="flex items-center space-x-2">
            <span className="text-orange-300">{userSats.toLocaleString()} sats</span>
            <span className="text-orange-400">⚡</span>
          </div>
        </div>
      </header>

      {/* Zone navigation */}
      <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex space-x-2 bg-red-900 bg-opacity-90 rounded-full px-4 py-2 border border-orange-500">
          {Object.keys(zoneProgress).map((zone) => (
            <button
              key={zone}
              onClick={() => setCurrentZone(zone as ZoneType)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                zone === currentZone ? 'bg-orange-500 scale-110' :
                zoneProgress[zone as ZoneType].completed ? 'bg-orange-400' : 'bg-red-800'
              }`}
            >
              {zone === 'savings-circle' && '🌳'}
              {zone === 'market-web' && '🏪'}
              {zone === 'village-treasury' && '🏛️'}
              {zone === 'lightning-circle' && '⚡'}
            </button>
          ))}
        </div>
      </nav>

      {/* Render all zones */}
      {(['savings-circle', 'market-web', 'village-treasury', 'lightning-circle'] as ZoneType[]).map(zone => 
        renderZoneSection(zone)
      )}
    </div>
  );
};

export default CircleOfTrustSimulation;