import React, { useState, useEffect, useRef } from 'react';

// Type definitions
type ZoneType = 'memory-grove' | 'use-case-gallery' | 'intention-gate' | 'ledger-echoes';
type AshaState = 'neutral' | 'reflecting' | 'inspired' | 'committed' | 'sovereign';
type RealmTotem = 'shells' | 'cityscape' | 'key' | 'flame' | 'node' | 'cowrie-web' | 'mirror';
type IntentionType = 'save' | 'node' | 'educate' | 'build' | 'tools' | 'learn' | 'custom';

interface RealmMemory {
    id: string;
    name: string;
    emoji: string;
    totem: RealmTotem;
    essence: string;
    keyLesson: string;
    emotionalJourney: string;
    completed: boolean;
}

interface UseCaseProfile {
    id: string;
    name: string;
    location: string;
    age: number;
    emoji: string;
    role: string;
    beforeBitcoin: string;
    howTheyUse: string;
    whatChanged: string;
    impact: string;
    unlocked: boolean;
}

interface Intention {
    id: IntentionType;
    label: string;
    description: string;
    emoji: string;
    nextSteps: string[];
}

interface LearnerCertificate {
    name: string;
    realmsCompleted: number;
    totalChallenges: number;
    completionDate: string;
    chosenIntention: string;
    uniqueId: string;
    status: string;
}

interface ZoneProgress {
    'memory-grove': { totemsReviewed: number; journeyReflected: boolean; completed: boolean };
    'use-case-gallery': { profilesExplored: number; realityUnderstood: boolean; completed: boolean };
    'intention-gate': { intentionChosen: boolean; pathCommitted: boolean; completed: boolean };
    'ledger-echoes': { certificateGenerated: boolean; shareable: boolean; completed: boolean };
}

interface TooltipData {
    message: string;
    x: number;
    y: number;
}

// Zone configurations
const ZONES: Record<ZoneType, {
    id: number;
    title: string;
    background: string;
    description: string;
    mood: string;
}> = {
    'memory-grove': {
        id: 1,
        title: "The Memory Grove",
        background: "linear-gradient(135deg, #0c4a6e 0%, #1e40af 30%, #7c3aed 70%, #a855f7 100%)",
        description: "Sacred forest where your journey lives eternal",
        mood: "reflective"
    },
    'use-case-gallery': {
        id: 2,
        title: "The Use Case Gallery",
        background: "linear-gradient(135deg, #065f46 0%, #047857 30%, #dc2626 70%, #ef4444 100%)",
        description: "Hall of portraits showing Bitcoin in action",
        mood: "inspiring"
    },
    'intention-gate': {
        id: 3,
        title: "The Intention Gate",
        background: "linear-gradient(135deg, #7c2d12 0%, #ea580c 30%, #f59e0b 70%, #fbbf24 100%)",
        description: "Glowing circle where purpose crystallizes",
        mood: "decisive"
    },
    'ledger-echoes': {
        id: 4,
        title: "The Ledger of Echoes",
        background: "linear-gradient(135deg, #1f2937 0%, #374151 30%, #6b7280 70%, #d1d5db 100%)",
        description: "Eternal scroll of your sovereign journey",
        mood: "eternal"
    }
};

