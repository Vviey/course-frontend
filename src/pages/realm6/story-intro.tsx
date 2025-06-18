import React, { useState, useEffect, useRef } from 'react';

// Type definitions
type ZoneType = 'savings-circle' | 'market-web' | 'village-treasury' | 'lightning-circle';
type AshaState = 'exhausted' | 'reflecting' | 'participating' | 'contributing' | 'connecting' | 'ubuntu-enlightened';
type ParticipantRole = 'contributor' | 'receiver' | 'trader' | 'voter' | 'router';
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
    'savings-circle': { joined: boolean; turnReceived: boolean; trustBuilt: boolean; completed: boolean };
    'market-web': { tradesCompleted: number; qrScanned: boolean; peerToPeerUnderstood: boolean; completed: boolean };
    'village-treasury': { donated: boolean; voted: boolean; transparencySeen: boolean; completed: boolean };
    'lightning-circle': { routesExplored: number; fastPaymentSent: boolean; scaleUnderstood: boolean; completed: boolean };
}

interface TooltipData {
    message: string;
    x: number;
    y: number;
}

interface UbuntuMetrics {
    trustLevel: number;
    contributionsMade: number;
    communityImpact: number;
    connectionsMade: number;
    generosityScore: number;
}

// Zone configurations with Ubuntu Village styling
const ZONES: Record<ZoneType, {
    id: number;
    title: string;
    background: string;
    description: string;
    mood: string;
    ashaThought: string;
}> = {
    'savings-circle': {
        id: 1,
        title: "The Ubuntu Savings Circle",
        background: "linear-gradient(135deg, #541400 0%, #7A1E00 50%, #A32D00 100%)",
        description: "Ancient baobab tree where Ubuntu wisdom flows",
        mood: "communal",
        ashaThought: "Finally... a system that remembers our Ubuntu way. No interest, just trust."
    },
    'market-web': {
        id: 2,
        title: "The Ubuntu Market Web",
        background: "linear-gradient(135deg, #D0330D 0%, #FF6D4D 50%, #FF9B85 100%)",
        description: "Village square where gifts and needs meet",
        mood: "trading",
        ashaThought: "Not buying and selling... sharing and receiving. Like it should be."
    },
    'village-treasury': {
        id: 3,
        title: "The Ubuntu Village Treasury",
        background: "linear-gradient(135deg, #A32D00 0%, #D0330D 50%, #FF6D4D 100%)",
        description: "Community granary built on transparency",
        mood: "collective",
        ashaThought: "Everyone sees where contributions go. No hidden fees, no mysterious banks."
    },
    'lightning-circle': {
        id: 4,
        title: "The Lightning Circle",
        background: "linear-gradient(135deg, #FF6D4D 0%, #FF9B85 50%, #FFF0EC 100%)",
        description: "Ubuntu values meeting global connection",
        mood: "expansive",
        ashaThought: "Ubuntu without borders... 'I am because we are' - now worldwide."
    }
};

