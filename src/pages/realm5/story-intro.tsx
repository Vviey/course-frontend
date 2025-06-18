import React, { useState, useEffect, useRef } from 'react';

// Simple types for the governance game
type GovernancePhase = 'rule-editor' | 'node-network' | 'consensus-vote' | 'fork-choice' | 'upgrade-ceremony';
type AshaState = 'confused' | 'hopeful' | 'voting' | 'shocked' | 'enlightened';
type NodeType = 'player' | 'economic' | 'mining' | 'dev' | 'user';

interface Node {
    id: string;
    name: string;
    type: NodeType;
    emoji: string;
    vote: 'yes' | 'no' | 'abstain';
    influence: number;
    region: string;
}

interface Proposal {
    id: string;
    title: string;
    description: string;
    proposedBy: string;
    support: number;
    opposition: number;
    controversy: number;
}

interface GovernanceScore {
    proposalsSubmitted: number;
    consensusBuilt: number;
    forksWitnessed: number;
    upgradesParticipated: number;
}

const GovernancePlayground = () => {
    // Game state
    const [currentPhase, setCurrentPhase] = useState<GovernancePhase>('rule-editor');
    const [ashaState, setAshaState] = useState<AshaState>('confused');
    const [playerNode, setPlayerNode] = useState<Node>({
        id: 'asha-node',
        name: 'Asha\'s Node',
        type: 'player',
        emoji: '👧🏽',
        vote: 'abstain',
        influence: 1,
        region: 'Learning Realm'
    });
    
    const [networkNodes, setNetworkNodes] = useState<Node[]>([
        { id: 'miner1', name: 'Mining Pool Alpha', type: 'mining', emoji: '⚒️', vote: 'abstain', influence: 3, region: 'Asia' },
        { id: 'exchange1', name: 'Big Exchange', type: 'economic', emoji: '🏦', vote: 'abstain', influence: 4, region: 'America' },
        { id: 'dev1', name: 'Core Developer', type: 'dev', emoji: '👨‍💻', vote: 'abstain', influence: 2, region: 'Europe' },
        { id: 'user1', name: 'Bitcoin Users', type: 'user', emoji: '👥', vote: 'abstain', influence: 5, region: 'Global' },
        { id: 'business1', name: 'Bitcoin Business', type: 'economic', emoji: '🏢', vote: 'abstain', influence: 3, region: 'America' }
    ]);
    
    const [currentProposal, setCurrentProposal] = useState<Proposal | null>(null);
    const [playerProposal, setPlayerProposal] = useState('');
    const [consensusThreshold, setConsensusThreshold] = useState(95);
    const [score, setScore] = useState<GovernanceScore>({
        proposalsSubmitted: 0,
        consensusBuilt: 0,
        forksWitnessed: 0,
        upgradesParticipated: 0
    });
    
    const [gameMessage, setGameMessage] = useState('');
    const [showCelebration, setShowCelebration] = useState(false);
    const [forkHappening, setForkHappening] = useState(false);
    const [networkSplit, setNetworkSplit] = useState(false);
    
    const votingTimer = useRef<NodeJS.Timeout | null>(null);
    const [votingTimeLeft, setVotingTimeLeft] = useState(15);

    // Governance proposals - simplified but realistic
    const proposalTemplates = [
        {
            title: 'Increase Block Size to 2MB',
            description: 'Double the transaction capacity',
            controversy: 8
        },
        {
            title: 'Add Smart Contracts',
            description: 'Enable programmable Bitcoin',
            controversy: 7
        },
        {
            title: 'Change to Proof of Stake',
            description: 'Replace mining with staking',
            controversy: 10
        },
        {
            title: 'Privacy Improvements',
            description: 'Make transactions more private',
            controversy: 4
        },
        {
            title: 'Faster Block Times',
            description: 'Reduce block time to 5 minutes',
            controversy: 6
        }
    ];

    // Initialize phase
    useEffect(() => {
        if (currentPhase === 'node-network') {
            startNodeNetwork();
        } else if (currentPhase === 'consensus-vote') {
            startConsensusVote();
        } else if (currentPhase === 'fork-choice') {
            startForkChoice();
        }
    }, [currentPhase]);

    // Voting timer
    useEffect(() => {
        if (votingTimeLeft > 0 && currentPhase === 'consensus-vote') {
            const timer = setTimeout(() => setVotingTimeLeft(votingTimeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (votingTimeLeft === 0 && currentPhase === 'consensus-vote') {
            handleVotingComplete();
        }
    }, [votingTimeLeft, currentPhase]);

    const startNodeNetwork = () => {
        setGameMessage("🌐 Welcome to the Bitcoin network! You're now running a node. Every node has a voice!");
        setAshaState('hopeful');
    };

    const startConsensusVote = () => {
        const template = proposalTemplates[Math.floor(Math.random() * proposalTemplates.length)];
        setCurrentProposal({
            id: Date.now().toString(),
            title: template.title,
            description: template.description,
            proposedBy: 'Community Member',
            support: 0,
            opposition: 0,
            controversy: template.controversy
        });
        
        setVotingTimeLeft(15);
        setGameMessage("🗳️ A proposal is being voted on! Cast your vote and see how the network responds!");
        setAshaState('voting');
        
        // Reset all votes
        setNetworkNodes(prev => prev.map(n => ({ ...n, vote: 'abstain' })));
        setPlayerNode(prev => ({ ...prev, vote: 'abstain' }));
    };

    const startForkChoice = () => {
        setGameMessage("⚠️ The network is split! Some nodes disagree. What happens next?");
        setAshaState('shocked');
        setNetworkSplit(true);
    };

    const handleRuleEdit = () => {
        if (!playerProposal.trim()) return;
        
        setScore(prev => ({ ...prev, proposalsSubmitted: prev.proposalsSubmitted + 1 }));
        setGameMessage(`📝 You proposed: "${playerProposal}" - But wait... nothing happened to Bitcoin! You need network agreement!`);
        setAshaState('confused');
        
        setTimeout(() => {
            setGameMessage("💡 Aha! In Bitcoin, you can't just change rules by yourself. You need the NETWORK to agree!");
            setTimeout(() => advancePhase(), 3000);
        }, 3000);
    };

    const handlePlayerVote = (vote: 'yes' | 'no') => {
        setPlayerNode(prev => ({ ...prev, vote }));
        
        // Simulate network voting based on controversy
        const simulateNetworkVoting = () => {
            setNetworkNodes(prev => prev.map(node => {
                const randomFactor = Math.random();
                const controversyFactor = currentProposal!.controversy / 10;
                
                // More controversial = more likely to vote no
                if (node.type === 'dev') {
                    return { ...node, vote: randomFactor > controversyFactor * 0.7 ? 'yes' : 'no' };
                } else if (node.type === 'mining') {
                    return { ...node, vote: randomFactor > controversyFactor * 0.6 ? 'yes' : 'no' };
                } else if (node.type === 'economic') {
                    return { ...node, vote: randomFactor > controversyFactor * 0.8 ? 'yes' : 'no' };
                } else {
                    return { ...node, vote: randomFactor > controversyFactor * 0.5 ? 'yes' : 'no' };
                }
            }));
        };
        
        setTimeout(simulateNetworkVoting, 1000);
        setGameMessage(`🗳️ You voted ${vote.toUpperCase()}! Watching how the network responds...`);
    };

    const handleVotingComplete = () => {
        const allNodes = [...networkNodes, playerNode];
        const yesVotes = allNodes.filter(n => n.vote === 'yes').length;
        const totalVotes = allNodes.filter(n => n.vote !== 'abstain').length;
        const supportPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
        
        if (supportPercentage >= consensusThreshold) {
            setScore(prev => ({ ...prev, consensusBuilt: prev.consensusBuilt + 1 }));
            setShowCelebration(true);
            setGameMessage(`🎉 Consensus reached! ${supportPercentage.toFixed(1)}% support! The proposal passes!`);
            setAshaState('enlightened');
            
            setTimeout(() => {
                setShowCelebration(false);
                advancePhase();
            }, 3000);
        } else {
            setGameMessage(`❌ No consensus. Only ${supportPercentage.toFixed(1)}% support. Bitcoin needs overwhelming agreement!`);
            
            if (supportPercentage > 30 && supportPercentage < 70) {
                setTimeout(() => {
                    setGameMessage("⚠️ The community is split! This could lead to a fork...");
                    setTimeout(() => advancePhase(), 2000);
                }, 2000);
            } else {
                setTimeout(() => advancePhase(), 3000);
            }
        }
    };

    const handleForkDecision = (choice: 'original' | 'new') => {
        setScore(prev => ({ ...prev, forksWitnessed: prev.forksWitnessed + 1 }));
        setForkHappening(true);
        
        if (choice === 'original') {
            setGameMessage("🛤️ You chose to stay with Original Bitcoin. The new fork splits off...");
        } else {
            setGameMessage("🛤️ You chose the New Bitcoin. You're on the minority fork...");
        }
        
        setTimeout(() => {
            setGameMessage("💡 Both chains exist now! This is how Bitcoin Cash, Bitcoin SV, and others were born!");
            setAshaState('enlightened');
            setTimeout(() => advancePhase(), 4000);
        }, 3000);
    };

    const advancePhase = () => {
        const phases: GovernancePhase[] = ['rule-editor', 'node-network', 'consensus-vote', 'fork-choice', 'upgrade-ceremony'];
        const currentIndex = phases.indexOf(currentPhase);
        
        if (currentIndex < phases.length - 1) {
            setCurrentPhase(phases[currentIndex + 1]);
            setGameMessage('');
            setForkHappening(false);
            setNetworkSplit(false);
        }
    };

    // Victory screen
    if (currentPhase === 'upgrade-ceremony') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4"
                 style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                <div className="bg-gray-900 text-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full border border-purple-500">
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4 animate-bounce">🏛️👑⚖️</div>
                        <h2 className="text-3xl font-bold mb-4 text-purple-400">
                            Governance Master Asha!
                        </h2>
                        <p className="text-lg text-gray-300 mb-6">
                            "Now I understand! Bitcoin governs itself through consensus, not commands!"
                        </p>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-8">
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                            <div className="text-2xl text-purple-400 mb-2">📝</div>
                            <div className="text-lg font-semibold text-purple-300">{score.proposalsSubmitted}</div>
                            <div className="text-sm text-gray-400">Proposals Made</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                            <div className="text-2xl text-green-400 mb-2">🤝</div>
                            <div className="text-lg font-semibold text-green-300">{score.consensusBuilt}</div>
                            <div className="text-sm text-gray-400">Consensus Built</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                            <div className="text-2xl text-orange-400 mb-2">🛤️</div>
                            <div className="text-lg font-semibold text-orange-300">{score.forksWitnessed}</div>
                            <div className="text-sm text-gray-400">Forks Witnessed</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                            <div className="text-2xl text-blue-400 mb-2">⚡</div>
                            <div className="text-lg font-semibold text-blue-300">{score.upgradesParticipated}</div>
                            <div className="text-sm text-gray-400">Upgrades Joined</div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 mb-8">
                        <h3 className="text-purple-400 font-semibold mb-4">🎓 What Asha Learned:</h3>
                        <div className="space-y-3 text-gray-300">
                            <div className="flex items-center space-x-3">
                                <div className="text-green-400">✅</div>
                                <div>No one person can change Bitcoin's rules</div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="text-green-400">✅</div>
                                <div>Every node operator has a voice in governance</div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="text-green-400">✅</div>
                                <div>Consensus requires overwhelming agreement (~95%)</div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="text-green-400">✅</div>
                                <div>Disagreement leads to forks, not forced changes</div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="text-green-400">✅</div>
                                <div>Bitcoin evolves slowly and carefully</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 mb-8">
                        <h3 className="text-orange-400 font-semibold mb-4">🔄 The Governance Cycle:</h3>
                        <div className="flex justify-between items-center text-sm">
                            <div className="text-center">
                                <div className="text-2xl mb-2">💡</div>
                                <div className="text-orange-300">Idea</div>
                            </div>
                            <div className="text-orange-400">→</div>
                            <div className="text-center">
                                <div className="text-2xl mb-2">📝</div>
                                <div className="text-purple-300">Proposal</div>
                            </div>
                            <div className="text-purple-400">→</div>
                            <div className="text-center">
                                <div className="text-2xl mb-2">🗳️</div>
                                <div className="text-blue-300">Voting</div>
                            </div>
                            <div className="text-blue-400">→</div>
                            <div className="text-center">
                                <div className="text-2xl mb-2">🤝</div>
                                <div className="text-green-300">Consensus</div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        <div className="text-lg text-purple-300 font-medium">
                            "No rulers needed when everyone agrees on the rules!"
                        </div>
                        <button
                            onClick={() => window.location.href = '/realm/5'}
                            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
                        >
                            🏛️ Ready for Advanced Governance!
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden"
             style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #667eea 100%)" }}>
            
            {/* Game header */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-black bg-opacity-80 rounded-lg p-4 border border-purple-400">
                    <h1 className="text-xl font-bold text-center text-purple-400">
                        🏛️ Asha's Governance Playground
                    </h1>
                    <p className="text-sm text-gray-300 text-center">
                        Learn Bitcoin governance by participating!
                    </p>
                </div>
            </div>

            {/* Score display */}
            <div className="absolute top-4 right-4 z-10">
                <div className="bg-black bg-opacity-80 rounded-lg p-3 border border-purple-400">
                    <div className="text-purple-400 text-sm font-semibold">Governance Score</div>
                    <div className="text-white text-xs">
                        Proposals: {score.proposalsSubmitted} | Consensus: {score.consensusBuilt}
                    </div>
                </div>
            </div>

            {/* Timer for voting */}
            {currentPhase === 'consensus-vote' && (
                <div className="absolute top-4 left-4 z-10">
                    <div className="bg-black bg-opacity-80 rounded-lg p-3 border border-blue-400">
                        <div className="text-blue-400 text-lg font-bold text-center">
                            🗳️ {votingTimeLeft}s
                        </div>
                    </div>
                </div>
            )}

            {/* Main game area */}
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="max-w-6xl w-full">
                    
                    {/* Rule editor phase */}
                    {currentPhase === 'rule-editor' && (
                        <div className="text-center space-y-8">
                            <div className="text-8xl animate-bounce">📜</div>
                            <h2 className="text-4xl font-bold text-white">
                                The Bitcoin Rule Book
                            </h2>
                            <div className="bg-black bg-opacity-60 rounded-xl p-6 border border-purple-400">
                                <p className="text-xl text-gray-200 mb-4">
                                    "Here are Bitcoin's rules. What if you want to change something?"
                                </p>
                                <p className="text-purple-300 mb-4">
                                    Try proposing a change to Bitcoin!
                                </p>
                                <div className="flex space-x-4 max-w-2xl mx-auto">
                                    <input
                                        type="text"
                                        value={playerProposal}
                                        onChange={(e) => setPlayerProposal(e.target.value)}
                                        placeholder="Your proposed change..."
                                        className="flex-1 p-3 bg-gray-700 text-white rounded border border-gray-600"
                                    />
                                    <button
                                        onClick={handleRuleEdit}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded font-semibold"
                                    >
                                        📝 Propose Change
                                    </button>
                                </div>
                            </div>
                            {gameMessage && (
                                <div className="text-orange-300 text-lg max-w-2xl mx-auto">
                                    {gameMessage}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Node network phase */}
                    {currentPhase === 'node-network' && (
                        <div className="text-center space-y-8">
                            <div className="text-8xl animate-pulse">🌐</div>
                            <h2 className="text-4xl font-bold text-white">
                                Join the Bitcoin Network
                            </h2>
                            <div className="bg-black bg-opacity-60 rounded-xl p-6 border border-purple-400">
                                <p className="text-xl text-gray-200 mb-6">
                                    {gameMessage}
                                </p>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-blue-800 rounded-lg p-4 border border-blue-400">
                                        <div className="text-blue-400 font-semibold mb-2">
                                            {playerNode.emoji} {playerNode.name}
                                        </div>
                                        <div className="text-sm text-gray-300">
                                            Type: {playerNode.type}
                                        </div>
                                        <div className="text-sm text-gray-300">
                                            Region: {playerNode.region}
                                        </div>
                                    </div>

                                    {networkNodes.slice(0, 5).map(node => (
                                        <div key={node.id} className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                                            <div className="text-gray-300 font-semibold mb-2">
                                                {node.emoji} {node.name}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {node.type} • {node.region}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <button
                                    onClick={() => advancePhase()}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg"
                                >
                                    🌐 Join Network & Start Voting
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Consensus voting phase */}
                    {currentPhase === 'consensus-vote' && currentProposal && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-white mb-4">
                                    🗳️ Network Voting Session
                                </h2>
                                <div className="text-purple-300 text-lg mb-6">{gameMessage}</div>
                            </div>

                            {/* The proposal */}
                            <div className="bg-gray-800 rounded-xl p-6 border border-purple-400 max-w-3xl mx-auto">
                                <h3 className="text-purple-400 text-xl font-semibold mb-4">
                                    📋 Proposal on the Table:
                                </h3>
                                <h4 className="text-white text-lg mb-2">{currentProposal.title}</h4>
                                <p className="text-gray-300 mb-4">{currentProposal.description}</p>
                                <p className="text-yellow-300 text-sm mb-4">
                                    ⚠️ Controversy Level: {currentProposal.controversy}/10
                                </p>
                                
                                {playerNode.vote === 'abstain' ? (
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => handlePlayerVote('yes')}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold"
                                        >
                                            ✅ Vote YES
                                        </button>
                                        <button
                                            onClick={() => handlePlayerVote('no')}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold"
                                        >
                                            ❌ Vote NO
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className={`text-lg font-semibold ${
                                            playerNode.vote === 'yes' ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                            You voted: {playerNode.vote.toUpperCase()}
                                        </div>
                                        <div className="text-gray-400 text-sm">Waiting for network...</div>
                                    </div>
                                )}
                            </div>

                            {/* Network nodes voting */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {networkNodes.map(node => (
                                    <div key={node.id} className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                                        <div className="text-gray-300 font-semibold mb-2">
                                            {node.emoji} {node.name}
                                        </div>
                                        <div className="text-xs text-gray-400 mb-2">
                                            {node.type} • Influence: {node.influence}
                                        </div>
                                        <div className={`text-sm font-semibold ${
                                            node.vote === 'yes' ? 'text-green-400' :
                                            node.vote === 'no' ? 'text-red-400' : 'text-gray-400'
                                        }`}>
                                            {node.vote === 'abstain' ? 'Thinking...' : node.vote.toUpperCase()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Fork choice phase */}
                    {currentPhase === 'fork-choice' && (
                        <div className="text-center space-y-8">
                            <div className="text-8xl animate-ping">🛤️</div>
                            <h2 className="text-4xl font-bold text-white">
                                The Network Splits!
                            </h2>
                            <div className="bg-black bg-opacity-60 rounded-xl p-6 border border-orange-400">
                                <p className="text-xl text-gray-200 mb-6">
                                    {gameMessage}
                                </p>
                                <p className="text-orange-300 mb-6">
                                    Two groups disagree! Bitcoin is forking into two chains. Which do you follow?
                                </p>
                                
                                <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                                    <button
                                        onClick={() => handleForkDecision('original')}
                                        className="bg-orange-600 bg-opacity-20 border border-orange-500 rounded-lg p-6 hover:bg-opacity-30 transition-all"
                                    >
                                        <div className="text-3xl mb-2">₿</div>
                                        <div className="text-orange-400 font-semibold">Original Bitcoin</div>
                                        <div className="text-sm text-gray-300">Keep current rules</div>
                                        <div className="text-xs text-gray-400">Majority support</div>
                                    </button>
                                    
                                    <button
                                        onClick={() => handleForkDecision('new')}
                                        className="bg-purple-600 bg-opacity-20 border border-purple-500 rounded-lg p-6 hover:bg-opacity-30 transition-all"
                                    >
                                        <div className="text-3xl mb-2">🆕</div>
                                        <div className="text-purple-400 font-semibold">New Bitcoin</div>
                                        <div className="text-sm text-gray-300">Changed rules</div>
                                        <div className="text-xs text-gray-400">Minority support</div>
                                    </button>
                                </div>
                            </div>
                            
                            {forkHappening && (
                                <div className="text-yellow-300 text-lg">
                                    🛤️ Fork in progress... Two separate Bitcoin networks now exist!
                                </div>
                            )}
                        </div>
                    )}

                    {/* Celebration overlay */}
                    {showCelebration && (
                        <div className="absolute inset-0 flex items-center justify-center z-50">
                            <div className="bg-green-900 bg-opacity-90 rounded-xl p-8 border border-green-400 text-center">
                                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                                <h3 className="text-2xl font-bold text-green-400 mb-2">Consensus Achieved!</h3>
                                <p className="text-green-200">The network agreed! Bitcoin successfully upgraded!</p>
                            </div>
                        </div>
                    )}

                    {/* Asha character */}
                    <div className="absolute bottom-8 right-8">
                        <div className={`text-6xl transition-all duration-500 ${
                            ashaState === 'confused' ? 'animate-pulse' :
                            ashaState === 'hopeful' ? 'animate-bounce' :
                            ashaState === 'voting' ? '' :
                            ashaState === 'shocked' ? 'animate-ping' : 'animate-spin'
                        }`}>
                            {ashaState === 'confused' ? '🤔👧🏽' :
                             ashaState === 'hopeful' ? '🤩👧🏽' :
                             ashaState === 'voting' ? '🗳️👧🏽' :
                             ashaState === 'shocked' ? '😲👧🏽' : '✨👧🏽‍⚗️'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GovernancePlayground;