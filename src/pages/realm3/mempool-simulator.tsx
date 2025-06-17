import { useState, useEffect } from 'react';
import { Fingerprint, Check, RefreshCw, Key, Hash, MapPin, Shuffle, Send, Shield, Cpu, Zap, Code, Lock, Unlock, Layers, Eye, TreePine, Wallet, FileKey, Home, Waves, Anchor, Clock } from 'lucide-react';
import { bioluminescentTheme } from '@/lib/realm-themes';

interface HashingSimulatorProps {
  onComplete: () => void;
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  fee: number;
  size: number;
  feeRate: number;
  timestamp: number;
  priority: number;
  status: 'floating' | 'selected' | 'confirmed';
}

interface OceanLevel {
  level: string;
  color: string;
  name: string;
  description: string;
  transactions: Transaction[];
}

export default function HashingSimulator({ onComplete }: HashingSimulatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [mempoolTransactions, setMempoolTransactions] = useState<Transaction[]>([]);
  const [userTransaction, setUserTransaction] = useState<Transaction | null>(null);
  const [selectedFee, setSelectedFee] = useState(20);
  const [networkCongestion, setNetworkCongestion] = useState('low');
  const [minerBoat, setMinerBoat] = useState({ active: false, collecting: false, selectedTxs: [] as Transaction[] });
  const [minedBlock, setMinedBlock] = useState<any>(null);
  const [oceanDepth, setOceanDepth] = useState<OceanLevel[]>([]);
  const [waitTimeEstimate, setWaitTimeEstimate] = useState('');
  const [challenge, setChallenge] = useState({
    completed: false,
    message: '',
    success: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Ocean levels based on fee rates
  const OCEAN_LEVELS = [
    { level: 'surface', minFee: 50, color: 'bg-blue-300', name: 'Surface (50+ sat/vB)', description: 'High-fee fish floating at the top' },
    { level: 'shallow', minFee: 20, color: 'bg-blue-400', name: 'Shallow Waters (20-49 sat/vB)', description: 'Medium-fee fish in calm waters' },
    { level: 'deep', minFee: 10, color: 'bg-blue-600', name: 'Deep Waters (10-19 sat/vB)', description: 'Low-fee fish drifting deeper' },
    { level: 'abyss', minFee: 1, color: 'bg-blue-800', name: 'Ocean Abyss (1-9 sat/vB)', description: 'Very low-fee fish sinking to the bottom' }
  ];

  // Utility functions
  const generateTransactionId = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateRandomTransaction = (): Transaction => {
    const addresses = ['1A2B3C...', '1D4E5F...', '1G7H8I...', '1J9K0L...', '1M2N3O...'];
    const amounts = [0.1, 0.5, 1.0, 2.5, 5.0];
    const fees = [5, 15, 25, 35, 45, 55];
    const size = 250; // Average transaction size in vBytes
    
    const fee = fees[Math.floor(Math.random() * fees.length)];
    return {
      id: generateTransactionId(),
      from: addresses[Math.floor(Math.random() * addresses.length)],
      to: addresses[Math.floor(Math.random() * addresses.length)],
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      fee: fee * size / 100, // Convert to total fee
      size,
      feeRate: fee,
      timestamp: Date.now(),
      priority: fee,
      status: 'floating' as const
    };
  };

  const calculateWaitTime = (feeRate: number, congestionLevel: string) => {
    const baseTime = congestionLevel === 'high' ? 60 : congestionLevel === 'medium' ? 30 : 10;
    if (feeRate >= 50) return '1-2 blocks (~10-20 min)';
    if (feeRate >= 20) return `${Math.ceil(baseTime / 6)}-${Math.ceil(baseTime / 3)} blocks (~${baseTime}-${baseTime * 2} min)`;
    if (feeRate >= 10) return `${Math.ceil(baseTime / 2)}-${baseTime} blocks (~${baseTime * 5}-${baseTime * 10} min)`;
    return `${baseTime}-${baseTime * 3} blocks (${baseTime * 10} min - several hours)`;
  };

  const organizeOceanDepth = (transactions: Transaction[]) => {
    const levels: OceanLevel[] = OCEAN_LEVELS.map(level => ({
      level: level.level,
      color: level.color,
      name: level.name,
      description: level.description,
      transactions: transactions.filter(tx => {
        if (level.level === 'surface') return tx.feeRate >= level.minFee;
        if (level.level === 'shallow') return tx.feeRate >= level.minFee && tx.feeRate < 50;
        if (level.level === 'deep') return tx.feeRate >= level.minFee && tx.feeRate < 20;
        return tx.feeRate >= level.minFee && tx.feeRate < 10;
      })
    }));
    
    setOceanDepth(levels);
  };

  // Step 1: Introduction to Mempool Ocean
  const handleIntroduceMempool = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      // Generate some initial transactions floating in the ocean
      const initialTxs = Array.from({ length: 8 }, generateRandomTransaction);
      setMempoolTransactions(initialTxs);
      organizeOceanDepth(initialTxs);
      setCurrentStep(2);
      setIsProcessing(false);
    }, 800);
  };

  // Step 2: Create User Transaction
  const handleCreateTransaction = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const size = 250;
      const totalFee = (selectedFee * size) / 100;
      const newTx: Transaction = {
        id: generateTransactionId(),
        from: '1YourWallet...',
        to: '1RecipientAddr...',
        amount: 1.5,
        fee: totalFee,
        size,
        feeRate: selectedFee,
        timestamp: Date.now(),
        priority: selectedFee,
        status: 'floating'
      };
      
      setUserTransaction(newTx);
      const updatedTxs = [...mempoolTransactions, newTx];
      setMempoolTransactions(updatedTxs);
      organizeOceanDepth(updatedTxs);
      
      const waitTime = calculateWaitTime(selectedFee, networkCongestion);
      setWaitTimeEstimate(waitTime);
      
      setCurrentStep(3);
      setIsProcessing(false);
    }, 800);
  };

  // Step 3: Simulate Network Congestion
  const handleSimulateCongestion = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      // Add many more transactions to create congestion
      const congestionTxs = Array.from({ length: 15 }, generateRandomTransaction);
      const allTxs = [...mempoolTransactions, ...congestionTxs];
      setMempoolTransactions(allTxs);
      organizeOceanDepth(allTxs);
      setNetworkCongestion('high');
      
      // Recalculate wait time with congestion
      if (userTransaction) {
        const newWaitTime = calculateWaitTime(userTransaction.feeRate, 'high');
        setWaitTimeEstimate(newWaitTime);
      }
      
      setCurrentStep(4);
      setIsProcessing(false);
    }, 1000);
  };

  // Step 4: Miner Selects Transactions
  const handleMinerSelection = () => {
    setIsProcessing(true);
    setMinerBoat({ active: true, collecting: true, selectedTxs: [] });
    
    setTimeout(() => {
      // Sort by fee rate (highest first) and select top transactions that fit in block
      const sortedTxs = [...mempoolTransactions].sort((a, b) => b.feeRate - a.feeRate);
      const blockSizeLimit = 1000000; // 1MB in vBytes (simplified)
      let currentSize = 0;
      const selectedTxs: Transaction[] = [];
      
      for (const tx of sortedTxs) {
        if (currentSize + tx.size <= blockSizeLimit) {
          selectedTxs.push(tx);
          currentSize += tx.size;
        }
        if (selectedTxs.length >= 8) break; // Limit for visualization
      }
      
      // Update transaction statuses
      const updatedTxs = mempoolTransactions.map(tx => ({
        ...tx,
        status: selectedTxs.find(selected => selected.id === tx.id) ? 'selected' as const : 'floating' as const
      }));
      
      setMempoolTransactions(updatedTxs);
      setMinerBoat({ active: true, collecting: false, selectedTxs });
      setCurrentStep(5);
      setIsProcessing(false);
    }, 2000);
  };

  // Step 5: Mine Block and Confirm Transactions
  const handleMineBlock = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const block = {
        blockNumber: 800000 + Math.floor(Math.random() * 1000),
        transactions: minerBoat.selectedTxs,
        totalFees: minerBoat.selectedTxs.reduce((sum, tx) => sum + tx.fee, 0),
        timestamp: Date.now(),
        hash: '000000' + generateTransactionId().substring(0, 58)
      };
      
      // Remove confirmed transactions from mempool
      const remainingTxs = mempoolTransactions.filter(tx => 
        !minerBoat.selectedTxs.find(selected => selected.id === tx.id)
      );
      
      setMempoolTransactions(remainingTxs);
      organizeOceanDepth(remainingTxs);
      setMinedBlock(block);
      setMinerBoat({ active: false, collecting: false, selectedTxs: [] });
      
      // Check if user's transaction was confirmed
      const userTxConfirmed = minerBoat.selectedTxs.find(tx => tx.id === userTransaction?.id);
      
      setChallenge({
        completed: true,
        message: userTxConfirmed ? 
          "Congratulations! Your transaction sailed to confirmation! You've mastered the mempool ocean!" :
          "Your transaction is still floating in the ocean. You've learned how the mempool works!",
        success: true
      });
      
      setTimeout(onComplete, 2000);
      setIsProcessing(false);
    }, 2000);
  };

  // Handle fee adjustment for RBF
  const handleAdjustFee = (newFee: number) => {
    if (userTransaction && userTransaction.status === 'floating') {
      const size = userTransaction.size;
      const totalFee = (newFee * size) / 100;
      const updatedTx = {
        ...userTransaction,
        fee: totalFee,
        feeRate: newFee,
        priority: newFee
      };
      
      setUserTransaction(updatedTx);
      const updatedTxs = mempoolTransactions.map(tx => 
        tx.id === userTransaction.id ? updatedTx : tx
      );
      setMempoolTransactions(updatedTxs);
      organizeOceanDepth(updatedTxs);
      
      const newWaitTime = calculateWaitTime(newFee, networkCongestion);
      setWaitTimeEstimate(newWaitTime);
    }
  };

  const resetSimulation = () => {
    setCurrentStep(1);
    setMempoolTransactions([]);
    setUserTransaction(null);
    setSelectedFee(20);
    setNetworkCongestion('low');
    setMinerBoat({ active: false, collecting: false, selectedTxs: [] });
    setMinedBlock(null);
    setOceanDepth([]);
    setWaitTimeEstimate('');
    setChallenge({ completed: false, message: '', success: false });
  };

  return (
    <div className="py-6">
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'rgba(8, 28, 36, 0.6)' }}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
          Bitcoin Mempool Challenge: The Ocean of Unconfirmed Transactions
        </h3>
        <p className="text-gray-300 mb-4">
          Discover how Bitcoin transactions flow through the mempool before confirmation. 
          Picture the mempool as a vast ocean where transaction "fish" float, waiting for miner "fishermen" to collect them.
        </p>

        {/* Ocean Metaphor Introduction */}
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
          <h4 className="font-semibold mb-3" style={{ color: bioluminescentTheme.colors.primary }}>
            🌊 Welcome to the Bitcoin Ocean
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🌊</span>
                <span><strong>Mempool = Ocean:</strong> Where all unconfirmed transactions float</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">🐟</span>
                <span><strong>Transactions = Fish:</strong> Each carrying Bitcoin from sender to receiver</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">⚡</span>
                <span><strong>Fees = Cost of Fish:</strong> Higher cost = More desirable to fishermen</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🎣</span>
                <span><strong>Miners = Fishermen:</strong> They collect transactions for blocks</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">📦</span>
                <span><strong>Blocks = Containers:</strong> Limited space, only the best boats fit</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">⚓</span>
                <span><strong>Confirmation = Docking:</strong> Permanently recorded on blockchain</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Initialize Ocean */}
        <div className={`space-y-4 mb-6 p-4 rounded-lg ${currentStep >= 1 ? 'bg-black/20' : 'bg-black/10 opacity-50'}`}>
          <div className="flex items-center mb-3">
            <span 
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold ${
                currentStep >= 1 ? 'text-white' : 'text-gray-500'
              }`}
              style={{ backgroundColor: currentStep >= 1 ? bioluminescentTheme.colors.primary : '#6b7280' }}
            >
              1
            </span>
            <h4 className="text-lg font-semibold" style={{ color: bioluminescentTheme.colors.secondary }}>
              Initialize the Bitcoin Ocean
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Let's start by populating our Bitcoin ocean with some existing transactions. 
            Each "boat" represents a real Bitcoin transaction floating in the mempool, waiting for confirmation.
          </p>

          <button
            onClick={handleIntroduceMempool}
            disabled={isProcessing}
            className="px-4 py-2 rounded text-white font-medium flex items-center text-sm mb-4"
            style={{ 
              backgroundColor: bioluminescentTheme.colors.primary,
              opacity: isProcessing ? 0.7 : 1
            }}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Filling Ocean...
              </>
            ) : (
              <>
                <Waves className="mr-2 h-4 w-4" />
                Fill the Bitcoin Ocean
              </>
            )}
          </button>

          {oceanDepth.length > 0 && (
            <div className="space-y-3">
              <h5 className="font-semibold text-blue-400">🌊 Current Ocean State</h5>
              {oceanDepth.map((level, i) => (
                <div key={i} className={`p-3 rounded-lg ${level.color} bg-opacity-20 border border-current`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-blue-200">{level.name}</span>
                    <span className="text-sm text-blue-300">{level.transactions.length} fish</span>
                  </div>
                  <div className="text-xs text-blue-100 mb-2">{level.description}</div>
                  <div className="flex flex-wrap gap-1">
                    {level.transactions.slice(0, 6).map((tx, j) => (
                      <span key={j} className="text-xs bg-black/30 px-2 py-1 rounded">
                        ⛵ {tx.feeRate} sat/vB
                      </span>
                    ))}
                    {level.transactions.length > 6 && (
                      <span className="text-xs text-blue-300">+{level.transactions.length - 6} more...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Create Your Transaction */}
        <div className={`space-y-4 mb-6 p-4 rounded-lg ${currentStep >= 2 ? 'bg-black/20' : 'bg-black/10 opacity-50'}`}>
          <div className="flex items-center mb-3">
            <span 
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold ${
                currentStep >= 2 ? 'text-white' : 'text-gray-500'
              }`}
              style={{ backgroundColor: currentStep >= 2 ? bioluminescentTheme.colors.primary : '#6b7280' }}
            >
              2
            </span>
            <h4 className="text-lg font-semibold" style={{ color: bioluminescentTheme.colors.secondary }}>
              Launch Your Transaction Boat
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Now it's time to send your own Bitcoin transaction! Choose your fee rate carefully - 
            it determines how powerful your boat's engine is and how quickly it can rise to the surface.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Fee Rate:</label>
              <input
                type="range"
                min="1"
                max="100"
                value={selectedFee}
                onChange={(e) => setSelectedFee(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none slider"
                style={{ accentColor: bioluminescentTheme.colors.primary }}
              />
              <span className="text-sm font-bold w-20">{selectedFee} sat/vB</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className={`p-3 rounded border ${selectedFee >= 50 ? 'border-green-400 bg-green-900/20' : 'border-gray-600'}`}>
                <div className="font-semibold text-green-400">🚀 High Priority</div>
                <div className="text-xs text-gray-300">50+ sat/vB - Surface level</div>
              </div>
              <div className={`p-3 rounded border ${selectedFee >= 20 && selectedFee < 50 ? 'border-yellow-400 bg-yellow-900/20' : 'border-gray-600'}`}>
                <div className="font-semibold text-yellow-400">⚡ Medium Priority</div>
                <div className="text-xs text-gray-300">20-49 sat/vB - Shallow waters</div>
              </div>
              <div className={`p-3 rounded border ${selectedFee < 20 ? 'border-red-400 bg-red-900/20' : 'border-gray-600'}`}>
                <div className="font-semibold text-red-400">🐌 Low Priority</div>
                <div className="text-xs text-gray-300">1-19 sat/vB - Deep waters</div>
              </div>
            </div>

            <button
              onClick={handleCreateTransaction}
              disabled={currentStep < 2 || isProcessing}
              className="px-4 py-2 rounded text-white font-medium flex items-center text-sm"
              style={{ 
                backgroundColor: currentStep >= 2 ? bioluminescentTheme.colors.primary : '#6b7280',
                opacity: (currentStep < 2 || isProcessing) ? 0.7 : 1
              }}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Launching Boat...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send 1.5 BTC Transaction
                </>
              )}
            </button>
          </div>

          {userTransaction && (
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
              <h5 className="font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
                ⛵ Your Transaction Boat is Now Floating!
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div><strong>Amount:</strong> {userTransaction.amount} BTC</div>
                  <div><strong>Fee:</strong> {userTransaction.fee.toFixed(0)} sats</div>
                  <div><strong>Fee Rate:</strong> {userTransaction.feeRate} sat/vB</div>
                </div>
                <div className="space-y-1">
                  <div><strong>Size:</strong> {userTransaction.size} vBytes</div>
                  <div><strong>Status:</strong> <span className="text-yellow-400">🌊 Floating in Ocean</span></div>
                  <div><strong>Est. Wait:</strong> <span className="text-blue-400">{waitTimeEstimate}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rest of the steps would continue similarly... */}
        
        <div className="mt-4 text-center">
          <button
            onClick={resetSimulation}
            className="px-6 py-2 rounded text-white font-medium"
            style={{ backgroundColor: bioluminescentTheme.colors.secondary }}
          >
            🔄 Launch New Transaction
          </button>
        </div>
        
        {challenge.message && (
          <div 
            className={`mt-6 p-3 rounded-md ${challenge.success ? 'bg-green-900/30' : 'bg-red-900/30'}`}
            style={{ 
              borderLeft: `4px solid ${challenge.success ? '#10b981' : '#ef4444'}`,
            }}
          >
            <p className={challenge.success ? 'text-green-400' : 'text-red-400'}>
              {challenge.message}
            </p>
          </div>
        )}
      </div>
      
      {challenge.completed && (
        <div 
          className="text-center p-4 rounded-lg border"
          style={{ 
            backgroundColor: 'rgba(6, 214, 160, 0.1)',
            borderColor: `${bioluminescentTheme.colors.primary}40` 
          }}
        >
          <h3 className="text-lg font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
            Challenge Complete!
          </h3>
          <p className="text-gray-300">
            You've navigated the Bitcoin mempool ocean! You now understand how transactions flow from creation to confirmation, 
            how fees affect priority, and how network congestion impacts wait times. The mempool is no longer a mystery!
          </p>
        </div>
      )}
    </div>
  );
}