import { useState, useEffect } from 'react';
import { Fingerprint, Check, RefreshCw, Key, Hash, MapPin, Shuffle, Send, Shield, Cpu, Zap, Code, Lock, Unlock, Layers, Eye, TreePine, Wallet, FileKey, Home, Waves, Anchor, Clock, Server, BookOpen, Users, AlertTriangle } from 'lucide-react';
import { bioluminescentTheme } from '@/lib/realm-themes';

interface HashingSimulatorProps {
  onComplete: () => void;
}

export default function HashingSimulator({ onComplete }: HashingSimulatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedNodeType, setSelectedNodeType] = useState('full');
  const [networkNodes, setNetworkNodes] = useState<Array<{
    id: string,
    type: 'full' | 'spv' | 'mining',
    name: string,
    connected: boolean,
    blockHeight: number,
    mempool: any[],
    validating: boolean,
    status: string
  }>>([]);
  const [userNode, setUserNode] = useState<any>(null);
  const [broadcastTransaction, setBroadcastTransaction] = useState<any>(null);
  const [proposedBlock, setProposedBlock] = useState<any>(null);
  const [networkConsensus, setNetworkConsensus] = useState<{valid: boolean, votes: any[]}>({ valid: false, votes: [] });
  const [forkScenario, setForkScenario] = useState<any>(null);
  const [networkStatus, setNetworkStatus] = useState({
    totalNodes: 0,
    consensusLevel: 100,
    avgBlockHeight: 0
  });
  const [challenge, setChallenge] = useState({
    completed: false,
    message: '',
    success: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Node type configurations
  const NODE_TYPES = {
    full: {
      icon: '🏛️',
      name: 'Full Node Library',
      description: 'Stores complete blockchain encyclopedia, validates everything',
      storage: '500+ GB',
      features: ['Full validation', 'Complete history', 'Independent verification'],
      color: 'text-green-400',
      bgColor: 'bg-green-900/20'
    },
    spv: {
      icon: '📱',
      name: 'SPV Light Node',
      description: 'Visitor who checks index cards, trusts but verifies',
      storage: '~1 MB',
      features: ['Block headers only', 'Trust full nodes', 'Fast sync'],
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20'
    },
    mining: {
      icon: '⛏️',
      name: 'Mining Node Publisher',
      description: 'Creates new encyclopedia volumes, validates and publishes',
      storage: '500+ GB + Mining',
      features: ['Full validation', 'Block creation', 'Consensus participation'],
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/20'
    }
  };

  // Utility functions
  const generateNodeId = () => {
    return 'node_' + Math.random().toString(16).substring(2, 8);
  };

  const generateTransaction = () => {
    return {
      id: 'tx_' + Math.random().toString(16).substring(2, 10),
      from: '1Alice' + Math.random().toString(16).substring(2, 6),
      to: '1Bob' + Math.random().toString(16).substring(2, 6),
      amount: (Math.random() * 5).toFixed(2),
      fee: Math.floor(Math.random() * 50) + 10,
      signature: 'sig_' + Math.random().toString(16).substring(2, 12),
      valid: Math.random() > 0.1 // 90% of transactions are valid
    };
  };

  const createNetworkNodes = () => {
    const nodes = [
      { type: 'full', name: 'University Library', baseHeight: 800000 },
      { type: 'full', name: 'City Central Library', baseHeight: 800000 },
      { type: 'full', name: 'Community Library', baseHeight: 799999 },
      { type: 'spv', name: 'Mobile Reader', baseHeight: 800000 },
      { type: 'spv', name: 'Tablet User', baseHeight: 800000 },
      { type: 'mining', name: 'Publishing House Alpha', baseHeight: 800000 },
      { type: 'mining', name: 'Publishing House Beta', baseHeight: 800000 }
    ].map(node => ({
      id: generateNodeId(),
      type: node.type as 'full' | 'spv' | 'mining',
      name: node.name,
      connected: true,
      blockHeight: node.baseHeight + Math.floor(Math.random() * 2),
      mempool: [],
      validating: false,
      status: 'synced'
    }));

    return nodes;
  };

  // Step 1: Setup Your Node
  const handleSetupNode = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const nodes = createNetworkNodes();
      setNetworkNodes(nodes);
      
      const newUserNode = {
        id: 'user_node',
        type: selectedNodeType,
        name: `Your ${NODE_TYPES[selectedNodeType as keyof typeof NODE_TYPES].name}`,
        connected: true,
        blockHeight: 799998, // Slightly behind, needs to sync
        mempool: [],
        validating: false,
        status: 'syncing',
        syncProgress: 0
      };
      
      setUserNode(newUserNode);
      
      const avgHeight = nodes.reduce((sum, node) => sum + node.blockHeight, 0) / nodes.length;
      setNetworkStatus({
        totalNodes: nodes.length + 1,
        consensusLevel: 100,
        avgBlockHeight: Math.round(avgHeight)
      });
      
      setCurrentStep(2);
      setIsProcessing(false);
    }, 1000);
  };

  // Step 2: Sync with Network
  const handleSyncNode = () => {
    setIsProcessing(true);
    
    let progress = 0;
    const syncInterval = setInterval(() => {
      progress += 20;
      setUserNode((prev: any) => ({
        ...prev,
        syncProgress: progress,
        blockHeight: prev.blockHeight + Math.floor(progress / 50),
        status: progress >= 100 ? 'synced' : 'syncing'
      }));
      
      if (progress >= 100) {
        clearInterval(syncInterval);
        setCurrentStep(3);
        setIsProcessing(false);
      }
    }, 500);
  };

  // Step 3: Broadcast Transaction
  const handleBroadcastTransaction = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const tx = generateTransaction();
      setBroadcastTransaction(tx);
      
      // Simulate nodes receiving and validating the transaction
      let validationDelay = 0;
      networkNodes.forEach((node, index) => {
        setTimeout(() => {
          setNetworkNodes(prev => prev.map(n => 
            n.id === node.id ? {
              ...n,
              validating: true,
              mempool: [...n.mempool, { ...tx, validatedBy: n.id }]
            } : n
          ));
          
          setTimeout(() => {
            setNetworkNodes(prev => prev.map(n => 
              n.id === node.id ? { ...n, validating: false } : n
            ));
          }, 800);
        }, validationDelay);
        
        validationDelay += 200;
      });
      
      setTimeout(() => {
        setCurrentStep(4);
        setIsProcessing(false);
      }, validationDelay + 1000);
    }, 800);
  };

  // Step 4: Mine and Propose Block
  const handleProposeBlock = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const minerNode = networkNodes.find(n => n.type === 'mining');
      const transactions = [broadcastTransaction, generateTransaction(), generateTransaction()];
      
      const block = {
        number: networkStatus.avgBlockHeight + 1,
        previousHash: '000abc' + Math.random().toString(16).substring(2, 10),
        merkleRoot: 'merkle_' + Math.random().toString(16).substring(2, 12),
        timestamp: Date.now(),
        transactions,
        minedBy: minerNode?.name || 'Mining Node',
        nonce: Math.floor(Math.random() * 1000000)
      };
      
      setProposedBlock(block);
      
      // Start consensus validation
      setTimeout(() => {
        handleValidateBlock(block);
      }, 1000);
    }, 1500);
  };

  // Step 5: Network Consensus
  const handleValidateBlock = (block: any) => {
    const votes: any[] = [];
    let validationDelay = 0;
    
    [...networkNodes, userNode].forEach((node, index) => {
      if (node.type === 'spv') {
        // SPV nodes only check headers
        setTimeout(() => {
          votes.push({
            nodeId: node.id,
            nodeName: node.name,
            vote: 'accept',
            reason: 'Valid block header and PoW'
          });
          setNetworkConsensus({ valid: true, votes: [...votes] });
        }, validationDelay);
      } else {
        // Full nodes validate everything
        setTimeout(() => {
          const isValid = Math.random() > 0.05; // 95% validation success
          votes.push({
            nodeId: node.id,
            nodeName: node.name,
            vote: isValid ? 'accept' : 'reject',
            reason: isValid ? 'All transactions valid' : 'Invalid transaction detected'
          });
          setNetworkConsensus({ valid: votes.filter(v => v.vote === 'accept').length > votes.length / 2, votes: [...votes] });
        }, validationDelay);
      }
      
      validationDelay += 300;
    });
    
    setTimeout(() => {
      if (votes.filter(v => v.vote === 'accept').length > votes.length / 2) {
        // Update all node heights
        setNetworkNodes(prev => prev.map(node => ({
          ...node,
          blockHeight: Math.max(node.blockHeight, block.number),
          mempool: node.mempool.filter(tx => !block.transactions.find((btx: any) => btx.id === tx.id))
        })));
        
        setUserNode((prev: any) => ({
          ...prev,
          blockHeight: Math.max(prev.blockHeight, block.number)
        }));
      }
      
      setCurrentStep(5);
      setIsProcessing(false);
    }, validationDelay + 500);
  };

  // Step 6: Demonstrate Fork Resolution
  const handleForkDemo = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const forkA = {
        number: networkStatus.avgBlockHeight + 2,
        chain: 'A',
        minedBy: 'Publisher Alpha',
        transactions: 2,
        supporters: ['University Library', 'City Central Library', 'Your Node']
      };
      
      const forkB = {
        number: networkStatus.avgBlockHeight + 2,
        chain: 'B',
        minedBy: 'Publisher Beta',
        transactions: 3,
        supporters: ['Community Library', 'Mobile Reader']
      };
      
      setForkScenario({ forkA, forkB, winner: null });
      
      // Simulate resolution after a few seconds
      setTimeout(() => {
        // Fork A gets the next block first (longest chain wins)
        const winner = Math.random() > 0.5 ? forkA : forkB;
        setForkScenario((prev: any) => ({ ...prev, winner }));
        
        setChallenge({
          completed: true,
          message: "Congratulations! You've witnessed how Bitcoin nodes maintain consensus and resolve conflicts through the longest valid chain rule!",
          success: true
        });
        
        setTimeout(onComplete, 2000);
        setIsProcessing(false);
      }, 3000);
    }, 800);
  };

  const resetSimulation = () => {
    setCurrentStep(1);
    setSelectedNodeType('full');
    setNetworkNodes([]);
    setUserNode(null);
    setBroadcastTransaction(null);
    setProposedBlock(null);
    setNetworkConsensus({ valid: false, votes: [] });
    setForkScenario(null);
    setNetworkStatus({ totalNodes: 0, consensusLevel: 100, avgBlockHeight: 0 });
    setChallenge({ completed: false, message: '', success: false });
  };

  return (
    <div className="py-6">
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'rgba(8, 28, 36, 0.6)' }}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
          Bitcoin Nodes Challenge: Guardians of the Digital Library
        </h3>
        <p className="text-gray-300 mb-4">
          Discover how Bitcoin nodes work together like a network of libraries, each maintaining and protecting 
          the complete transaction history. Learn about different node types and their crucial roles in Bitcoin's decentralization.
        </p>

        {/* Library Metaphor Introduction */}
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
          <h4 className="font-semibold mb-3" style={{ color: bioluminescentTheme.colors.primary }}>
            📚 The Bitcoin Library Network
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🏛️</span>
                <span><strong>Bitcoin Node = Library:</strong> Stores and shares Bitcoin's transaction history</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">📖</span>
                <span><strong>Blockchain = Encyclopedia Set:</strong> Each block is a volume, transactions are pages</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">👨‍🏫</span>
                <span><strong>Validation = Librarian Check:</strong> Ensures new entries follow the rules</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-2xl mr-2">✍️</span>
                <span><strong>Mining = Publishing:</strong> Creates new volumes for the encyclopedia</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">🤝</span>
                <span><strong>Consensus = Agreement:</strong> All libraries must have matching sets</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">🌐</span>
                <span><strong>P2P Network = Postal System:</strong> Libraries share updates with each other</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Choose Your Node Type */}
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
              Choose Your Library Type
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Bitcoin has different types of "libraries" (nodes) that serve various purposes in the network. 
            Choose what type of library you'd like to run and join the Bitcoin network.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {Object.entries(NODE_TYPES).map(([type, config]) => (
              <div
                key={type}
                onClick={() => setSelectedNodeType(type)}
                className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                  selectedNodeType === type ? 'border-blue-400' : 'border-gray-600'
                } ${config.bgColor}`}
              >
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">{config.icon}</div>
                  <h5 className={`font-semibold ${config.color}`}>{config.name}</h5>
                </div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div><strong>Storage:</strong> {config.storage}</div>
                  <div><strong>Role:</strong> {config.description}</div>
                  <ul className="mt-2 space-y-1">
                    {config.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-3 w-3 mr-1 text-green-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSetupNode}
            disabled={isProcessing}
            className="px-4 py-2 rounded text-white font-medium flex items-center text-sm"
            style={{ 
              backgroundColor: bioluminescentTheme.colors.primary,
              opacity: isProcessing ? 0.7 : 1
            }}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Setting up your library...
              </>
            ) : (
              <>
                <Server className="mr-2 h-4 w-4" />
                Join the Bitcoin Network
              </>
            )}
          </button>
        </div>

        {/* Network Overview */}
        {networkNodes.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-black/30">
            <h5 className="font-semibold mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-400" />
              Bitcoin Library Network Status
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-black/40 rounded">
                <div className="text-lg font-bold text-blue-400">{networkStatus.totalNodes}</div>
                <div className="text-gray-400">Active Libraries</div>
              </div>
              <div className="text-center p-3 bg-black/40 rounded">
                <div className="text-lg font-bold text-green-400">{networkStatus.consensusLevel}%</div>
                <div className="text-gray-400">Consensus Level</div>
              </div>
              <div className="text-center p-3 bg-black/40 rounded">
                <div className="text-lg font-bold text-purple-400">{networkStatus.avgBlockHeight}</div>
                <div className="text-gray-400">Current Block Height</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Sync Your Node */}
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
              Sync Your Library Collection
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Your new library needs to catch up with the rest of the network by downloading and verifying 
            all the Bitcoin transaction history. This is like getting a complete encyclopedia set.
          </p>

          {userNode && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
                <h5 className="font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
                  {NODE_TYPES[userNode.type as keyof typeof NODE_TYPES].icon} {userNode.name}
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div><strong>Type:</strong> {NODE_TYPES[userNode.type as keyof typeof NODE_TYPES].name}</div>
                    <div><strong>Status:</strong> 
                      <span className={userNode.status === 'synced' ? 'text-green-400' : 'text-yellow-400'}>
                        {userNode.status === 'synced' ? ' ✅ Fully Synced' : ' 🔄 Syncing...'}
                      </span>
                    </div>
                    <div><strong>Block Height:</strong> {userNode.blockHeight}</div>
                  </div>
                  <div className="space-y-1">
                    <div><strong>Connected Peers:</strong> {networkNodes.length}</div>
                    {userNode.syncProgress !== undefined && userNode.status === 'syncing' && (
                      <div>
                        <div><strong>Sync Progress:</strong> {userNode.syncProgress}%</div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${userNode.syncProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSyncNode}
                disabled={userNode.status === 'synced' || isProcessing}
                className="px-4 py-2 rounded text-white font-medium flex items-center text-sm"
                style={{ 
                  backgroundColor: userNode.status === 'synced' ? '#6b7280' : bioluminescentTheme.colors.primary,
                  opacity: (userNode.status === 'synced' || isProcessing) ? 0.7 : 1
                }}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Downloading blocks...
                  </>
                ) : userNode.status === 'synced' ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Sync Complete
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Start Blockchain Sync
                  </>
                )}
              </button>
            </div>
          )}

          {networkNodes.length > 0 && (
            <div className="mt-4">
              <h5 className="font-semibold mb-2 text-gray-300">📚 Network Libraries</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {networkNodes.slice(0, 6).map((node, i) => (
                  <div key={i} className="p-2 bg-black/40 rounded text-xs">
                    <div className="flex justify-between items-center">
                      <span>
                        {NODE_TYPES[node.type].icon} {node.name}
                      </span>
                      <span className="text-green-400">Block {node.blockHeight}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Transaction Broadcasting */}
        <div className={`space-y-4 mb-6 p-4 rounded-lg ${currentStep >= 3 ? 'bg-black/20' : 'bg-black/10 opacity-50'}`}>
          <div className="flex items-center mb-3">
            <span 
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold ${
                currentStep >= 3 ? 'text-white' : 'text-gray-500'
              }`}
              style={{ backgroundColor: currentStep >= 3 ? bioluminescentTheme.colors.primary : '#6b7280' }}
            >
              3
            </span>
            <h4 className="text-lg font-semibold" style={{ color: bioluminescentTheme.colors.secondary }}>
              Validate New Transaction Entry
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Someone wants to add a new transaction entry to the Bitcoin ledger. Every library (node) in the network 
            must check if this entry follows all the rules before accepting it into their collection.
          </p>

          <button
            onClick={handleBroadcastTransaction}
            disabled={currentStep < 3 || isProcessing}
            className="px-4 py-2 rounded text-white font-medium flex items-center text-sm mb-4"
            style={{ 
              backgroundColor: currentStep >= 3 ? bioluminescentTheme.colors.primary : '#6b7280',
              opacity: (currentStep < 3 || isProcessing) ? 0.7 : 1
            }}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Broadcasting to network...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Broadcast New Transaction
              </>
            )}
          </button>

          {broadcastTransaction && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 165, 0, 0.1)' }}>
                <h5 className="font-semibold mb-2 text-orange-400">📝 New Transaction Entry</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div><strong>From:</strong> {broadcastTransaction.from}</div>
                    <div><strong>To:</strong> {broadcastTransaction.to}</div>
                    <div><strong>Amount:</strong> {broadcastTransaction.amount} BTC</div>
                  </div>
                  <div className="space-y-1">
                    <div><strong>Fee:</strong> {broadcastTransaction.fee} sats</div>
                    <div><strong>Valid:</strong> 
                      <span className={broadcastTransaction.valid ? 'text-green-400' : 'text-red-400'}>
                        {broadcastTransaction.valid ? ' ✅ Yes' : ' ❌ No'}
                      </span>
                    </div>
                    <div><strong>Signature:</strong> {broadcastTransaction.signature}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {networkNodes.map((node, i) => (
                  <div key={i} className={`p-2 rounded text-xs ${node.validating ? 'bg-yellow-900/20 border border-yellow-400' : 'bg-black/40'}`}>
                    <div className="flex justify-between items-center">
                      <span>{NODE_TYPES[node.type].icon} {node.name}</span>
                      <span>
                        {node.validating ? (
                          <span className="text-yellow-400">🔍 Validating...</span>
                        ) : node.mempool.length > 0 ? (
                          <span className="text-green-400">✅ Added to mempool</span>
                        ) : (
                          <span className="text-gray-400">⏳ Waiting</span>
                        )}
                      </span>
                    </div>
                    {node.type === 'spv' && (
                      <div className="text-gray-400 text-xs mt-1">Light node: Trusts full node validation</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Block Creation and Proposal */}
        <div className={`space-y-4 mb-6 p-4 rounded-lg ${currentStep >= 4 ? 'bg-black/20' : 'bg-black/10 opacity-50'}`}>
          <div className="flex items-center mb-3">
            <span 
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold ${
                currentStep >= 4 ? 'text-white' : 'text-gray-500'
              }`}
              style={{ backgroundColor: currentStep >= 4 ? bioluminescentTheme.colors.primary : '#6b7280' }}
            >
              4
            </span>
            <h4 className="text-lg font-semibold" style={{ color: bioluminescentTheme.colors.secondary }}>
              Publish New Encyclopedia Volume
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            A mining node (publisher) has compiled pending transactions into a new block (encyclopedia volume). 
            Now all libraries must verify this new volume before adding it to their collections.
          </p>

          <button
            onClick={handleProposeBlock}
            disabled={currentStep < 4 || isProcessing}
            className="px-4 py-2 rounded text-white font-medium flex items-center text-sm mb-4"
            style={{ 
              backgroundColor: currentStep >= 4 ? bioluminescentTheme.colors.primary : '#6b7280',
              opacity: (currentStep < 4 || isProcessing) ? 0.7 : 1
            }}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Mining new block...
              </>
            ) : (
              <>
                <BookOpen className="mr-2 h-4 w-4" />
                Mine & Propose Block
              </>
            )}
          </button>

          {proposedBlock && (
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
              <h5 className="font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
                📚 New Block Volume #{proposedBlock.number}
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div><strong>Published by:</strong> {proposedBlock.minedBy}</div>
                  <div><strong>Transactions:</strong> {proposedBlock.transactions.length}</div>
                  <div><strong>Previous Hash:</strong> {proposedBlock.previousHash}</div>
                </div>
                <div className="space-y-1">
                  <div><strong>Merkle Root:</strong> {proposedBlock.merkleRoot}</div>
                  <div><strong>Nonce:</strong> {proposedBlock.nonce}</div>
                  <div><strong>Status:</strong> <span className="text-yellow-400">📋 Under Review</span></div>
                </div>
              </div>
            </div>
          )}

          {networkConsensus.votes.length > 0 && (
            <div className="space-y-2">
              <h5 className="font-semibold text-gray-300">🗳️ Library Consensus Votes</h5>
              {networkConsensus.votes.map((vote, i) => (
                <div key={i} className={`p-2 rounded text-xs ${vote.vote === 'accept' ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
                  <div className="flex justify-between items-center">
                    <span>{vote.nodeName}</span>
                    <span className={vote.vote === 'accept' ? 'text-green-400' : 'text-red-400'}>
                      {vote.vote === 'accept' ? '✅ ACCEPT' : '❌ REJECT'}
                    </span>
                  </div>
                  <div className="text-gray-400">{vote.reason}</div>
                </div>
              ))}
              
              {networkConsensus.votes.length >= networkStatus.totalNodes && (
                <div className={`p-3 rounded-lg ${networkConsensus.valid ? 'bg-green-900/20 border border-green-500' : 'bg-red-900/20 border border-red-500'}`}>
                  <div className={`font-semibold ${networkConsensus.valid ? 'text-green-400' : 'text-red-400'}`}>
                    {networkConsensus.valid ? '✅ Consensus Reached: Block Accepted!' : '❌ Consensus Failed: Block Rejected!'}
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    {networkConsensus.votes.filter(v => v.vote === 'accept').length} out of {networkConsensus.votes.length} libraries accepted the new volume.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 5: Fork Resolution Demo */}
        <div className={`space-y-4 mb-6 p-4 rounded-lg ${currentStep >= 5 ? 'bg-black/20' : 'bg-black/10 opacity-50'}`}>
          <div className="flex items-center mb-3">
            <span 
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold ${
                currentStep >= 5 ? 'text-white' : 'text-gray-500'
              }`}
              style={{ backgroundColor: currentStep >= 5 ? bioluminescentTheme.colors.primary : '#6b7280' }}
            >
              5
            </span>
            <h4 className="text-lg font-semibold" style={{ color: bioluminescentTheme.colors.secondary }}>
              Resolve Competing Editions (Fork)
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Sometimes two publishers release competing volumes at the same time! The network must decide which one to accept. 
            Bitcoin uses the "longest valid chain" rule - the chain with the most work (blocks) wins.
          </p>

          <button
            onClick={handleForkDemo}
            disabled={currentStep < 5 || isProcessing}
            className="px-4 py-2 rounded text-white font-medium flex items-center text-sm mb-4"
            style={{ 
              backgroundColor: currentStep >= 5 ? bioluminescentTheme.colors.primary : '#6b7280',
              opacity: (currentStep < 5 || isProcessing) ? 0.7 : 1
            }}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Creating fork scenario...
              </>
            ) : (
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Simulate Fork Resolution
              </>
            )}
          </button>

          {forkScenario && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-3 rounded-lg border-2 ${forkScenario.winner?.chain === 'A' ? 'border-green-400 bg-green-900/20' : 'border-blue-400 bg-blue-900/20'}`}>
                  <h5 className="font-semibold mb-2 text-blue-400">📚 Edition A</h5>
                  <div className="text-sm space-y-1">
                    <div><strong>Publisher:</strong> {forkScenario.forkA.minedBy}</div>
                    <div><strong>Block #:</strong> {forkScenario.forkA.number}</div>
                    <div><strong>Transactions:</strong> {forkScenario.forkA.transactions}</div>
                    <div><strong>Supporters:</strong></div>
                    <ul className="text-xs text-gray-300 ml-4">
                      {forkScenario.forkA.supporters.map((supporter: string, i: number) => (
                        <li key={i}>• {supporter}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={`p-3 rounded-lg border-2 ${forkScenario.winner?.chain === 'B' ? 'border-green-400 bg-green-900/20' : 'border-purple-400 bg-purple-900/20'}`}>
                  <h5 className="font-semibold mb-2 text-purple-400">📚 Edition B</h5>
                  <div className="text-sm space-y-1">
                    <div><strong>Publisher:</strong> {forkScenario.forkB.minedBy}</div>
                    <div><strong>Block #:</strong> {forkScenario.forkB.number}</div>
                    <div><strong>Transactions:</strong> {forkScenario.forkB.transactions}</div>
                    <div><strong>Supporters:</strong></div>
                    <ul className="text-xs text-gray-300 ml-4">
                      {forkScenario.forkB.supporters.map((supporter: string, i: number) => (
                        <li key={i}>• {supporter}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {forkScenario.winner ? (
                <div className="p-3 rounded-lg bg-green-900/20 border border-green-500">
                  <h5 className="font-semibold text-green-400 mb-2">🏆 Fork Resolved!</h5>
                  <div className="text-sm text-green-300">
                    Edition {forkScenario.winner.chain} became the canonical version when its publisher mined the next block first, 
                    creating the longest valid chain. All libraries updated their collections to match.
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    💡 This is how Bitcoin automatically resolves conflicts without central authority!
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-500">
                  <h5 className="font-semibold text-yellow-400 mb-2">⚔️ Fork in Progress</h5>
                  <div className="text-sm text-yellow-300">
                    Two competing editions exist! Libraries are waiting to see which publisher mines the next block first...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={resetSimulation}
            className="px-6 py-2 rounded text-white font-medium"
            style={{ backgroundColor: bioluminescentTheme.colors.secondary }}
          >
            🔄 Run Different Node Type
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
            You've mastered Bitcoin nodes! You understand how these digital libraries work together to maintain 
            Bitcoin's decentralized ledger, validate transactions, reach consensus, and resolve conflicts. 
            Nodes are the true guardians of Bitcoin's security and decentralization!
          </p>
        </div>
      )}
    </div>
  );
}