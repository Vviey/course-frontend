import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "wouter";

type MiningPhase = 'setup' | 'puzzle-race' | 'honest-test' | 'energy-challenge' | 'victory';
type AshaState = 'excited' | 'working' | 'cheering' | 'focused' | 'proud';
type MinerType = 'honest' | 'cheater' | 'player';

interface Miner {
    id: string;
    name: string;
    type: MinerType;
    emoji: string;
    progress: number;
    energy: number;
    isActive: boolean;
}

interface MiningChallenge {
    id: string;
    puzzle: string;
    correctAnswer: string;
    difficulty: number;
    energyCost: number;
}

const MiningPlayground = () => {
    // Game state
    const [currentPhase, setCurrentPhase] = useState<MiningPhase>('setup');
    const [ashaState, setAshaState] = useState<AshaState>('excited');
    const [playerMiner, setPlayerMiner] = useState<Miner>({
        id: 'player',
        name: 'Asha\'s Super Miner 3000',
        type: 'player',
        emoji: '⚒️',
        progress: 0,
        energy: 100,
        isActive: false
    });
    
    const [competitors, setCompetitors] = useState<Miner[]>([
        { id: 'honest1', name: 'Honest Sam', type: 'honest', emoji: '💎', progress: 0, energy: 100, isActive: false },
        { id: 'honest2', name: 'Fair Maya (Coffee Addict)', type: 'honest', emoji: '🔨', progress: 0, energy: 100, isActive: false },
        { id: 'cheater', name: 'Sneaky Pete (Professional Corner-Cutter)', type: 'cheater', emoji: '😈', progress: 0, energy: 100, isActive: false }
    ]);
    
    const [currentChallenge, setCurrentChallenge] = useState<MiningChallenge | null>(null);
    const [playerAnswer, setPlayerAnswer] = useState('');
    const [, setLocation] = useLocation();
    const [score, setScore] = useState({ blocksWon: 0, energySpent: 0, cheatersCaught: 0 });
    const [gameMessage, setGameMessage] = useState('');
    const [showCelebration, setShowCelebration] = useState(false);
    const [ashaJoke, setAshaJoke] = useState('');
    
    const gameTimer = useRef<NodeJS.Timeout | null>(null);
    const [timeLeft, setTimeLeft] = useState(10);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fun jokes and comments
    const ashaJokes = [
        "This is harder than finding matching socks! 🧦",
        "Why do miners need coffee? For that extra hash rate! ☕",
        "I wonder if Bitcoin miners get frequent flyer miles for all those hash flights? ✈️",
        "Mining Bitcoin: It's like solving puzzles, but with more electricity bills! 💡",
        "Proof of Work? More like Proof of 'This Is Actually Pretty Fun!' 🎉",
        "I'm getting so good at this, I might start my own mining pool! 🏊‍♀️",
        "Note to self: Being a miner is cooler than being a mind reader! 🧠",
        "Plot twist: The real treasure was the hashes we made along the way! 💝"
    ];

    const cheaterComments = [
        "Sneaky Pete thinks he's clever, but the network is watching! 👀",
        "Pete's trying to cheat again... Does he know Bitcoin isn't a video game? 🎮",
        "Spoiler alert: Cheating doesn't work in Bitcoin! 📺",
        "Pete's about to learn that Bitcoin has trust issues... with cheaters! 💔"
    ];

    // Mining challenges with a touch of humor
    const challenges: MiningChallenge[] = [
        { id: 'hash1', puzzle: 'Find a number that when added to 42 gives 50 (Hint: It\'s not rocket science!)', correctAnswer: '8', difficulty: 1, energyCost: 10 },
        { id: 'hash2', puzzle: 'What is 7 × 9? (No calculators, but fingers are allowed! 🤚)', correctAnswer: '63', difficulty: 2, energyCost: 15 },
        { id: 'hash3', puzzle: 'Complete the pattern: 2, 4, 8, 16, ___ (It\'s doubling, not your coffee intake!)', correctAnswer: '32', difficulty: 3, energyCost: 20 },
        { id: 'hash4', puzzle: 'How many letters in "BITCOIN"? (Count carefully, no autocorrect here!)', correctAnswer: '7', difficulty: 1, energyCost: 10 },
        { id: 'hash5', puzzle: 'What is 100 - 42? (The answer to life, universe, and everything minus something!)', correctAnswer: '58', difficulty: 1, energyCost: 10 },
        { id: 'hash6', puzzle: 'If a Bitcoin miner mines 1 block every 10 minutes, how many minutes for 2 blocks?', correctAnswer: '20', difficulty: 2, energyCost: 15 },
        { id: 'hash7', puzzle: 'What comes after 20 in this sequence: 5, 10, 15, ___?', correctAnswer: '20', difficulty: 1, energyCost: 10 }
    ];

    // Scroll to current phase
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: document.getElementById(currentPhase)?.offsetTop,
                behavior: 'smooth'
            });
        }
    }, [currentPhase]);

    // Initialize game based on phase
    useEffect(() => {
        if (currentPhase === 'puzzle-race') {
            startPuzzleRace();
        } else if (currentPhase === 'honest-test') {
            startHonestyTest();
        } else if (currentPhase === 'energy-challenge') {
            startEnergyChallenge();
        }
    }, [currentPhase]);

    // Game timer
    useEffect(() => {
        if (timeLeft > 0 && (currentPhase === 'puzzle-race' || currentPhase === 'honest-test')) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            handleTimeUp();
        }
    }, [timeLeft, currentPhase]);

    // Random joke generator
    const showRandomJoke = () => {
        const randomJoke = ashaJokes[Math.floor(Math.random() * ashaJokes.length)];
        setAshaJoke(randomJoke);
        setTimeout(() => setAshaJoke(''), 4000);
    };

    const startPuzzleRace = () => {
        const challenge = challenges[Math.floor(Math.random() * challenges.length)];
        setCurrentChallenge(challenge);
        setTimeLeft(10);
        setPlayerAnswer('');
        setGameMessage("🏁 Mining Race! First to solve the puzzle wins the block! (No pressure! 😅)");
        
        setCompetitors(prev => prev.map(c => ({ ...c, isActive: true, progress: 0 })));
        setPlayerMiner(prev => ({ ...prev, isActive: true, progress: 0 }));
        
        showRandomJoke();
        
        const raceInterval = setInterval(() => {
            setCompetitors(prev => prev.map(miner => {
                if (miner.type === 'honest') {
                    return { ...miner, progress: Math.min(100, miner.progress + Math.random() * 8) };
                } else if (miner.type === 'cheater') {
                    return { ...miner, progress: Math.min(100, miner.progress + Math.random() * 15) };
                }
                return miner;
            }));
        }, 500);
        
        gameTimer.current = raceInterval;
    };

    const startHonestyTest = () => {
        const randomComment = cheaterComments[Math.floor(Math.random() * cheaterComments.length)];
        setGameMessage("🔍 Honesty Test! Can you spot the cheater? (Hint: He's probably wearing a mustache! 🥸)");
        setAshaJoke(randomComment);
        setTimeLeft(8);
        
        setTimeout(() => {
            setGameMessage("😈 Sneaky Pete is trying to submit a fake solution! (Classic Pete move!)");
        }, 2000);
    };

    const startEnergyChallenge = () => {
        setGameMessage("⚡ Energy Challenge! Mining uses real electricity. Choose wisely! (Your electricity bill thanks you!)");
        const challenge = challenges[Math.floor(Math.random() * challenges.length)];
        setCurrentChallenge(challenge);
        setPlayerAnswer('');
        setAshaJoke("Fun fact: Bitcoin miners consume less energy than Christmas lights! 🎄");
    };

    const handlePlayerSubmit = () => {
        if (!currentChallenge) return;
        
        const isCorrect = playerAnswer.toLowerCase().trim() === currentChallenge.correctAnswer.toLowerCase();
        
        if (isCorrect) {
            setScore(prev => ({ 
                ...prev, 
                blocksWon: prev.blocksWon + 1,
                energySpent: prev.energySpent + currentChallenge.energyCost
            }));
            
            setPlayerMiner(prev => ({ 
                ...prev, 
                progress: 100,
                energy: prev.energy - currentChallenge.energyCost
            }));
            
            setShowCelebration(true);
            setAshaState('cheering');
            setGameMessage("🎉 You solved it first! You mined a block and earned Bitcoin! (Cha-ching! 💰)");
            setAshaJoke("I'm on fire! Well, not literally... that would be bad for mining equipment! 🔥");
            
            if (gameTimer.current) clearInterval(gameTimer.current);
            
            setTimeout(() => {
                setShowCelebration(false);
                advancePhase();
            }, 3000);
        } else {
            setGameMessage("❌ Wrong answer! Try again or wait for the timer... (Happens to the best of us!)");
            setAshaJoke("Oops! Even Einstein made mistakes... probably! 🤓");
            setPlayerMiner(prev => ({ 
                ...prev, 
                energy: prev.energy - 5
            }));
        }
    };

    const handleCheaterSpotted = () => {
        setScore(prev => ({ ...prev, cheatersCaught: prev.cheatersCaught + 1 }));
        setGameMessage("🚨 Good eye! You caught the cheater! The network rejects fake blocks! (Take that, Pete!)");
        setAshaState('focused');
        setAshaJoke("Busted! Pete's going to need a new career... maybe selling used cars? 🚗");
        
        setCompetitors(prev => prev.map(c => 
            c.type === 'cheater' ? { ...c, isActive: false, progress: 0 } : c
        ));
        
        setTimeout(() => advancePhase(), 2000);
    };

    const handleTimeUp = () => {
        if (gameTimer.current) clearInterval(gameTimer.current);
        
        const winner = competitors.find(c => c.progress >= 100);
        if (winner) {
            setGameMessage(`⏰ Time's up! ${winner.name} won this round! (Better luck next time!)`);
            setAshaJoke("Note to self: Need to think faster... or drink more coffee! ☕");
        } else {
            setGameMessage("⏰ Time's up! No one solved it fast enough. New puzzle coming... (Plot twist!)");
            setAshaJoke("Looks like we all need to upgrade our brain processors! 🧠💻");
        }
        
        setTimeout(() => advancePhase(), 2000);
    };

    const advancePhase = () => {
        const phases: MiningPhase[] = ['setup', 'puzzle-race', 'honest-test', 'energy-challenge', 'victory'];
        const currentIndex = phases.indexOf(currentPhase);
        
        if (currentIndex < phases.length - 1) {
            setCurrentPhase(phases[currentIndex + 1]);
            setAshaState('excited');
        }
    };

    // Victory screen
    if (currentPhase === 'victory') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-yellow-900 to-yellow-800">
                <div className="bg-yellow-950 text-yellow-50 rounded-3xl shadow-2xl p-8 max-w-4xl w-full border border-yellow-600">
                    <div className="text-center mb-8">
                        <div className="flex justify-center items-center gap-4 mb-4">
                            <img 
                                src="https://bitcoiners.africa/wp-content/uploads/2025/06/asha2.png" 
                                alt="Asha"
                                className="w-24 h-32 object-contain animate-bounce"
                            />
                            <div className="text-6xl">🏆</div>
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-yellow-300">
                            Asha's Mining Mastery Complete! 
                        </h2>
                        <div className="text-6xl mb-4">⚒️💎🎉</div>
                        <p className="text-yellow-200">
                            "Who knew solving puzzles could be this electrifying! ⚡" - Asha
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="bg-yellow-900 rounded-lg p-4 text-center border border-yellow-600">
                            <div className="text-2xl text-yellow-400 mb-2">🏅</div>
                            <div className="text-lg font-semibold text-yellow-300">{score.blocksWon}</div>
                            <div className="text-sm text-yellow-500">Blocks Mined</div>
                            <div className="text-xs text-yellow-600 italic mt-1">
                                {score.blocksWon > 0 ? "Bitcoin billionaire in training!" : "Practice makes perfect!"}
                            </div>
                        </div>
                        <div className="bg-yellow-900 rounded-lg p-4 text-center border border-yellow-600">
                            <div className="text-2xl text-yellow-400 mb-2">⚡</div>
                            <div className="text-lg font-semibold text-yellow-300">{score.energySpent}</div>
                            <div className="text-sm text-yellow-500">Energy Used</div>
                            <div className="text-xs text-yellow-600 italic mt-1">
                                {score.energySpent > 50 ? "Power bill incoming! 💸" : "Eco-friendly miner! 🌱"}
                            </div>
                        </div>
                        <div className="bg-yellow-900 rounded-lg p-4 text-center border border-yellow-600">
                            <div className="text-2xl text-yellow-400 mb-2">🚨</div>
                            <div className="text-lg font-semibold text-yellow-300">{score.cheatersCaught}</div>
                            <div className="text-sm text-yellow-500">Cheaters Busted</div>
                            <div className="text-xs text-yellow-600 italic mt-1">
                                {score.cheatersCaught > 0 ? "Bitcoin detective! 🕵️" : "Trust but verify!"}
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-900 rounded-xl p-6 mb-8 border border-yellow-500">
                        <h3 className="text-yellow-400 font-semibold mb-4">🎓 What Asha Learned (With Style!):</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                                <div className="text-yellow-300">⚒️ <strong>Mining = Puzzle Solving:</strong></div>
                                <div className="text-yellow-200 ml-4">It's like Sudoku, but with money! 🧩💰</div>
                                <div className="text-yellow-300">🏁 <strong>Competition Keeps It Fair:</strong></div>
                                <div className="text-yellow-200 ml-4">Everyone races, best solution wins! 🏃‍♀️</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-yellow-300">🚨 <strong>Network Catches Cheaters:</strong></div>
                                <div className="text-yellow-200 ml-4">Sorry Pete, no shortcuts here! 😅</div>
                                <div className="text-yellow-300">⚡ <strong>Energy = Security:</strong></div>
                                <div className="text-yellow-200 ml-4">Real work = Real value! 💪</div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        <div className="text-lg text-yellow-300 font-medium italic">
                            "Mining Bitcoin: Where math meets money, and somehow it all makes sense!" - Asha 🤓
                        </div>
                        <div className="text-yellow-400 text-sm">
                            Ready to explore more Bitcoin mysteries?
                        </div>
                        <button
                            onClick={() => setLocation('/realm/4')}
                            className="bg-gradient-to-r from-yellow-600 to-orange-500 text-yellow-950 font-bold py-4 px-8 rounded-xl hover:from-yellow-700 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
                        >
                            🚀 Continue Asha's Bitcoin Journey!
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div 
            ref={containerRef}
            className="relative h-screen w-full overflow-y-auto scroll-smooth bg-gradient-to-b from-yellow-900 to-yellow-800"
            style={{
                backgroundImage: `
                    radial-gradient(circle at 20% 30%, rgba(255, 217, 102, 0.1) 0%, transparent 20%),
                    radial-gradient(circle at 80% 70%, rgba(255, 199, 0, 0.1) 0%, transparent 20%)
                `
            }}
        >
            {/* Progress indicator */}
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                <div className="flex gap-2 bg-yellow-950 bg-opacity-90 rounded-full p-2 border border-yellow-600 shadow-lg">
                    {['setup', 'puzzle-race', 'honest-test', 'energy-challenge'].map((phase) => (
                        <button
                            key={phase}
                            onClick={() => setCurrentPhase(phase as MiningPhase)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                                currentPhase === phase ? 'bg-yellow-600 text-black' :
                                phase === 'setup' ? 'bg-yellow-800 text-yellow-400' :
                                'bg-yellow-900 text-yellow-600'
                            }`}
                            title={phase.replace('-', ' ')}
                        >
                            {phase === 'setup' ? '⚒️' :
                             phase === 'puzzle-race' ? '🏁' :
                             phase === 'honest-test' ? '🔍' : '⚡'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Score display */}
            <div className="fixed top-4 right-4 z-50">
                <div className="bg-yellow-950 bg-opacity-90 rounded-lg p-3 border border-yellow-600 shadow-lg">
                    <div className="flex gap-4">
                        <div className="text-center">
                            <div className="text-yellow-400 text-sm">Blocks</div>
                            <div className="text-yellow-200 font-bold">{score.blocksWon}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-yellow-400 text-sm">Energy</div>
                            <div className="text-yellow-200 font-bold">{score.energySpent}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-yellow-400 text-sm">Cheaters</div>
                            <div className="text-yellow-200 font-bold">{score.cheatersCaught}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timer */}
            {(currentPhase === 'puzzle-race' || currentPhase === 'honest-test') && (
                <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-yellow-950 bg-opacity-90 rounded-full px-6 py-2 border border-yellow-500 shadow-lg">
                        <div className="text-yellow-300 font-bold text-lg">
                            ⏳ {timeLeft}s remaining {timeLeft <= 3 ? '(Tick tock! ⏰)' : ''}
                        </div>
                    </div>
                </div>
            )}

            {/* Game sections */}
            <div className="space-y-0">
                {/* Setup section */}
                <section 
                    id="setup"
                    className="min-h-screen flex items-center justify-center p-4 pt-20"
                >
                    <div className="max-w-3xl w-full bg-yellow-950 bg-opacity-80 rounded-3xl p-8 border border-yellow-600 shadow-xl">
                        <div className="text-center space-y-8">
                            <div className="text-8xl animate-bounce text-yellow-500">⚒️</div>
                            <h2 className="text-4xl font-bold text-yellow-300">
                                Welcome to Asha's Mining Bootcamp!
                            </h2>
                            <div className="bg-yellow-900 bg-opacity-60 rounded-xl p-6 border border-yellow-500">
                                <p className="text-xl text-yellow-100 mb-4">
                                    "Those puzzles are the gates. Only the honest and the strong may pass... and maybe those who had enough coffee!"
                                </p>
                                <p className="text-yellow-300">
                                    Ready to try mining, Asha? Solve puzzles faster than the competition! 
                                    (No actual mining helmets required! ⛑️)
                                </p>
                            </div>
                            <button
                                onClick={() => setCurrentPhase('puzzle-race')}
                                className="bg-yellow-600 hover:bg-yellow-700 text-yellow-950 font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                            >
                                🔥 Start Mining Challenge! (Let's dig it! 🏗️)
                            </button>
                        </div>
                    </div>
                </section>

                {/* Puzzle race section */}
                <section 
                    id="puzzle-race"
                    className="min-h-screen flex items-center justify-center p-4 pt-20"
                >
                    {currentChallenge && (
                        <div className="max-w-4xl w-full bg-yellow-950 bg-opacity-80 rounded-3xl p-8 border border-yellow-600 shadow-xl">
                            <div className="space-y-8">
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold text-yellow-300 mb-4">
                                        🏁 Mining Race in Progress! (On your mark, get set, HASH! 🏃‍♀️)
                                    </h2>
                                    <div className="text-yellow-200 text-lg mb-6">{gameMessage}</div>
                                </div>

                                {/* Mining puzzle */}
                                <div className="bg-yellow-900 rounded-xl p-6 border border-yellow-500 max-w-2xl mx-auto">
                                    <h3 className="text-yellow-300 text-xl font-semibold mb-4">
                                        🧩 Mining Puzzle (Brain Power Required! 🧠):
                                    </h3>
                                    <p className="text-yellow-100 text-lg mb-4">{currentChallenge.puzzle}</p>
                                    <div className="flex space-x-4">
                                        <input
                                            type="text"
                                            value={playerAnswer}
                                            onChange={(e) => setPlayerAnswer(e.target.value)}
                                            placeholder="Your genius answer..."
                                            className="flex-1 p-3 bg-yellow-800 text-yellow-100 rounded border border-yellow-600 text-lg placeholder-yellow-500"
                                            onKeyPress={(e) => e.key === 'Enter' && handlePlayerSubmit()}
                                        />
                                        <button
                                            onClick={handlePlayerSubmit}
                                            className="bg-yellow-600 hover:bg-yellow-700 text-yellow-950 px-6 py-3 rounded font-semibold shadow-md"
                                        >
                                            ⚒️ Mine it! 💪
                                        </button>
                                    </div>
                                    <div className="text-yellow-500 text-sm mt-2">
                                        Energy cost: {currentChallenge.energyCost} ⚡ (No refunds! 😄)
                                    </div>
                                </div>

                                {/* Competitor progress */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="bg-yellow-900 rounded-lg p-4 border border-blue-400">
                                        <div className="text-blue-300 font-semibold mb-2">
                                            {playerMiner.emoji} {playerMiner.name}
                                        </div>
                                        <div className="w-full bg-yellow-800 rounded-full h-4 mb-2">
                                            <div className="bg-blue-500 h-4 rounded-full transition-all"
                                                style={{ width: `${playerMiner.progress}%` }}></div>
                                        </div>
                                        <div className="text-xs text-yellow-500">
                                            Energy: {playerMiner.energy}⚡ {playerMiner.energy < 20 ? '(Running low! ⬇️)' : ''}
                                        </div>
                                    </div>

                                    {competitors.map(miner => (
                                        <div key={miner.id} 
                                            className={`bg-yellow-900 rounded-lg p-4 border ${
                                                miner.type === 'cheater' ? 'border-red-400' : 'border-green-400'
                                            }`}>
                                            <div className={`font-semibold mb-2 ${
                                                miner.type === 'cheater' ? 'text-red-300' : 'text-green-300'
                                            }`}>
                                                {miner.emoji} {miner.name}
                                            </div>
                                            <div className="w-full bg-yellow-800 rounded-full h-4 mb-2">
                                                <div className={`h-4 rounded-full transition-all ${
                                                    miner.type === 'cheater' ? 'bg-red-500' : 'bg-green-500'
                                                }`}
                                                    style={{ width: `${miner.progress}%` }}></div>
                                            </div>
                                            <div className="text-xs text-yellow-500">
                                                {miner.type === 'cheater' ? 'Suspicious... 🤔' : 
                                                 miner.name.includes('Coffee') ? 'Caffeine-powered! ☕' : 
                                                 'Working honestly 😇'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Honesty test section */}
                <section 
                    id="honest-test"
                    className="min-h-screen flex items-center justify-center p-4 pt-20"
                >
                    <div className="max-w-3xl w-full bg-yellow-950 bg-opacity-80 rounded-3xl p-8 border border-yellow-600 shadow-xl">
                        <div className="text-center space-y-8">
                            <h2 className="text-3xl font-bold text-yellow-300 mb-4">
                                🔍 Network Security Test (CSI: Bitcoin Edition! 🕵️‍♀️)
                            </h2>
                            <div className="text-yellow-200 text-lg mb-6">{gameMessage}</div>
                            
                            <div className="bg-red-900 bg-opacity-50 rounded-xl p-6 border border-red-400 max-w-2xl mx-auto">
                                <p className="text-yellow-100 text-lg mb-4">
                                    ⚠️ Sneaky Pete is trying to submit a fake solution without doing the work! 
                                    (Classic Pete! 🤦‍♀️)
                                </p>
                                <p className="text-red-300 mb-4">
                                    In Bitcoin, the network automatically checks all work. What should happen?
                                    (Hint: Pete's not getting away with this! 😏)
                                </p>
                                <button
                                    onClick={handleCheaterSpotted}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md"
                                >
                                    🚨 Reject the fake block! (Bye Pete! 👋)
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Energy challenge section */}
                <section 
                    id="energy-challenge"
                    className="min-h-screen flex items-center justify-center p-4 pt-20"
                >
                    {currentChallenge && (
                        <div className="max-w-3xl w-full bg-yellow-950 bg-opacity-80 rounded-3xl p-8 border border-yellow-600 shadow-xl">
                            <div className="text-center space-y-8">
                                <h2 className="text-3xl font-bold text-yellow-300 mb-4">
                                    ⚡ Energy & Effort Challenge (The Final Boss! 👾)
                                </h2>
                                <div className="text-yellow-200 text-lg mb-6">{gameMessage}</div>
                                
                                <div className="bg-yellow-900 rounded-xl p-6 border border-yellow-400 max-w-2xl mx-auto">
                                    <h3 className="text-yellow-300 text-xl font-semibold mb-4">
                                        💡 Final Challenge (No pressure! 😅):
                                    </h3>
                                    <p className="text-yellow-100 text-lg mb-4">{currentChallenge.puzzle}</p>
                                    <p className="text-yellow-300 mb-4">
                                        Remember: Real mining uses real electricity! Your answer represents real work.
                                        (And real electricity bills! 💸)
                                    </p>
                                    <div className="flex space-x-4">
                                        <input
                                            type="text"
                                            value={playerAnswer}
                                            onChange={(e) => setPlayerAnswer(e.target.value)}
                                            placeholder="Your final masterpiece..."
                                            className="flex-1 p-3 bg-yellow-800 text-yellow-100 rounded border border-yellow-600 text-lg placeholder-yellow-500"
                                            onKeyPress={(e) => e.key === 'Enter' && handlePlayerSubmit()}
                                        />
                                        <button
                                            onClick={handlePlayerSubmit}
                                            className="bg-yellow-600 hover:bg-yellow-700 text-yellow-950 px-6 py-3 rounded font-semibold shadow-md"
                                        >
                                            ⚡ Power up! 🔋
                                        </button>
                                    </div>
                                    <div className="text-yellow-500 text-sm mt-2">
                                        This will cost {currentChallenge.energyCost} energy ⚡ 
                                        (Worth every watt! ✨)
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>

            {/* Celebration overlay */}
            {showCelebration && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-yellow-950 bg-opacity-70">
                    <div className="bg-yellow-900 rounded-xl p-8 border border-yellow-400 text-center shadow-2xl">
                        <div className="text-6xl mb-4 animate-bounce text-yellow-300">🎉</div>
                        <h3 className="text-2xl font-bold text-yellow-200 mb-2">Block Mined!</h3>
                        <p className="text-yellow-300">You solved the puzzle first and earned Bitcoin!</p>
                        <p className="text-yellow-500 text-sm mt-2">(Cha-ching! 💰)</p>
                    </div>
                </div>
            )}

            {/* Asha character with jokes */}
            <div className="fixed bottom-8 right-8 z-40">
                <div className={`transition-all duration-500 ${
                    ashaState === 'excited' ? 'animate-bounce' :
                    ashaState === 'working' ? 'animate-pulse' :
                    ashaState === 'cheering' ? 'animate-ping' :
                    ashaState === 'focused' ? '' : 'animate-bounce'
                }`}>
                    <img 
                        src="https://bitcoiners.africa/wp-content/uploads/2025/06/asha2.png" 
                        alt="Asha"
                        className="w-24 h-32 lg:w-32 lg:h-40 object-contain"
                    />
                </div>
                {ashaJoke && (
                    <div className="absolute bottom-full right-0 mb-2 bg-yellow-800 text-yellow-100 p-3 rounded-lg max-w-xs text-sm border border-yellow-500 shadow-lg">
                        <p>{ashaJoke}</p>
                        <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-yellow-800 border-r border-b border-yellow-500"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MiningPlayground;