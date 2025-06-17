import { useState, useEffect } from 'react';
import { 
    Wallet, 
    ArrowRight, 
    Users, 
    Blocks, 
    Shield, 
    Zap, 
    CheckCircle, 
    Clock,
    Pickaxe,
    Network,
    Play,
    RotateCcw
} from 'lucide-react';
import { bioluminescentTheme } from '@/lib/realm-themes';

interface BitcoinSimulationProps {
    onComplete?: () => void;
}

interface Transaction {
    id: number;
    from: string;
    to: string;
    amount: number;
    status: 'created' | 'broadcast' | 'confirmed';
}

interface Block {
    id: number;
    miner: string;
    transactions: number;
    hash: string;
    status: 'new' | 'confirmed';
}

interface Miner {
    id: number;
    name: string;
    mining: boolean;
    solved: boolean;
}

interface SimulationStep {
    title: string;
    description: string;
    component: string;
}

export default function BitcoinSimulation({ onComplete }: BitcoinSimulationProps) {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [miners, setMiners] = useState<Miner[]>([
        { id: 1, name: 'Miner A', mining: false, solved: false },
        { id: 2, name: 'Miner B', mining: false, solved: false },
        { id: 3, name: 'Miner C', mining: false, solved: false }
    ]);

    const steps: SimulationStep[] = [
        {
            title: "Digital Wallets",
            description: "Bitcoin users have digital wallets that store their private keys and Bitcoin addresses.",
            component: "wallets"
        },
        {
            title: "Creating a Transaction",
            description: "Alice wants to send 1 BTC to Bob. She creates a transaction using her digital wallet.",
            component: "transaction"
        },
        {
            title: "Broadcasting to Network",
            description: "The transaction is broadcast to the Bitcoin network where it waits in the mempool.",
            component: "broadcast"
        },
        {
            title: "Miners Compete",
            description: "Miners collect transactions and compete to solve a mathematical puzzle (Proof of Work).",
            component: "mining"
        },
        {
            title: "Block Creation",
            description: "The first miner to solve the puzzle creates a new block and adds it to the blockchain.",
            component: "block"
        },
        {
            title: "Network Consensus",
            description: "Other nodes verify and accept the new block, reaching consensus across the network.",
            component: "consensus"
        },
        {
            title: "Transaction Complete",
            description: "Bob receives the Bitcoin! The transaction is now permanently recorded on the blockchain.",
            component: "complete"
        }
    ];

    const nextStep = (): void => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = (): void => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const resetSimulation = (): void => {
        setCurrentStep(0);
        setIsPlaying(false);
        setTransactions([]);
        setBlocks([]);
        setMiners(miners.map(m => ({ ...m, mining: false, solved: false })));
    };

    const autoPlay = (): void => {
        setIsPlaying(true);
        const interval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev >= steps.length - 1) {
                    setIsPlaying(false);
                    clearInterval(interval);
                    return prev;
                }
                return prev + 1;
            });
        }, 3000);
    };

    // Simulation effects based on current step
    useEffect(() => {
        switch (currentStep) {
            case 1:
                setTransactions([{ id: 1, from: 'Alice', to: 'Bob', amount: 1, status: 'created' }]);
                break;
            case 2:
                setTransactions([{ id: 1, from: 'Alice', to: 'Bob', amount: 1, status: 'broadcast' }]);
                break;
            case 3:
                setMiners(miners.map(m => ({ ...m, mining: true, solved: false })));
                setTimeout(() => {
                    setMiners(prev => prev.map((m, i) => 
                        i === 0 ? { ...m, mining: false, solved: true } : { ...m, mining: false, solved: false }
                    ));
                }, 2000);
                break;
            case 4:
                setBlocks([{ id: 1, miner: 'Miner A', transactions: 1, hash: 'abc123...', status: 'new' }]);
                break;
            case 5:
                setBlocks(prev => prev.map(b => ({ ...b, status: 'confirmed' })));
                break;
            case 6:
                setTransactions(prev => prev.map(t => ({ ...t, status: 'confirmed' })));
                break;
        }
    }, [currentStep]);

    const WalletsComponent = (): JSX.Element => (
        <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border animate-slide-in" style={{ backgroundColor: 'rgba(8, 28, 36, 0.6)', borderColor: `${bioluminescentTheme.colors.primary}40` }}>
                <div className="flex items-center mb-4">
                    <Wallet className="mr-3 h-8 w-8" style={{ color: bioluminescentTheme.colors.primary }} />
                    <h3 className="text-xl font-semibold">Alice's Wallet</h3>
                </div>
                <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Address:</span> 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa</p>
                    <p><span className="text-gray-400">Balance:</span> <span style={{ color: bioluminescentTheme.colors.accent1 }}>5.0 BTC</span></p>
                </div>
            </div>
            <div className="p-6 rounded-lg border animate-slide-in" style={{ backgroundColor: 'rgba(8, 28, 36, 0.6)', borderColor: `${bioluminescentTheme.colors.primary}40` }}>
                <div className="flex items-center mb-4">
                    <Wallet className="mr-3 h-8 w-8" style={{ color: bioluminescentTheme.colors.secondary }} />
                    <h3 className="text-xl font-semibold">Bob's Wallet</h3>
                </div>
                <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Address:</span> 3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy</p>
                    <p><span className="text-gray-400">Balance:</span> <span style={{ color: bioluminescentTheme.colors.accent1 }}>2.0 BTC</span></p>
                </div>
            </div>
        </div>
    );

    const TransactionComponent = (): JSX.Element => (
        <div className="text-center">
            <div className="flex items-center justify-center space-x-8 mb-6">
                <div className="text-center">
                    <Wallet className="mx-auto mb-2 h-12 w-12" style={{ color: bioluminescentTheme.colors.primary }} />
                    <p className="font-semibold">Alice</p>
                    <p className="text-sm text-gray-400">Sender</p>
                </div>
                <div className="animate-pulse">
                    <ArrowRight className="h-8 w-8" style={{ color: bioluminescentTheme.colors.accent1 }} />
                </div>
                <div className="text-center">
                    <Wallet className="mx-auto mb-2 h-12 w-12" style={{ color: bioluminescentTheme.colors.secondary }} />
                    <p className="font-semibold">Bob</p>
                    <p className="text-sm text-gray-400">Receiver</p>
                </div>
            </div>
            <div className="p-4 rounded-lg border animate-slide-in" 
                 style={{ 
                     backgroundColor: 'rgba(6, 214, 160, 0.1)', 
                     borderColor: bioluminescentTheme.colors.primary,
                     boxShadow: `0 0 20px rgba(6, 214, 160, 0.3)`
                 }}>
                <p className="text-lg font-semibold mb-2">Transaction Created</p>
                <p>Amount: <span style={{ color: bioluminescentTheme.colors.accent1 }}>1.0 BTC</span></p>
                <p className="text-sm text-gray-400 mt-2">Transaction ID: tx123abc...</p>
            </div>
        </div>
    );

    const BroadcastComponent = (): JSX.Element => (
        <div className="text-center">
            <div className="mb-6">
                <Network className="mx-auto h-16 w-16 animate-pulse" style={{ color: bioluminescentTheme.colors.primary }} />
                <h3 className="text-xl font-semibold mt-4">Broadcasting to Network</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 rounded-lg border animate-slide-in" 
                         style={{ 
                             backgroundColor: 'rgba(8, 28, 36, 0.6)', 
                             borderColor: `${bioluminescentTheme.colors.primary}40`,
                             animationDelay: `${i * 0.2}s` 
                         }}>
                        <Users className="mx-auto mb-2 h-8 w-8" style={{ color: bioluminescentTheme.colors.secondary }} />
                        <p className="text-sm">Node {i}</p>
                        <p className="text-xs text-gray-400">Mempool: 1 tx</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const MiningComponent = (): JSX.Element => (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Miners Competing</h3>
                <p className="text-gray-400">Racing to solve the cryptographic puzzle</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {miners.map(miner => (
                    <div key={miner.id} 
                         className={`p-4 rounded-lg border ${miner.mining ? 'animate-pulse' : ''} ${miner.solved ? 'bg-green-900/30' : ''}`} 
                         style={{ 
                             backgroundColor: 'rgba(8, 28, 36, 0.6)', 
                             borderColor: miner.solved ? '#10b981' : `${bioluminescentTheme.colors.primary}40`,
                             boxShadow: miner.mining ? '0 0 20px rgba(6, 214, 160, 0.3)' : 'none'
                         }}>
                        <Pickaxe className={`mx-auto mb-2 h-8 w-8 ${miner.mining ? 'animate-bounce' : ''}`} 
                                style={{ color: miner.solved ? '#10b981' : bioluminescentTheme.colors.primary }} />
                        <p className="font-semibold">{miner.name}</p>
                        <p className="text-sm text-gray-400">
                            {miner.solved ? 'Puzzle Solved!' : miner.mining ? 'Mining...' : 'Ready'}
                        </p>
                        {miner.solved && <CheckCircle className="mx-auto mt-2 h-6 w-6 text-green-400" />}
                    </div>
                ))}
            </div>
        </div>
    );

    const BlockComponent = (): JSX.Element => (
        <div className="text-center">
            <div className="mb-6">
                <Blocks className="mx-auto h-16 w-16" 
                       style={{ 
                           color: bioluminescentTheme.colors.primary,
                           filter: 'drop-shadow(0 0 10px rgba(6, 214, 160, 0.5))'
                       }} />
                <h3 className="text-xl font-semibold mt-4">New Block Created</h3>
            </div>
            {blocks.map(block => (
                <div key={block.id} className="p-6 rounded-lg border animate-slide-in max-w-md mx-auto" 
                     style={{ 
                         backgroundColor: 'rgba(6, 214, 160, 0.1)', 
                         borderColor: bioluminescentTheme.colors.primary 
                     }}>
                    <div className="space-y-2">
                        <p><span className="text-gray-400">Block #:</span> {block.id}</p>
                        <p><span className="text-gray-400">Miner:</span> {block.miner}</p>
                        <p><span className="text-gray-400">Transactions:</span> {block.transactions}</p>
                        <p><span className="text-gray-400">Block Hash:</span> {block.hash}</p>
                        <div className="mt-4 p-2 rounded" style={{ backgroundColor: 'rgba(8, 28, 36, 0.6)' }}>
                            <p className="text-sm text-gray-300">Previous Block Hash</p>
                            <p className="text-xs font-mono">def456...</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const ConsensusComponent = (): JSX.Element => (
        <div className="space-y-6">
            <div className="text-center">
                <Shield className="mx-auto h-16 w-16 animate-pulse" style={{ color: bioluminescentTheme.colors.primary }} />
                <h3 className="text-xl font-semibold mt-4">Network Consensus</h3>
                <p className="text-gray-400">All nodes verify and accept the new block</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-4 rounded-lg border animate-slide-in" 
                         style={{ 
                             backgroundColor: 'rgba(8, 28, 36, 0.6)', 
                             borderColor: `${bioluminescentTheme.colors.primary}40`,
                             animationDelay: `${i * 0.3}s` 
                         }}>
                        <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-400" />
                        <p className="text-sm">Node {i}</p>
                        <p className="text-xs text-green-400">Verified ✓</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const CompleteComponent = (): JSX.Element => (
        <div className="text-center">
            <div className="mb-6">
                <CheckCircle className="mx-auto h-20 w-20 text-green-400 animate-pulse" />
                <h3 className="text-2xl font-semibold mt-4" style={{ color: bioluminescentTheme.colors.primary }}>
                    Transaction Complete!
                </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg border" style={{ backgroundColor: 'rgba(8, 28, 36, 0.6)', borderColor: `${bioluminescentTheme.colors.primary}40` }}>
                    <Wallet className="mx-auto mb-2 h-8 w-8" style={{ color: bioluminescentTheme.colors.primary }} />
                    <h4 className="font-semibold">Alice's Wallet</h4>
                    <p className="text-sm text-gray-400">New Balance: <span style={{ color: bioluminescentTheme.colors.accent1 }}>4.0 BTC</span></p>
                </div>
                <div className="p-6 rounded-lg border" style={{ backgroundColor: 'rgba(8, 28, 36, 0.6)', borderColor: `${bioluminescentTheme.colors.primary}40` }}>
                    <Wallet className="mx-auto mb-2 h-8 w-8" style={{ color: bioluminescentTheme.colors.secondary }} />
                    <h4 className="font-semibold">Bob's Wallet</h4>
                    <p className="text-sm text-gray-400">New Balance: <span style={{ color: bioluminescentTheme.colors.accent1 }}>3.0 BTC</span></p>
                </div>
            </div>
            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
                <p className="text-lg font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
                    Why Bitcoin is Secure & Trustworthy
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-left">
                    <div>
                        <p className="font-medium mb-1">🔐 Cryptographic Security</p>
                        <p className="text-gray-300">Hash functions and digital signatures make transactions tamper-proof</p>
                    </div>
                    <div>
                        <p className="font-medium mb-1">🌐 Decentralized Network</p>
                        <p className="text-gray-300">No single point of failure - thousands of nodes verify transactions</p>
                    </div>
                    <div>
                        <p className="font-medium mb-1">⚡ Proof of Work</p>
                        <p className="text-gray-300">Miners must expend real energy to add blocks, making attacks expensive</p>
                    </div>
                    <div>
                        <p className="font-medium mb-1">📚 Transparent Ledger</p>
                        <p className="text-gray-300">All transactions are public and verifiable by anyone</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStepComponent = (): JSX.Element => {
        switch (steps[currentStep].component) {
            case 'wallets': return <WalletsComponent />;
            case 'transaction': return <TransactionComponent />;
            case 'broadcast': return <BroadcastComponent />;
            case 'mining': return <MiningComponent />;
            case 'block': return <BlockComponent />;
            case 'consensus': return <ConsensusComponent />;
            case 'complete': return <CompleteComponent />;
            default: return <WalletsComponent />;
        }
    };

    return (
        <div className="py-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4" style={{ color: bioluminescentTheme.colors.primary }}>
                    How Bitcoin Works: Interactive Simulation
                </h1>
                <p className="text-gray-300 text-lg">
                    Follow Alice as she sends Bitcoin to Bob and discover how the blockchain keeps everything secure
                </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium" style={{ color: bioluminescentTheme.colors.secondary }}>
                        Step {currentStep + 1} of {steps.length}
                    </span>
                    <span className="text-sm font-medium" style={{ color: bioluminescentTheme.colors.secondary }}>
                        {Math.round((currentStep + 1) / steps.length * 100)}%
                    </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                        className="h-2 rounded-full transition-all duration-500" 
                        style={{ 
                            width: `${(currentStep + 1) / steps.length * 100}%`,
                            backgroundColor: bioluminescentTheme.colors.primary 
                        }}
                    />
                </div>
            </div>

            {/* Step Content */}
            <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'rgba(8, 28, 36, 0.6)' }}>
                <h2 className="text-2xl font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
                    {steps[currentStep].title}
                </h2>
                <p className="text-gray-300 mb-6 text-lg">
                    {steps[currentStep].description}
                </p>
                
                <div className="min-h-[300px]">
                    {renderStepComponent()}
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="px-6 py-3 rounded-md font-medium text-white flex items-center disabled:opacity-50"
                    style={{ backgroundColor: bioluminescentTheme.colors.secondary }}
                >
                    Previous
                </button>
                
                <button
                    onClick={autoPlay}
                    disabled={isPlaying || currentStep === steps.length - 1}
                    className="px-6 py-3 rounded-md font-medium text-white flex items-center disabled:opacity-50"
                    style={{ backgroundColor: bioluminescentTheme.colors.primary }}
                >
                    <Play className="mr-2 h-4 w-4" />
                    Auto Play
                </button>
                
                <button
                    onClick={resetSimulation}
                    className="px-6 py-3 rounded-md font-medium text-white flex items-center"
                    style={{ backgroundColor: '#6B7280' }}
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                </button>
                
                <button
                    onClick={nextStep}
                    disabled={currentStep === steps.length - 1}
                    className="px-6 py-3 rounded-md font-medium text-white flex items-center disabled:opacity-50"
                    style={{ backgroundColor: bioluminescentTheme.colors.secondary }}
                >
                    Next
                </button>
            </div>
        </div>
    );
}