const MirrorOfValueSimulation = () => {
    // Character image URLs
    const [ashaImageUrl] = useState('YOUR_ASHA_IMAGE_URL_HERE');
    
    // Game state
    const [currentZone, setCurrentZone] = useState<ZoneType>('memory-grove');
    const [ashaState, setAshaState] = useState<AshaState>('neutral');
    const [selectedTotem, setSelectedTotem] = useState<string | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
    const [chosenIntention, setChosenIntention] = useState<IntentionType | null>(null);
    const [customIntention, setCustomIntention] = useState('');
    const [learnerName, setLearnerName] = useState('SovereignLearner');
    
    const [realmMemories] = useState<RealmMemory[]>([
        {
            id: 'realm1',
            name: 'Winds of Trade',
            emoji: '🟨',
            totem: 'shells',
            essence: 'From barter to digital control',
            keyLesson: 'Money evolved, but freedom was lost',
            emotionalJourney: 'Curiosity → Understanding → Concern',
            completed: true
        },
        {
            id: 'realm2',
            name: 'Watching Walls',
            emoji: '🟣',
            totem: 'cityscape',
            essence: 'Digital convenience becomes digital cage',
            keyLesson: 'Every tap is tracked, every choice judged',
            emotionalJourney: 'Convenience → Unease → Resistance',
            completed: true
        },
        {
            id: 'realm3',
            name: 'Spark Beneath Stone',
            emoji: '🔶',
            totem: 'key',
            essence: 'Bitcoin emerges as alternative',
            keyLesson: 'Permissionless money for all',
            emotionalJourney: 'Discovery → Wonder → Hope',
            completed: true
        },
        {
            id: 'realm4',
            name: 'Fire Beneath Ledger',
            emoji: '⚒️',
            totem: 'flame',
            essence: 'Mining forges consensus',
            keyLesson: 'Energy becomes digital security',
            emotionalJourney: 'Confusion → Clarity → Appreciation',
            completed: true
        },
        {
            id: 'realm5',
            name: 'Code Council',
            emoji: '🟣',
            totem: 'node',
            essence: 'No rulers, just rules',
            keyLesson: 'Governance through consensus',
            emotionalJourney: 'Skepticism → Understanding → Empowerment',
            completed: true
        },
        {
            id: 'realm6',
            name: 'Circle of Trust',
            emoji: '🟢',
            totem: 'cowrie-web',
            essence: 'Ubuntu meets Bitcoin',
            keyLesson: 'Community trust scales globally',
            emotionalJourney: 'Recognition → Connection → Ubuntu',
            completed: true
        }
    ]);
    
    const [useCaseProfiles] = useState<UseCaseProfile[]>([
        {
            id: 'chioma',
            name: 'Chioma',
            location: 'Lagos, Nigeria',
            age: 23,
            emoji: '👩🏿‍💼',
            role: 'Student & Freelancer',
            beforeBitcoin: 'Watching naira lose value, unable to save effectively',
            howTheyUse: 'Receives payments in Bitcoin, saves in cold storage',
            whatChanged: 'Financial sovereignty despite currency chaos',
            impact: 'Escaped inflation, built real savings',
            unlocked: false
        },
        {
            id: 'kwame',
            name: 'Kwame',
            location: 'Accra, Ghana',
            age: 35,
            emoji: '👨🏿‍🎨',
            role: 'Digital Artist',
            beforeBitcoin: 'Lost 30% to fees sending money internationally',
            howTheyUse: 'Sells art globally with Lightning Network',
            whatChanged: 'Direct payments from collectors worldwide',
            impact: 'Income increased 200%, creative freedom expanded',
            unlocked: false
        },
        {
            id: 'amara',
            name: 'Amara',
            location: 'Nairobi, Kenya',
            age: 28,
            emoji: '👩🏾‍🏫',
            role: 'School Administrator',
            beforeBitcoin: 'Corruption ate 40% of education funding',
            howTheyUse: 'Transparent Bitcoin donations for school supplies',
            whatChanged: 'Parents can verify every transaction',
            impact: '500 children now have proper textbooks',
            unlocked: false
        },
        {
            id: 'fatima',
            name: 'Fatima',
            location: 'Cairo, Egypt',
            age: 31,
            emoji: '👩🏽‍💻',
            role: 'Software Developer',
            beforeBitcoin: 'Banking restrictions limited freelance work',
            howTheyUse: 'Runs Lightning node, builds Bitcoin tools',
            whatChanged: 'Part of global Bitcoin development community',
            impact: 'Building financial freedom for Africa',
            unlocked: false
        },
        {
            id: 'jabari',
            name: 'Jabari',
            location: 'Johannesburg, South Africa',
            age: 40,
            emoji: '👨🏿‍🌾',
            role: 'Farmer & Entrepreneur',
            beforeBitcoin: 'Excluded from traditional banking system',
            howTheyUse: 'Accepts Bitcoin for organic produce sales',
            whatChanged: 'Direct trade with urban Bitcoin users',
            impact: 'Sustainable farming, circular Bitcoin economy',
            unlocked: false
        },
        {
            id: 'zara',
            name: 'Zara',
            location: 'Kigali, Rwanda',
            age: 26,
            emoji: '👩🏾‍💼',
            role: 'Bitcoin Educator',
            beforeBitcoin: 'Saw families lose savings to devaluation',
            howTheyUse: 'Teaches Bitcoin literacy in communities',
            whatChanged: 'Hundreds now hold their own keys',
            impact: 'Building generational wealth knowledge',
            unlocked: false
        }
    ]);
    
    const [intentions] = useState<Intention[]>([
        {
            id: 'save',
            label: 'Start Saving',
            description: 'Begin building sovereign wealth',
            emoji: '💰',
            nextSteps: ['Get a hardware wallet', 'Start DCA strategy', 'Learn cold storage']
        },
        {
            id: 'node',
            label: 'Run a Node',
            description: 'Participate in consensus',
            emoji: '🟠',
            nextSteps: ['Download Bitcoin Core', 'Learn about Lightning', 'Join node communities']
        },
        {
            id: 'educate',
            label: 'Educate Others',
            description: 'Share Bitcoin knowledge',
            emoji: '📚',
            nextSteps: ['Study deeper concepts', 'Join local meetups', 'Create content']
        },
        {
            id: 'build',
            label: 'Build with Lightning',
            description: 'Create Bitcoin applications',
            emoji: '⚡',
            nextSteps: ['Learn Lightning protocols', 'Study APIs', 'Build first app']
        },
        {
            id: 'tools',
            label: 'Use Non-KYC Tools',
            description: 'Maintain financial privacy',
            emoji: '🔒',
            nextSteps: ['Research DEX options', 'Learn P2P trading', 'Practice OPSEC']
        },
        {
            id: 'learn',
            label: 'Ask More Questions',
            description: 'Deepen understanding',
            emoji: '🤔',
            nextSteps: ['Read Bitcoin books', 'Follow developers', 'Experiment safely']
        }
    ]);
    
    const [zoneProgress, setZoneProgress] = useState<ZoneProgress>({
        'memory-grove': { totemsReviewed: 0, journeyReflected: false, completed: false },
        'use-case-gallery': { profilesExplored: 0, realityUnderstood: false, completed: false },
        'intention-gate': { intentionChosen: false, pathCommitted: false, completed: false },
        'ledger-echoes': { certificateGenerated: false, shareable: false, completed: false }
    });
    
    const [showTooltip, setShowTooltip] = useState<TooltipData | null>(null);
    const [showPopup, setShowPopup] = useState<{ message: string; type: string } | null>(null);
    const [gameComplete, setGameComplete] = useState(false);
    const [certificate, setCertificate] = useState<LearnerCertificate | null>(null);
    
    const zoneStartTime = useRef(Date.now());

    // Character animations
    const triggerAshaEmotion = (emotion: AshaState, duration = 4000) => {
        setAshaState(emotion);
        setTimeout(() => {
            if (emotion === 'sovereign') return;
            setAshaState('neutral');
        }, duration);
    };

    const showWisdomPopup = (message: string, type = 'wisdom', duration = 5000) => {
        setShowPopup({ message, type });
        setTimeout(() => setShowPopup(null), duration);
    };

    // Zone 1: Memory Grove - Review journey
    const reviewTotem = (realmId: string) => {
        const realm = realmMemories.find(r => r.id === realmId);
        if (!realm) return;
        
        setSelectedTotem(realmId);
        
        setZoneProgress(prev => ({
            ...prev,
            'memory-grove': { 
                ...prev['memory-grove'], 
                totemsReviewed: prev['memory-grove'].totemsReviewed + 1
            }
        }));
        
        triggerAshaEmotion('reflecting');
        showWisdomPopup(`${realm.essence}. ${realm.keyLesson}`, 'memory');
        
        if (zoneProgress['memory-grove'].totemsReviewed >= 5) {
            setTimeout(() => {
                setZoneProgress(prev => ({
                    ...prev,
                    'memory-grove': { 
                        ...prev['memory-grove'], 
                        journeyReflected: true,
                        completed: true
                    }
                }));
                showWisdomPopup("Learning is a journey. Remember your steps.", 'wisdom');
                setTimeout(() => advanceToNextZone(), 3000);
            }, 2000);
        }
    };

    // Zone 2: Use Case Gallery - Real stories
    const exploreProfile = (profileId: string) => {
        const profile = useCaseProfiles.find(p => p.id === profileId);
        if (!profile) return;
        
        setSelectedProfile(profileId);
        
        // Unlock the profile
        const updatedProfiles = useCaseProfiles.map(p => 
            p.id === profileId ? { ...p, unlocked: true } : p
        );
        
        setZoneProgress(prev => ({
            ...prev,
            'use-case-gallery': { 
                ...prev['use-case-gallery'], 
                profilesExplored: prev['use-case-gallery'].profilesExplored + 1
            }
        }));
        
        triggerAshaEmotion('inspired');
        
        if (zoneProgress['use-case-gallery'].profilesExplored >= 2) {
            setTimeout(() => {
                setZoneProgress(prev => ({
                    ...prev,
                    'use-case-gallery': { 
                        ...prev['use-case-gallery'], 
                        realityUnderstood: true,
                        completed: true
                    }
                }));
                showWisdomPopup("Bitcoin is not for someday. It is for today.", 'reality');
                setTimeout(() => advanceToNextZone(), 3000);
            }, 2000);
        }
    };

    // Zone 3: Intention Gate - Choose path
    const selectIntention = (intentionId: IntentionType) => {
        setChosenIntention(intentionId);
        
        setZoneProgress(prev => ({
            ...prev,
            'intention-gate': { 
                ...prev['intention-gate'], 
                intentionChosen: true
            }
        }));
        
        triggerAshaEmotion('committed');
    };

    const commitToPath = () => {
        if (!chosenIntention && !customIntention) return;
        
        setZoneProgress(prev => ({
            ...prev,
            'intention-gate': { 
                ...prev['intention-gate'], 
                pathCommitted: true,
                completed: true
            }
        }));
        
        showWisdomPopup("This is your path. You are your own bank now.", 'commitment');
        setTimeout(() => advanceToNextZone(), 3000);
    };

    // Zone 4: Ledger of Echoes - Certificate
    const generateCertificate = () => {
        const cert: LearnerCertificate = {
            name: learnerName,
            realmsCompleted: 7,
            totalChallenges: 24,
            completionDate: new Date().toLocaleDateString(),
            chosenIntention: chosenIntention ? intentions.find(i => i.id === chosenIntention)?.label || customIntention : customIntention,
            uniqueId: `BTC_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            status: 'Sovereign'
        };
        
        setCertificate(cert);
        
        setZoneProgress(prev => ({
            ...prev,
            'ledger-echoes': { 
                certificateGenerated: true,
                shareable: true,
                completed: true
            }
        }));
        
        triggerAshaEmotion('sovereign');
        setTimeout(() => setGameComplete(true), 4000);
    };

    const advanceToNextZone = () => {
        const zones: ZoneType[] = ['memory-grove', 'use-case-gallery', 'intention-gate', 'ledger-echoes'];
        const currentIndex = zones.indexOf(currentZone);
        if (currentIndex < zones.length - 1) {
            const nextZone = zones[currentIndex + 1];
            setCurrentZone(nextZone);
            zoneStartTime.current = Date.now();
        }
    };

    const handleTooltipShow = (message: string, event: React.MouseEvent<HTMLElement>) => {
        setShowTooltip({ message, x: event.clientX, y: event.clientY });
    };

    const handleTooltipHide = () => {
        setShowTooltip(null);
    };

    // Render character
    const renderAsha = () => {
        const isSovereign = ashaState === 'sovereign';
        
        return (
            <div 
                className={`character ${ashaState} absolute bottom-20 left-20 cursor-pointer transition-all duration-2000`}
                onMouseEnter={(e) => handleTooltipShow('Asha, now sovereign and free', e)}
                onMouseLeave={handleTooltipHide}
            >
                {ashaImageUrl && ashaImageUrl !== 'YOUR_ASHA_IMAGE_URL_HERE' ? (
                    <img 
                        src={ashaImageUrl} 
                        alt="Asha" 
                        className={`w-20 h-20 object-cover rounded-full border-4 ${isSovereign ? 'border-yellow-400' : 'border-blue-400'} shadow-lg ${isSovereign ? 'shadow-yellow-400/70' : 'shadow-blue-400/50'}`}
                    />
                ) : (
                    <div className={`text-6xl ${isSovereign ? 'animate-pulse' : ''}`}>
                        {isSovereign ? '👑' : '👧🏽'}
                    </div>
                )}
                {isSovereign && (
                    <>
                        <div className="absolute inset-0 rounded-full border-2 border-yellow-400 animate-ping opacity-30"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-orange-400 animate-ping opacity-20" style={{ animationDelay: '0.7s' }}></div>
                        <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-15" style={{ animationDelay: '1.4s' }}></div>
                    </>
                )}
            </div>
        );
    };

    if (gameComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%)' }}>
                <div className="text-center space-y-8 animate-fadeIn">
                    <div className="text-6xl mb-8 animate-pulse">✨</div>
                    
                    <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-8">
                        You do not need permission to be free.
                    </h1>
                    
                    <div className="text-xl text-gray-300 mb-12">
                        What you carry now, no one can take.
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                        >
                            🔁 Replay Journey
                        </button>
                        
                        <button
                            onClick={() => window.open('https://bitcoin.org', '_blank')}
                            className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white font-bold py-4 px-8 rounded-xl hover:from-orange-700 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg"
                        >
                            🚀 Real Bitcoin Tools
                        </button>
                        
                        <button
                            onClick={() => window.open('https://bitcoinerjobs.com', '_blank')}
                            className="bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold py-4 px-8 rounded-xl hover:from-green-700 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg"
                        >
                            🌐 Join Community
                        </button>
                    </div>
                    
                    <div className="mt-12 text-lg text-gray-400">
                        <p>Bitcoin is not just code.</p>
                        <p>It's memory. It's resistance. It's hope.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="scene-background min-h-screen relative overflow-hidden" style={{ background: ZONES[currentZone].background }}>
            {/* Reflection styling and animations */}
            <style>{`
                .character.reflecting {
                    animation: reflecting 2s ease-in-out;
                }
                
                .character.inspired {
                    animation: inspired 1.5s ease-in-out;
                }
                
                .character.committed {
                    animation: committed 1.2s ease-in-out;
                }
                
                .character.sovereign {
                    animation: sovereign 3s ease-in-out infinite;
                }
                
                @keyframes reflecting {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-10px) scale(1.05); filter: brightness(1.2); }
                }
                
                @keyframes inspired {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    25% { transform: scale(1.1) rotate(-3deg); }
                    75% { transform: scale(1.1) rotate(3deg); }
                }
                
                @keyframes committed {
                    0%, 100% { transform: translateX(0) scale(1); }
                    25% { transform: translateX(-8px) scale(1.05); }
                    75% { transform: translateX(8px) scale(1.05); }
                }
                
                @keyframes sovereign {
                    0%, 100% { transform: scale(1); filter: brightness(1) hue-rotate(0deg); }
                    33% { transform: scale(1.05); filter: brightness(1.3) hue-rotate(120deg); }
                    66% { transform: scale(1.02); filter: brightness(1.1) hue-rotate(240deg); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 1s ease-out;
                }
                
                .totem-glow {
                    animation: totem-pulse 3s ease-in-out infinite;
                }
                
                @keyframes totem-pulse {
                    0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.4); transform: scale(1); }
                    50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.8); transform: scale(1.02); }
                }
                
                .profile-unlock {
                    animation: profile-reveal 1s ease-out;
                }
                
                @keyframes profile-reveal {
                    0% { opacity: 0; transform: rotateY(90deg); }
                    100% { opacity: 1; transform: rotateY(0deg); }
                }
                
                .intention-select {
                    animation: intention-glow 0.5s ease-out;
                }
                
                @keyframes intention-glow {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); box-shadow: 0 0 30px rgba(251, 191, 36, 0.8); }
                    100% { transform: scale(1.05); }
                }
                
                .certificate-generate {
                    animation: certificate-appear 2s ease-out;
                }
                
                @keyframes certificate-appear {
                    0% { opacity: 0; transform: scale(0.8) translateY(20px); }
                    50% { opacity: 0.5; transform: scale(1.1) translateY(-10px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                
                .wisdom-text {
                    text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
                }
            `}</style>

            {/* Wisdom popup */}
            {showPopup && (
                <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl">
                    <div className={`p-8 rounded-lg shadow-2xl animate-fadeIn border-2 ${
                        showPopup.type === 'memory' ? 'bg-purple-900 border-purple-400 text-purple-100' :
                        showPopup.type === 'reality' ? 'bg-green-900 border-green-400 text-green-100' :
                        showPopup.type === 'commitment' ? 'bg-orange-900 border-orange-400 text-orange-100' :
                        showPopup.type === 'wisdom' ? 'bg-blue-900 border-blue-400 text-blue-100' :
                        'bg-gray-900 border-gray-400 text-gray-100'
                    }`}>
                        <div className="text-center">
                            <div className="text-3xl mb-4">🟡</div>
                            <p className="font-medium text-lg wisdom-text">{showPopup.message}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tooltip */}
            {showTooltip && (
                <div 
                    className="fixed z-50 bg-black bg-opacity-90 text-yellow-400 px-3 py-2 rounded-lg text-sm pointer-events-none transform -translate-x-1/2 whitespace-nowrap border border-yellow-400"
                    style={{ 
                        left: showTooltip.x, 
                        top: showTooltip.y - 40 
                    }}
                >
                    🟡 {showTooltip.message}
                </div>
            )}

            {/* Zone header */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-black bg-opacity-90 rounded-lg p-6 shadow-lg border border-yellow-400">
                    <h1 className="text-2xl font-bold text-center text-yellow-400">{ZONES[currentZone].title}</h1>
                    <p className="text-sm text-gray-300 text-center mt-2">{ZONES[currentZone].description}</p>
                </div>
            </div>

            {/* Progress indicators */}
            <div className="absolute top-4 left-4 z-10">
                <div className="bg-black bg-opacity-90 rounded-lg p-3 border border-yellow-400">
                    <div className="flex space-x-2">
                        {Object.keys(ZONES).map((zone) => (
                            <div
                                key={zone}
                                className={`w-3 h-3 rounded-full ${
                                    zoneProgress[zone as ZoneType].completed ? 'bg-yellow-500' :
                                    zone === currentZone ? 'bg-orange-500' :
                                    'bg-gray-600'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Zone-specific content */}
            <div className="absolute inset-0 flex items-center justify-center z-0 p-4">
                <div className="max-w-7xl w-full">
                    {currentZone === 'memory-grove' && (
                        <div className="text-center space-y-12">
                            <div className="text-8xl mb-8">🌳</div>
                            <div className="text-white text-2xl mb-8">
                                Your Journey Through the Seven Realms
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                                {realmMemories.map(realm => (
                                    <button
                                        key={realm.id}
                                        onClick={() => reviewTotem(realm.id)}
                                        className={`totem-glow bg-gray-800 bg-opacity-80 rounded-lg p-6 border border-gray-600 hover:border-purple-400 transition-all ${
                                            selectedTotem === realm.id ? 'border-purple-500 bg-opacity-100' : ''
                                        }`}
                                    >
                                        <div className="text-4xl mb-3">{realm.emoji}</div>
                                        <div className="text-purple-400 font-semibold text-sm">{realm.name}</div>
                                        <div className="text-gray-300 text-xs mt-2">{realm.essence}</div>
                                        {selectedTotem === realm.id && (
                                            <div className="mt-3 text-xs text-purple-300">
                                                {realm.emotionalJourney}
                                            </div>
                                        )}
                                    </button>
                                ))}
                                
                                {/* Final totem - The Mirror */}
                                <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg p-6 border border-yellow-400">
                                    <div className="text-4xl mb-3">🪞</div>
                                    <div className="text-yellow-100 font-semibold text-sm">Mirror of Value</div>
                                    <div className="text-yellow-200 text-xs mt-2">You are here</div>
                                </div>
                            </div>
                            
                            <div className="text-purple-300 text-lg mt-8">
                                Totems Reviewed: {zoneProgress['memory-grove'].totemsReviewed}/6
                            </div>
                        </div>
                    )}

                    {currentZone === 'use-case-gallery' && (
                        <div className="text-center space-y-8">
                            <div className="text-6xl">🖼️</div>
                            <div className="text-white text-2xl mb-4">
                                Bitcoin Stories from Africa
                            </div>
                            <div className="text-gray-300 text-lg mb-8">
                                Real people. Real impact. Real today.
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {useCaseProfiles.map(profile => (
                                    <button
                                        key={profile.id}
                                        onClick={() => exploreProfile(profile.id)}
                                        className={`profile-unlock bg-gray-800 bg-opacity-80 rounded-lg p-6 border border-gray-600 hover:border-green-400 transition-all text-left ${
                                            selectedProfile === profile.id ? 'border-green-500 bg-opacity-100' : ''
                                        }`}
                                    >
                                        <div className="flex items-center mb-4">
                                            <div className="text-3xl mr-3">{profile.emoji}</div>
                                            <div>
                                                <div className="text-green-400 font-semibold">{profile.name}</div>
                                                <div className="text-gray-400 text-sm">{profile.location}</div>
                                                <div className="text-gray-500 text-xs">{profile.role}</div>
                                            </div>
                                        </div>
                                        
                                        {selectedProfile === profile.id ? (
                                            <div className="space-y-3 text-sm">
                                                <div>
                                                    <div className="text-red-400 font-medium">Before:</div>
                                                    <div className="text-gray-300">{profile.beforeBitcoin}</div>
                                                </div>
                                                <div>
                                                    <div className="text-orange-400 font-medium">Now:</div>
                                                    <div className="text-gray-300">{profile.howTheyUse}</div>
                                                </div>
                                                <div>
                                                    <div className="text-green-400 font-medium">Impact:</div>
                                                    <div className="text-green-200">{profile.impact}</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-gray-400 text-sm">
                                                Click to explore their Bitcoin story
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="text-green-300 text-lg">
                                Stories Explored: {zoneProgress['use-case-gallery'].profilesExplored}/6
                            </div>
                        </div>
                    )}

                    {currentZone === 'intention-gate' && (
                        <div className="text-center space-y-8">
                            <div className="text-6xl">✨</div>
                            <div className="text-white text-2xl mb-4">
                                Choose Your Path Forward
                            </div>
                            <div className="text-gray-300 text-lg mb-8">
                                What is your Bitcoin intention?
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {intentions.map(intention => (
                                    <button
                                        key={intention.id}
                                        onClick={() => selectIntention(intention.id)}
                                        className={`intention-select bg-gray-800 bg-opacity-80 rounded-lg p-6 border border-gray-600 hover:border-yellow-400 transition-all ${
                                            chosenIntention === intention.id ? 'border-yellow-500 bg-yellow-900 bg-opacity-30' : ''
                                        }`}
                                    >
                                        <div className="text-3xl mb-3">{intention.emoji}</div>
                                        <div className="text-yellow-400 font-semibold text-lg">{intention.label}</div>
                                        <div className="text-gray-300 text-sm mt-2">{intention.description}</div>
                                        
                                        {chosenIntention === intention.id && (
                                            <div className="mt-4 text-xs text-yellow-200">
                                                <div className="font-medium mb-1">Next Steps:</div>
                                                {intention.nextSteps.map((step, index) => (
                                                    <div key={index}>• {step}</div>
                                                ))}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="max-w-md mx-auto mb-8">
                                <input
                                    type="text"
                                    placeholder="Or write your own intention..."
                                    value={customIntention}
                                    onChange={(e) => setCustomIntention(e.target.value)}
                                    className="w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none text-base"
                                />
                            </div>
                            
                            {(chosenIntention || customIntention) && (
                                <button
                                    onClick={commitToPath}
                                    className="bg-gradient-to-r from-yellow-600 to-orange-500 text-white font-bold py-4 px-12 rounded-xl hover:from-yellow-700 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
                                >
                                    🔒 Commit to This Path
                                </button>
                            )}
                        </div>
                    )}

                    {currentZone === 'ledger-echoes' && (
                        <div className="text-center space-y-8">
                            <div className="text-6xl">📜</div>
                            <div className="text-white text-2xl mb-4">
                                Your Sovereign Certificate
                            </div>
                            
                            {!certificate ? (
                                <div className="space-y-6">
                                    <div className="max-w-md mx-auto">
                                        <input
                                            type="text"
                                            placeholder="Enter your Bitcoin name"
                                            value={learnerName}
                                            onChange={(e) => setLearnerName(e.target.value)}
                                            className="w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-gray-400 focus:outline-none text-base"
                                        />
                                    </div>
                                    
                                    <button
                                        onClick={generateCertificate}
                                        className="bg-gradient-to-r from-gray-600 to-gray-500 text-white font-bold py-4 px-8 rounded-xl hover:from-gray-700 hover:to-gray-600 transition-all transform hover:scale-105 shadow-lg"
                                    >
                                        📜 Generate Certificate
                                    </button>
                                </div>
                            ) : (
                                <div className="certificate-generate max-w-2xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border-2 border-yellow-400">
                                    <div className="text-yellow-400 text-2xl font-bold mb-6">Bitcoin Sovereignty Certificate</div>
                                    
                                    <div className="space-y-4 text-left">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Name:</span>
                                            <span className="text-white font-mono">{certificate.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Realms Completed:</span>
                                            <span className="text-green-400">{certificate.realmsCompleted}/7</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Challenges:</span>
                                            <span className="text-blue-400">{certificate.totalChallenges}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Completion Date:</span>
                                            <span className="text-white">{certificate.completionDate}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Chosen Path:</span>
                                            <span className="text-orange-400">{certificate.chosenIntention}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Certificate ID:</span>
                                            <span className="text-purple-400 font-mono text-sm">{certificate.uniqueId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Status:</span>
                                            <span className="text-yellow-400 font-bold">{certificate.status}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 text-center">
                                        <div className="text-gray-300 text-sm mb-4">
                                            "What you carry now, no one can take."
                                        </div>
                                        <button
                                            onClick={() => {
                                                const text = `I completed the Bitcoin sovereignty course! Certificate: ${certificate.uniqueId}`;
                                                navigator.clipboard.writeText(text);
                                            }}
                                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-all"
                                        >
                                            📋 Copy to Share
                                        </button>
                                    </div>
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
                <div className="bg-black bg-opacity-90 rounded-lg px-6 py-2 border border-yellow-400">
                    <div className="flex items-center space-x-6 text-sm text-gray-300">
                        <span>Realm {ZONES[currentZone].id}/4</span>
                        <span>Journey: Complete</span>
                        <span className={`text-${ZONES[currentZone].mood === 'reflective' ? 'purple' : ZONES[currentZone].mood === 'inspiring' ? 'green' : ZONES[currentZone].mood === 'decisive' ? 'orange' : 'gray'}-400`}>
                            {ZONES[currentZone].mood.toUpperCase()}
                        </span>
                        <span className="text-yellow-400">🟡 SOVEREIGN</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MirrorOfValueSimulation;