const CircleOfTrustSimulation = () => {
    // Character image URLs
    const [ashaImageUrl] = useState('https://bitcoiners.africa/wp-content/uploads/2025/06/asha2.png');
    
    // Game state
    const [currentZone, setCurrentZone] = useState<ZoneType>('savings-circle');
    const [userSats, setUserSats] = useState(5000);
    const [ashaState, setAshaState] = useState<AshaState>('exhausted');
    const [gamePhase, setGamePhase] = useState('intro'); // intro, playing, complete
    const [conversationStep, setConversationStep] = useState(0);
    
    // Dialogue arrays
    const [ashaDialogue] = useState([
        "Odu... I'm so tired. Banks that steal our money with fees...",
        "Mobile money that disconnects when we need it most...",
        "Credit systems that trap us in debt cycles...",
        "But I remember grandmother's stories of Ubuntu economics...",
        "Where we gave without expecting, and received when we needed...",
        "Maybe Bitcoin can bring back that wisdom?"
    ]);

    const [oduDialogue] = useState([
        "Asha, my child, I see the weight of broken promises in your eyes.",
        "These foreign money systems have forgotten what we always knew...",
        "That wealth means having enough to share, not to hoard.",
        "Come, let me show you how Bitcoin remembers Ubuntu...",
        "Here, trust is built in community, just like our ancestors...",
        "Technology serving humanity, not the other way around."
    ]);
    
    // Zone-specific states
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
    
    const [zoneProgress, setZoneProgress] = useState<ZoneProgress>({
        'savings-circle': { joined: false, turnReceived: false, trustBuilt: false, completed: false },
        'market-web': { tradesCompleted: 0, qrScanned: false, peerToPeerUnderstood: false, completed: false },
        'village-treasury': { donated: false, voted: false, transparencySeen: false, completed: false },
        'lightning-circle': { routesExplored: 0, fastPaymentSent: false, scaleUnderstood: false, completed: false }
    });
    
    const [showTooltip, setShowTooltip] = useState<TooltipData | null>(null);
    const [showPopup, setShowPopup] = useState<{ message: string; type: string } | null>(null);
    const [gameComplete, setGameComplete] = useState(false);
    const [ubuntuMetrics, setUbuntuMetrics] = useState<UbuntuMetrics>({
        trustLevel: 0,
        contributionsMade: 0,
        communityImpact: 0,
        connectionsMade: 0,
        generosityScore: 0
    });
    
    const zoneStartTime = useRef(Date.now());

    // Initialize data for different zones
    useEffect(() => {
        if (gamePhase === 'playing') {
            initializeZoneData();
        }
    }, [currentZone, gamePhase]);

    // Dark mode detection
    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        }
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (event.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        });
    }, []);

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

    // Conversation system
    const advanceConversation = () => {
        if (conversationStep < ashaDialogue.length) {
            setConversationStep(prev => prev + 1);
            
            if (conversationStep + 1 >= ashaDialogue.length) {
                setTimeout(() => {
                    setGamePhase('playing');
                    setAshaState('reflecting');
                }, 2000);
            }
        }
    };

    // Character animations
    const triggerAshaEmotion = (emotion: AshaState, duration = 3000) => {
        setAshaState(emotion);
        setTimeout(() => {
            if (emotion === 'ubuntu-enlightened') return;
            setAshaState('reflecting');
        }, duration);
    };

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
            'savings-circle': { ...prev['savings-circle'], joined: true }
        }));
        
        setUbuntuMetrics(prev => ({ 
            ...prev, 
            trustLevel: prev.trustLevel + 20, 
            contributionsMade: prev.contributionsMade + 1,
            generosityScore: prev.generosityScore + 10
        }));
        triggerAshaEmotion('participating');
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
                        turnReceived: true, 
                        trustBuilt: true,
                        completed: true 
                    }
                }));
                
                triggerAshaEmotion('contributing');
                showUbuntuPopup("Your turn! The community remembers. Trust creates wealth without exploitation.", 'success');
                
                setTimeout(() => advanceToNextZone(), 3000);
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
                tradesCompleted: prev['market-web'].tradesCompleted + 1,
                qrScanned: true,
                peerToPeerUnderstood: prev['market-web'].tradesCompleted >= 2,
                completed: prev['market-web'].tradesCompleted >= 2
            }
        }));
        
        setUbuntuMetrics(prev => ({ 
            ...prev, 
            connectionsMade: prev.connectionsMade + 1,
            generosityScore: prev.generosityScore + 5
        }));
        triggerAshaEmotion('connecting');
        showUbuntuPopup(`Gift received from ${item.seller}! ${item.story}`, 'trade');
        
        if (zoneProgress['market-web'].tradesCompleted >= 2) {
            setTimeout(() => advanceToNextZone(), 2000);
        }
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
            'village-treasury': { ...prev['village-treasury'], donated: true }
        }));
        
        setUbuntuMetrics(prev => ({ 
            ...prev, 
            contributionsMade: prev.contributionsMade + 1,
            communityImpact: prev.communityImpact + 500,
            generosityScore: prev.generosityScore + 15
        }));
        
        triggerAshaEmotion('contributing');
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
                voted: true,
                transparencySeen: true,
                completed: prev['village-treasury'].donated
            }
        }));
        
        const project = communityProjects.find(p => p.id === projectId);
        showUbuntuPopup(`Voted for ${project?.name}! Community decides together.`, 'collective');
        
        if (zoneProgress['village-treasury'].donated) {
            setTimeout(() => advanceToNextZone(), 2000);
        }
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
                    routesExplored: prev['lightning-circle'].routesExplored + 1,
                    fastPaymentSent: route.speed === 'fast',
                    scaleUnderstood: true,
                    completed: true
                }
            }));
            
            triggerAshaEmotion('ubuntu-enlightened');
            showUbuntuPopup(`Payment sent! ${route.story}. Ubuntu scales globally.`, 'lightning');
            
            setTimeout(() => setGameComplete(true), 4000);
        }, route.speed === 'fast' ? 500 : route.speed === 'medium' ? 2000 : 3000);
    };

    const advanceToNextZone = () => {
        const zones: ZoneType[] = ['savings-circle', 'market-web', 'village-treasury', 'lightning-circle'];
        const currentIndex = zones.indexOf(currentZone);
        if (currentIndex < zones.length - 1) {
            const nextZone = zones[currentIndex + 1];
            setCurrentZone(nextZone);
            setAshaState('reflecting');
            zoneStartTime.current = Date.now();
        }
    };

    const handleTooltipShow = (message: string, event: React.MouseEvent<HTMLElement>) => {
        setShowTooltip({ message, x: event.clientX, y: event.clientY });
    };

    const handleTooltipHide = () => {
        setShowTooltip(null);
    };

    // Render intro conversation
    const renderIntroConversation = () => {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #541400 0%, #7A1E00 50%, #A32D00 100%)" }}>
                <div className="max-w-4xl w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-4">The Ubuntu Village</h1>
                        <p className="text-orange-300 text-lg">Where ancient wisdom meets modern technology</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Asha (exhausted) */}
                        <div className="text-center">
                            <img src={ashaImageUrl} 
                                 alt="Asha" 
                                 className={`w-32 h-32 mx-auto rounded-full border-4 border-red-600 shadow-lg mb-4 ${ashaState === 'exhausted' ? 'opacity-70' : ''}`} />
                            <h3 className="text-xl font-bold text-white mb-2">Asha</h3>
                            <p className="text-orange-300 text-sm mb-4">Tired from broken money systems</p>
                            {conversationStep > 0 && (
                                <div className="bg-orange-100 text-red-800 p-4 rounded-lg border-l-4 border-red-600">
                                    "{ashaDialogue[Math.min(conversationStep - 1, ashaDialogue.length - 1)]}"
                                </div>
                            )}
                        </div>
                        
                        {/* Odu (wise elder) */}
                        <div className="text-center">
                            <div className="w-32 h-32 mx-auto rounded-full border-4 border-orange-500 flex items-center justify-center text-6xl bg-red-900 mb-4">
                                👴🏿
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Elder Odu</h3>
                            <p className="text-orange-300 text-sm mb-4">Keeper of Ubuntu wisdom</p>
                            {conversationStep > 0 && (
                                <div className="bg-orange-100 text-red-800 p-4 rounded-lg border-l-4 border-orange-500">
                                    "{oduDialogue[Math.min(conversationStep - 1, oduDialogue.length - 1)]}"
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {conversationStep < ashaDialogue.length ? (
                        <div className="text-center">
                            <button onClick={advanceConversation} 
                                    className="bg-red-600 hover:bg-orange-500 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg">
                                {conversationStep === 0 ? '🤝 Begin the Conversation' : '👂 Continue Listening'}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="text-orange-400 text-lg mb-4">Elder Odu gestures toward the village...</div>
                            <div className="text-white text-xl italic">"Come, let Ubuntu guide Bitcoin back to its true purpose."</div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Render character
    const renderAsha = () => {
        const hasUbuntuGlow = currentZone === 'lightning-circle' && ashaState === 'ubuntu-enlightened';
        
        return (
            <div 
                className={`character ${ashaState} absolute bottom-20 left-20 cursor-pointer transition-all duration-1000`}
                onMouseEnter={(e) => handleTooltipShow('Asha discovers Ubuntu economics through Bitcoin', e)}
                onMouseLeave={handleTooltipHide}
            >
                <img 
                    src={ashaImageUrl} 
                    alt="Asha" 
                    className={`w-20 h-20 object-cover rounded-full border-4 border-red-600 shadow-lg ${hasUbuntuGlow ? 'shadow-orange-400/70' : 'shadow-red-600/50'}`}
                />
                {hasUbuntuGlow && (
                    <>
                        <div className="absolute inset-0 rounded-full border-2 border-orange-400 animate-ping opacity-30"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-orange-300 animate-ping opacity-20" style={{ animationDelay: '0.5s' }}></div>
                    </>
                )}
            </div>
        );
    };

    if (gameComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ background: ZONES['lightning-circle'].background }}>
                <div className="bg-red-900 text-white rounded-3xl shadow-2xl p-8 max-w-6xl w-full animate-fadeIn border border-red-600">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-4 text-orange-400">Bitcoin + Ubuntu = Scalable Humanity</h2>
                        <div className="text-6xl mb-4">🤝⚡🌍</div>
                        <p className="text-orange-300">"I am because we are - now connecting every village on Earth"</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="text-center">
                            <img src={ashaImageUrl} 
                                 alt="Asha Enlightened" 
                                 className="w-32 h-32 mx-auto rounded-full border-4 border-orange-400 shadow-lg mb-4 animate-pulse" />
                            <h3 className="text-xl font-bold text-orange-400 mb-2">Asha - Ubuntu Enlightened</h3>
                            <div className="bg-orange-100 text-red-800 p-4 rounded-lg">
                                <p className="italic">"Now I understand... Bitcoin doesn't replace Ubuntu economics - it scales them globally. Trust without borders, generosity without limits."</p>
                            </div>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-32 h-32 mx-auto rounded-full border-4 border-orange-500 flex items-center justify-center text-6xl bg-red-800 mb-4">
                                👴🏿
                            </div>
                            <h3 className="text-xl font-bold text-orange-500 mb-2">Elder Odu - Satisfied</h3>
                            <div className="bg-orange-100 text-red-800 p-4 rounded-lg">
                                <p className="italic">"Bitcoin remembers what the banks forgot: money should serve community, not exploit it. Ubuntu teaches, technology enables."</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto mb-8">
                        <table className="w-full bg-red-800 rounded-lg">
                            <thead>
                                <tr className="bg-red-900">
                                    <th className="p-4 text-left font-semibold text-orange-400">Ubuntu Principle</th>
                                    <th className="p-4 text-center font-semibold text-orange-300">Traditional Village</th>
                                    <th className="p-4 text-center font-semibold text-orange-500">Bitcoin Implementation</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-red-700">
                                    <td className="p-4 font-medium text-white">Trust Building</td>
                                    <td className="p-4 text-center text-orange-300">Community memory & honor</td>
                                    <td className="p-4 text-center text-orange-500">Cryptographic signatures & nodes</td>
                                </tr>
                                <tr className="border-b border-red-700">
                                    <td className="p-4 font-medium text-white">Wealth Definition</td>
                                    <td className="p-4 text-center text-orange-300">Having enough to share</td>
                                    <td className="p-4 text-center text-orange-500">P2P without intermediaries</td>
                                </tr>
                                <tr className="border-b border-red-700">
                                    <td className="p-4 font-medium text-white">Status System</td>
                                    <td className="p-4 text-center text-orange-300">Generosity & contribution</td>
                                    <td className="p-4 text-center text-orange-500">Network effect & adoption</td>
                                </tr>
                                <tr className="border-b border-red-700">
                                    <td className="p-4 font-medium text-white">Record Keeping</td>
                                    <td className="p-4 text-center text-orange-300">Collective memory</td>
                                    <td className="p-4 text-center text-orange-500">Immutable blockchain ledger</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium text-white">Scale</td>
                                    <td className="p-4 text-center text-orange-300">Village-bound</td>
                                    <td className="p-4 text-center text-orange-400">Global village network</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-red-800 rounded-lg p-4 text-center">
                            <div className="text-2xl text-orange-400">🤝</div>
                            <div className="text-sm text-orange-300">Ubuntu Trust</div>
                            <div className="text-orange-400">{ubuntuMetrics.trustLevel}%</div>
                        </div>
                        <div className="bg-red-800 rounded-lg p-4 text-center">
                            <div className="text-2xl text-orange-500">🎯</div>
                            <div className="text-sm text-orange-300">Contributions</div>
                            <div className="text-orange-500">{ubuntuMetrics.contributionsMade}</div>
                        </div>
                        <div className="bg-red-800 rounded-lg p-4 text-center">
                            <div className="text-2xl text-orange-400">🌍</div>
                            <div className="text-sm text-orange-300">Community Impact</div>
                            <div className="text-orange-400">{ubuntuMetrics.communityImpact} sats</div>
                        </div>
                        <div className="bg-red-800 rounded-lg p-4 text-center">
                            <div className="text-2xl text-orange-500">⚡</div>
                            <div className="text-sm text-orange-300">Global Connections</div>
                            <div className="text-orange-500">{ubuntuMetrics.connectionsMade}</div>
                        </div>
                    </div>
                    
                    <div className="text-center space-y-4">
                        <div className="text-lg text-orange-400 font-medium">
                            "Ubuntu values, Bitcoin scale. The circle of trust now spans the globe."
                        </div>
                        <div className="text-orange-300">
                            Ancient wisdom meets modern technology - proving that the future of money is deeply human.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (gamePhase === 'intro') {
        return renderIntroConversation();
    }

    return (
        <div className="scene-background min-h-screen relative overflow-hidden" style={{ background: ZONES[currentZone].background }}>
            {/* Ubuntu-inspired styling and animations */}
            <style>{`
                .ubuntu-pattern {
                    background-image: 
                        radial-gradient(circle at 20% 80%, rgba(255, 109, 77, 0.2) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 155, 133, 0.2) 0%, transparent 50%);
                }
                
                .character.exhausted {
                    animation: exhausted-sway 3s ease-in-out infinite;
                }
                
                .character.reflecting {
                    animation: thoughtful-nod 2s ease-in-out infinite;
                }
                
                .character.participating {
                    animation: participating 1.5s ease-in-out;
                }
                
                .character.contributing {
                    animation: contributing 1.2s ease-in-out;
                }
                
                .character.connecting {
                    animation: connecting 1s ease-in-out;
                }
                
                .character.ubuntu-enlightened {
                    animation: ubuntu-enlightened 2s ease-in-out infinite;
                }
                
                @keyframes exhausted-sway {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-2px) rotate(-1deg); }
                }
                
                @keyframes thoughtful-nod {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
                
                @keyframes participating {
                    0%, 100% { transform: translateY(0) scale(1); }
                    25% { transform: translateY(-8px) scale(1.05); }
                    50% { transform: translateY(-4px) scale(1.1); }
                    75% { transform: translateY(-8px) scale(1.05); }
                }
                
                @keyframes contributing {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    25% { transform: scale(1.1) rotate(-2deg); }
                    75% { transform: scale(1.1) rotate(2deg); }
                }
                
                @keyframes connecting {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                
                @keyframes ubuntu-enlightened {
                    0%, 100% { transform: scale(1); filter: brightness(1) hue-rotate(0deg); }
                    50% { transform: scale(1.05); filter: brightness(1.3) hue-rotate(20deg); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out;
                }
            `}</style>

            {/* Ubuntu insights popup */}
            {showPopup && (
                <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 max-w-lg">
                    <div className={`p-6 rounded-lg shadow-2xl animate-fadeIn border-2 ubuntu-pattern ${
                        showPopup.type === 'ubuntu' ? 'bg-red-900 border-red-600 text-white' :
                        showPopup.type === 'trade' ? 'bg-orange-600 border-orange-400 text-red-900' :
                        showPopup.type === 'collective' ? 'bg-red-600 border-orange-500 text-white' :
                        showPopup.type === 'lightning' ? 'bg-orange-400 border-orange-300 text-red-900' :
                        showPopup.type === 'success' ? 'bg-red-800 border-red-500 text-white' :
                        'bg-red-800 border-orange-500 text-white'
                    }`}>
                        <div className="text-center">
                            <div className="text-2xl mb-2">🤝</div>
                            <p className="font-medium">{showPopup.message}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tooltip */}
            {showTooltip && (
                <div 
                    className="fixed z-50 bg-red-900 bg-opacity-90 text-orange-400 px-3 py-2 rounded-lg text-sm pointer-events-none transform -translate-x-1/2 whitespace-nowrap border border-red-600"
                    style={{ 
                        left: showTooltip.x, 
                        top: showTooltip.y - 40 
                    }}
                >
                    🤝 {showTooltip.message}
                </div>
            )}

            {/* Zone header */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-red-900 bg-opacity-90 rounded-lg p-4 shadow-lg border border-red-600 ubuntu-pattern">
                    <h1 className="text-xl font-bold text-center text-white">{ZONES[currentZone].title}</h1>
                    <p className="text-sm text-orange-300 text-center">{ZONES[currentZone].description}</p>
                    <div className="text-xs text-orange-400 text-center italic mt-2">"{ZONES[currentZone].ashaThought}"</div>
                </div>
            </div>

            {/* Progress indicators */}
            <div className="absolute top-4 left-4 z-10">
                <div className="bg-red-900 bg-opacity-90 rounded-lg p-3 border border-red-600">
                    <div className="flex space-x-2">
                        {Object.keys(ZONES).map((zone) => (
                            <div
                                key={zone}
                                className={`w-3 h-3 rounded-full ${
                                    zoneProgress[zone as ZoneType].completed ? 'bg-orange-400' :
                                    zone === currentZone ? 'bg-orange-500' :
                                    'bg-red-800'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Ubuntu wallet */}
            <div className="absolute top-4 right-4 z-10">
                <div className="bg-red-900 bg-opacity-90 rounded-lg p-4 min-w-[200px] border border-red-600 ubuntu-pattern">
                    <h3 className="font-semibold mb-2 text-orange-400">🤝 Ubuntu Wallet</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-orange-300">Sats:</span>
                            <span className="text-white font-mono">{userSats.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-orange-300">Trust:</span>
                            <span className="text-orange-400">{ubuntuMetrics.trustLevel}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-orange-300">Generosity:</span>
                            <span className="text-orange-500">{ubuntuMetrics.generosityScore}</span>
                        </div>
                        {currentZone === 'savings-circle' && roscaState.userJoined && (
                            <div className="flex justify-between items-center">
                                <span className="text-orange-300">Ubuntu Turn:</span>
                                <span className="text-orange-400">Week {roscaState.userTurn}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Zone-specific content - keeping original structure but with Ubuntu styling */}
            <div className="absolute inset-0 flex items-center justify-center z-0">
                <div className="max-w-6xl w-full px-4">
                    {currentZone === 'savings-circle' && (
                        <div className="text-center space-y-8">
                            <div className="text-6xl">🌳</div>
                            <div className="text-white text-xl mb-4">
                                Ubuntu Savings Circle - Trust Without Banks
                            </div>
                            
                            <div className={`w-32 h-32 mx-auto bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl ${roscaState.userJoined ? 'animate-pulse' : ''}`}>
                                {roscaState.potAmount.toLocaleString()} sats
                            </div>
                            
                            {!roscaState.userJoined ? (
                                <div className="space-y-4">
                                    <div className="bg-orange-100 text-red-800 p-4 rounded-lg max-w-md mx-auto">
                                        <p className="italic">"Remember, child - we give first, receive later. No interest, no paperwork, just Ubuntu trust."</p>
                                        <p className="text-sm mt-2">- Elder Odu</p>
                                    </div>
                                    <button
                                        onClick={joinROSCA}
                                        disabled={userSats < 1000}
                                        className={`bg-red-600 hover:bg-orange-500 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 ${
                                            userSats < 1000 ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        🤝 Join Ubuntu Circle (1000 sats)
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-orange-400 text-lg">
                                        ✅ You're in the circle! Week {roscaState.currentWeek}
                                    </div>
                                    <div className="text-orange-300">
                                        Your Ubuntu turn: Week {roscaState.userTurn}
                                    </div>
                                    <div className="bg-orange-100 text-red-800 p-4 rounded-lg max-w-md mx-auto">
                                        <p className="italic">"Watch how trust multiplies without banks taking their cut."</p>
                                    </div>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
                                {communityMembers.map(member => (
                                    <div key={member.id} className="bg-red-900 bg-opacity-60 rounded-lg p-4 border border-orange-500">
                                        <div className="text-2xl mb-2">{member.emoji}</div>
                                        <div className="text-white text-sm">{member.name}</div>
                                        <div className="text-orange-400 text-xs">{member.contribution} sats</div>
                                        <div className="text-orange-300 text-xs">{member.relationship}</div>
                                        <div className="text-orange-500 text-xs">Trust: {member.trustScore}%</div>
                                        {member.receivedTurn && (
                                            <div className="text-xs text-orange-400">✅ Received</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentZone === 'market-web' && (
                        <div className="text-center space-y-8">
                            <div className="text-6xl">🏪</div>
                            <div className="text-white text-xl mb-4">
                                Ubuntu Market - Gifts and Gratitude Flow
                            </div>
                            
                            <div className="bg-orange-100 text-red-800 p-4 rounded-lg max-w-lg mx-auto mb-6">
                                <p className="italic">"No buying and selling here - we share abundance and accept gratitude. Ubuntu teaches: wealth means having enough to share."</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {tradeItems.map(item => (
                                    <div key={item.id} className={`bg-red-900 bg-opacity-60 rounded-lg p-6 border border-orange-500 ${
                                        !item.available ? 'opacity-50' : ''
                                    }`}>
                                        <div className="text-4xl mb-2">{item.emoji}</div>
                                        <div className="text-white text-lg">{item.name}</div>
                                        <div className="text-orange-300 text-sm mb-2">From {item.seller}</div>
                                        <div className="text-orange-400 text-lg mb-2">🙏 {item.price} sats gratitude</div>
                                        <div className="text-xs text-orange-300 mb-4 italic">{item.story}</div>
                                        
                                        {item.available ? (
                                            <button
                                                onClick={() => scanQRCode(item.id)}
                                                className="w-full bg-orange-500 hover:bg-orange-400 text-red-900 py-3 rounded-lg transition-all transform hover:scale-105"
                                            >
                                                🤝 Accept Gift
                                            </button>
                                        ) : (
                                            <div className="text-orange-400 text-center py-3">
                                                ✅ Ubuntu Exchange Complete
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            {zoneProgress['market-web'].tradesCompleted > 0 && (
                                <div className="text-orange-400 text-lg">
                                    ✅ Ubuntu exchanges: {zoneProgress['market-web'].tradesCompleted}/3
                                </div>
                            )}
                        </div>
                    )}

                    {currentZone === 'village-treasury' && (
                        <div className="text-center space-y-8">
                            <div className="text-6xl">🏛️</div>
                            <div className="text-white text-xl mb-4">
                                Ubuntu Treasury - Community Decides Together
                            </div>
                            
                            <div className="bg-orange-100 text-red-800 p-4 rounded-lg max-w-lg mx-auto mb-6">
                                <p className="italic">"Every satoshi visible, every decision together. No hidden bank fees, no mysterious funds. Ubuntu transparency."</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {communityProjects.map(project => (
                                    <div key={project.id} className={`bg-red-900 bg-opacity-60 rounded-lg p-6 border border-orange-500 ${
                                        selectedProject === project.id ? 'border-orange-400' : ''
                                    }`}>
                                        <div className="text-3xl mb-2">{project.emoji}</div>
                                        <div className="text-white text-lg font-semibold">{project.name}</div>
                                        <div className="text-orange-300 text-sm mb-2">{project.description}</div>
                                        <div className="text-xs text-orange-400 italic mb-4">"{project.ubuntuValue}"</div>
                                        
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-orange-300">Ubuntu Progress</span>
                                                <span className="text-white">{Math.round((project.raised / project.cost) * 100)}%</span>
                                            </div>
                                            <div className="w-full bg-red-800 rounded-full h-3">
                                                <div 
                                                    className="bg-orange-400 h-3 rounded-full transition-all"
                                                    style={{ width: `${(project.raised / project.cost) * 100}%` }}
                                                />
                                            </div>
                                            <div className="text-xs text-orange-300 mt-1">
                                                {project.raised.toLocaleString()} / {project.cost.toLocaleString()} sats
                                            </div>
                                        </div>
                                        
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => donateToProject(project.id)}
                                                disabled={userSats < 500}
                                                className={`flex-1 bg-red-600 hover:bg-orange-500 text-white py-2 rounded transition-all ${
                                                    userSats < 500 ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                            >
                                                🤝 Give 500
                                            </button>
                                            <button
                                                onClick={() => voteForProject(project.id)}
                                                className="flex-1 bg-orange-400 hover:bg-orange-300 text-red-900 py-2 rounded transition-all"
                                            >
                                                🗳️ Vote ({project.votes})
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentZone === 'lightning-circle' && (
                        <div className="text-center space-y-8">
                            <div className="text-6xl">⚡</div>
                            <div className="text-white text-xl mb-4">
                                Lightning Circle - Ubuntu Without Borders
                            </div>
                            
                            <div className="bg-orange-100 text-red-800 p-4 rounded-lg max-w-lg mx-auto mb-6">
                                <p className="italic">"Ubuntu wisdom, global reach. 'I am because we are' - now connecting every village on Earth through Bitcoin's Lightning."</p>
                            </div>
                            
                            <div className="text-orange-300 text-lg mb-6">
                                Send 1000 sats to our sister Ubuntu village in Kenya
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {lightningRoutes.map(route => (
                                    <button
                                        key={route.id}
                                        onClick={() => selectLightningRoute(route.id)}
                                        disabled={!route.available}
                                        className={`bg-red-900 bg-opacity-60 rounded-lg p-6 border border-orange-500 hover:border-orange-400 transition-all transform hover:scale-105 ${
                                            selectedRoute === route.id ? 'border-orange-400 animate-pulse' : ''
                                        } ${!route.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <div className="text-2xl mb-2">
                                            {route.speed === 'fast' ? '🚀' : route.speed === 'medium' ? '🚗' : '🤝'}
                                        </div>
                                        <div className="text-white text-lg mb-2">{route.hops} hop{route.hops > 1 ? 's' : ''}</div>
                                        <div className="text-orange-400 text-sm mb-2">
                                            {route.fee === 0 ? '🎁 Free (Ubuntu cooperative)' : `Fee: ${route.fee} sats`}
                                        </div>
                                        <div className={`text-sm ${
                                            route.speed === 'fast' ? 'text-orange-400' :
                                            route.speed === 'medium' ? 'text-orange-300' :
                                            'text-orange-500'
                                        } mb-3`}>
                                            {route.speed} route
                                        </div>
                                        
                                        <div className="mt-3 text-xs text-orange-300">
                                            {route.path.join(' → ')}
                                        </div>
                                        
                                        <div className="text-xs text-orange-400 mt-2 italic">
                                            {route.story}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            
                            {selectedRoute && (
                                <div className="text-orange-400 text-lg">
                                    ⚡ Ubuntu payment routing through Lightning Network...
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Character */}
            {renderAsha()}

            {/* Zone stats */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-red-900 bg-opacity-90 rounded-lg px-6 py-2 border border-red-600 ubuntu-pattern">
                    <div className="flex items-center space-x-6 text-sm text-orange-300">
                        <span>Zone {ZONES[currentZone].id}/4</span>
                        <span>Trust: {ubuntuMetrics.trustLevel}%</span>
                        <span>Impact: {ubuntuMetrics.communityImpact}</span>
                        <span className="text-orange-400">{ZONES[currentZone].mood.toUpperCase()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CircleOfTrustSimulation;