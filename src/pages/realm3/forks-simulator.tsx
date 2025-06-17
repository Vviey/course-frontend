import { useState, useEffect } from 'react';
import { Fingerprint, Check, RefreshCw, Key, Hash, MapPin, Shuffle, Send, Shield, Cpu, Zap, Code, Lock, Unlock, Layers, Eye, TreePine, Wallet, FileKey, Home, Waves, Anchor, Clock, Server, BookOpen, Users, AlertTriangle, GitBranch, Settings, ArrowDown, ArrowUp } from 'lucide-react';
import { bioluminescentTheme } from '@/lib/realm-themes';

interface HashingSimulatorProps {
  onComplete: () => void;
}

export default function HashingSimulator({ onComplete }: HashingSimulatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedForkType, setSelectedForkType] = useState<'soft' | 'hard' | null>(null);
  const [networkNodes, setNetworkNodes] = useState<Array<{
    id: string,
    type: 'miner' | 'full' | 'spv',
    name: string,
    version: 'old' | 'new',
    signaling: boolean,
    supportsFork: boolean,
    blockHeight: number
  }>>([]);
  const [forkProposal, setForkProposal] = useState<any>(null);
  const [activationProgress, setActivationProgress] = useState(0);
  const [chainSplit, setChainSplit] = useState<any>(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<'segwit' | 'taproot' | 'bch' | null>(null);
  const [userRole, setUserRole] = useState<'miner' | 'user' | 'node' | null>(null);
  const [gameScenario, setGameScenario] = useState<any>(null);
  const [replayAttack, setReplayAttack] = useState<any>(null);
  const [challenge, setChallenge] = useState({
    completed: false,
    message: '',
    success: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Fork type definitions
  const FORK_TYPES = {
    soft: {
      icon: '🔄',
      name: 'Soft Fork',
      description: 'Tightens rules, backward compatible',
      analogy: 'Updating neighborhood safety rules - old residents still compliant',
      examples: ['SegWit (2017)', 'Taproot (2021)', 'BIP66 (2015)'],
      compatibility: 'Backward Compatible',
      color: 'text-green-400',
      bgColor: 'bg-green-900/20'
    },
    hard: {
      icon: '⚡',
      name: 'Hard Fork',
      description: 'Changes core rules, creates split',
      analogy: 'Political split creating new nation with own constitution',
      examples: ['Bitcoin Cash (2017)', 'Bitcoin SV (2018)', 'Bitcoin Gold (2017)'],
      compatibility: 'Not Backward Compatible',
      color: 'text-red-400',
      bgColor: 'bg-red-900/20'
    }
  };

  // Case study data
  const CASE_STUDIES = {
    segwit: {
      name: 'SegWit Activation (2017)',
      type: 'Soft Fork',
      description: 'Moved witness data outside main block, increased effective block size',
      timeline: '2015-2017',
      activation: 'BIP9 + UASF pressure',
      benefits: ['Fixed transaction malleability', 'Enabled Lightning Network', '~2x capacity increase'],
      controversy: 'Miner resistance led to UASF (User Activated Soft Fork) threat'
    },
    taproot: {
      name: 'Taproot Upgrade (2021)',
      type: 'Soft Fork',
      description: 'Introduced Schnorr signatures and MAST for better privacy',
      timeline: '2018-2021',
      activation: 'BIP9 with speedy trial',
      benefits: ['Schnorr signatures', 'Better privacy', 'More complex scripts'],
      controversy: 'Smooth activation with wide support'
    },
    bch: {
      name: 'Bitcoin Cash Fork (2017)',
      type: 'Hard Fork',
      description: 'Increased block size to 8MB, rejected SegWit',
      timeline: 'August 1, 2017',
      activation: 'Mandatory hard fork',
      benefits: ['Larger blocks', 'Lower fees initially', 'No SegWit complexity'],
      controversy: 'Split Bitcoin community, created competing currency'
    }
  };

  // Initialize network nodes
  const initializeNetwork = () => {
    return [
      { id: 'node1', type: 'miner', name: 'Mining Pool Alpha', version: 'old', signaling: false, supportsFork: false, blockHeight: 750000 },
      { id: 'node2', type: 'miner', name: 'Mining Pool Beta', version: 'old', signaling: false, supportsFork: false, blockHeight: 750000 },
      { id: 'node3', type: 'miner', name: 'Mining Pool Gamma', version: 'old', signaling: false, supportsFork: false, blockHeight: 750000 },
      { id: 'node4', type: 'full', name: 'Exchange Node', version: 'old', signaling: false, supportsFork: false, blockHeight: 750000 },
      { id: 'node5', type: 'full', name: 'Wallet Provider', version: 'old', signaling: false, supportsFork: false, blockHeight: 750000 },
      { id: 'node6', type: 'spv', name: 'Mobile Wallet', version: 'old', signaling: false, supportsFork: false, blockHeight: 750000 },
      { id: 'node7', type: 'full', name: 'Community Node', version: 'old', signaling: false, supportsFork: false, blockHeight: 750000 }
    ] as Array<{
      id: string,
      type: 'miner' | 'full' | 'spv',
      name: string,
      version: 'old' | 'new',
      signaling: boolean,
      supportsFork: boolean,
      blockHeight: number
    }>;
  };

  // Step 1: Introduction to Forks
  const handleIntroduceForks = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const nodes = initializeNetwork();
      setNetworkNodes(nodes);
      setCurrentStep(2);
      setIsProcessing(false);
    }, 800);
  };

  // Step 2: Choose Fork Type
  const handleChooseFork = (forkType: 'soft' | 'hard') => {
    setIsProcessing(true);
    setSelectedForkType(forkType);
    
    setTimeout(() => {
      const proposal = {
        type: forkType,
        name: forkType === 'soft' ? 'Privacy Enhancement Fork' : 'Block Size Increase Fork',
        description: forkType === 'soft' ? 
          'Adds new signature types for better privacy (backward compatible)' :
          'Increases block size from 1MB to 8MB (incompatible change)',
        activationThreshold: forkType === 'soft' ? 95 : 51,
        blockHeight: 750100
      };
      
      setForkProposal(proposal);
      setCurrentStep(3);
      setIsProcessing(false);
    }, 800);
  };

  // Step 3: Network Signaling and Activation
  const handleNetworkSignaling = () => {
    setIsProcessing(true);
    
    let progress = 0;
    const signalingInterval = setInterval(() => {
      progress += 15;
      
      // Randomly upgrade nodes and have them signal
      setNetworkNodes(prev => prev.map(node => {
        if (Math.random() < 0.3 && node.version === 'old') {
          return {
            ...node,
            version: 'new',
            signaling: true,
            supportsFork: true
          };
        }
        return node;
      }));
      
      setActivationProgress(progress);
      
      if (progress >= 100) {
        clearInterval(signalingInterval);
        
        if (selectedForkType === 'hard') {
          // Hard fork creates chain split
          setChainSplit({
            originalChain: 'Bitcoin (BTC)',
            newChain: selectedForkType === 'hard' ? 'Bitcoin Enhanced (BTE)' : null,
            splitHeight: 750100,
            replayProtection: false
          });
        }
        
        setCurrentStep(4);
        setIsProcessing(false);
      }
    }, 800);
  };

  // Step 4: Case Study Selection
  const handleSelectCaseStudy = (caseStudy: 'segwit' | 'taproot' | 'bch') => {
    setIsProcessing(true);
    setSelectedCaseStudy(caseStudy);
    
    setTimeout(() => {
      setCurrentStep(5);
      setIsProcessing(false);
    }, 800);
  };

  // Step 5: Interactive Game
  const handleStartGame = (role: 'miner' | 'user' | 'node') => {
    setIsProcessing(true);
    setUserRole(role);
    
    setTimeout(() => {
      const scenario = {
        situation: 'A controversial hard fork proposal has been made to increase block size.',
        yourRole: role,
        options: role === 'miner' ? 
          ['Signal support', 'Signal opposition', 'Remain neutral'] :
          role === 'user' ? 
          ['Pressure for activation', 'Oppose the fork', 'Wait and see'] :
          ['Upgrade node software', 'Keep old software', 'Run both versions'],
        consequences: {},
        choice: null
      };
      
      setGameScenario(scenario);
      setCurrentStep(6);
      setIsProcessing(false);
    }, 800);
  };

  // Handle game choice
  const handleGameChoice = (choice: string) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      let consequences = {};
      
      if (userRole === 'miner') {
        consequences = {
          'Signal support': 'Your hash power helps push activation. Other miners follow suit.',
          'Signal opposition': 'You resist the fork. Community pressure increases.',
          'Remain neutral': 'Fork activation stalls. UASF threats emerge.'
        };
      } else if (userRole === 'user') {
        consequences = {
          'Pressure for activation': 'You join UASF movement. Economic pressure on miners.',
          'Oppose the fork': 'You organize resistance. Network remains split on the issue.',
          'Wait and see': 'Market uncertainty continues. Price volatility increases.'
        };
      } else {
        consequences = {
          'Upgrade node software': 'You support the fork. Risk being on minority chain.',
          'Keep old software': 'You maintain compatibility but miss new features.',
          'Run both versions': 'You monitor both chains but use more resources.'
        };
      }
      
      setGameScenario((prev: any) => ({
        ...prev,
        choice,
        consequences
      }));
      
      // Simulate replay attack scenario for hard fork
      if (selectedForkType === 'hard' && !chainSplit?.replayProtection) {
        setReplayAttack({
          victim: 'Alice',
          transaction: 'Send 1 BTC to Bob',
          problem: 'Transaction broadcast on both chains',
          solution: 'Implement replay protection'
        });
      }
      
      setChallenge({
        completed: true,
        message: "Congratulations! You've navigated the complex world of Bitcoin forks and understand their impact on the network!",
        success: true
      });
      
      setTimeout(onComplete, 2000);
      setIsProcessing(false);
    }, 1500);
  };

  const resetSimulation = () => {
    setCurrentStep(1);
    setSelectedForkType(null);
    setNetworkNodes([]);
    setForkProposal(null);
    setActivationProgress(0);
    setChainSplit(null);
    setSelectedCaseStudy(null);
    setUserRole(null);
    setGameScenario(null);
    setReplayAttack(null);
    setChallenge({ completed: false, message: '', success: false });
  };

  return (
    <div className="py-6">
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'rgba(8, 28, 36, 0.6)' }}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
          Bitcoin Forks Challenge: When Networks Split and Evolve
        </h3>
        <p className="text-gray-300 mb-4">
          Explore how Bitcoin upgrades and evolves through forks. Learn the difference between soft and hard forks, 
          witness historical network splits, and understand the governance challenges of decentralized systems.
        </p>

        {/* Fork Concept Introduction */}
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
          <h4 className="font-semibold mb-3" style={{ color: bioluminescentTheme.colors.primary }}>
            🌳 Understanding Bitcoin Forks
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🔄</span>
                <span><strong>Soft Fork:</strong> Tightens rules, stays compatible with old software</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">⚡</span>
                <span><strong>Hard Fork:</strong> Changes rules, creates potential network split</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">🏛️</span>
                <span><strong>Governance:</strong> Miners, users, and developers coordinate changes</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-2xl mr-2">📡</span>
                <span><strong>Signaling:</strong> Nodes signal support for proposed changes</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">🔒</span>
                <span><strong>Replay Protection:</strong> Prevents transactions on wrong chain</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">⚖️</span>
                <span><strong>Consensus:</strong> Network must agree on the rules</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Introduction */}
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
              Initialize Bitcoin Network
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Let's start with a healthy Bitcoin network running smoothly. All nodes are synchronized and following 
            the same consensus rules. But change is coming...
          </p>

          <button
            onClick={handleIntroduceForks}
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
                Initializing Network...
              </>
            ) : (
              <>
                <Server className="mr-2 h-4 w-4" />
                Start Bitcoin Network
              </>
            )}
          </button>

          {networkNodes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {networkNodes.map((node, i) => (
                <div key={i} className="p-2 bg-black/40 rounded text-xs">
                  <div className="flex justify-between items-center">
                    <span>
                      {node.type === 'miner' ? '⛏️' : node.type === 'full' ? '🏛️' : '📱'} {node.name}
                    </span>
                    <span className="text-green-400">Block {node.blockHeight}</span>
                  </div>
                  <div className="text-gray-400">Version: {node.version} | Compatible: ✅</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Choose Fork Type */}
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
              Choose Your Fork Adventure
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            A network upgrade proposal has emerged! Choose whether to experience a soft fork (backward compatible) 
            or a hard fork (potentially creating a network split).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {Object.entries(FORK_TYPES).map(([type, config]) => (
              <div
                key={type}
                onClick={() => handleChooseFork(type as 'soft' | 'hard')}
                className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                  selectedForkType === type ? 'border-blue-400' : 'border-gray-600'
                } ${config.bgColor}`}
              >
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">{config.icon}</div>
                  <h5 className={`font-semibold ${config.color}`}>{config.name}</h5>
                </div>
                <div className="text-sm space-y-2">
                  <div><strong>Description:</strong> {config.description}</div>
                  <div><strong>Analogy:</strong> {config.analogy}</div>
                  <div><strong>Compatibility:</strong> {config.compatibility}</div>
                  <div><strong>Examples:</strong></div>
                  <ul className="text-xs text-gray-300 ml-4">
                    {config.examples.map((example, i) => (
                      <li key={i}>• {example}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {selectedForkType && (
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
              <h5 className="font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
                ✅ Fork Type Selected: {FORK_TYPES[selectedForkType].name}
              </h5>
              <p className="text-sm text-gray-300">
                You've chosen to explore a {selectedForkType} fork. Let's see how the network reacts!
              </p>
            </div>
          )}
        </div>

        {/* Step 3: Network Activation */}
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
              Network Signaling and Activation
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Watch as network participants upgrade their software and signal support for the fork proposal. 
            {selectedForkType === 'soft' ? 'A soft fork needs high miner support to activate safely.' : 'A hard fork will create two separate chains if not universally adopted.'}
          </p>

          {forkProposal && (
            <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: 'rgba(255, 165, 0, 0.1)' }}>
              <h5 className="font-semibold mb-2 text-orange-400">
                📋 Fork Proposal: {forkProposal.name}
              </h5>
              <div className="text-sm space-y-1">
                <div><strong>Type:</strong> {FORK_TYPES[selectedForkType!].name}</div>
                <div><strong>Description:</strong> {forkProposal.description}</div>
                <div><strong>Activation Height:</strong> {forkProposal.blockHeight}</div>
                <div><strong>Required Support:</strong> {forkProposal.activationThreshold}%</div>
              </div>
            </div>
          )}

          <button
            onClick={handleNetworkSignaling}
            disabled={currentStep < 3 || isProcessing || !selectedForkType}
            className="px-4 py-2 rounded text-white font-medium flex items-center text-sm mb-4"
            style={{ 
              backgroundColor: currentStep >= 3 && selectedForkType ? bioluminescentTheme.colors.primary : '#6b7280',
              opacity: (currentStep < 3 || isProcessing || !selectedForkType) ? 0.7 : 1
            }}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Nodes Signaling...
              </>
            ) : (
              <>
                <GitBranch className="mr-2 h-4 w-4" />
                Start Fork Activation
              </>
            )}
          </button>

          {activationProgress > 0 && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-black/40">
                <h5 className="font-semibold mb-2 text-blue-400">📡 Network Signaling Progress</h5>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${activationProgress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-blue-300">{activationProgress}% of network upgraded</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {networkNodes.map((node, i) => (
                  <div key={i} className={`p-2 rounded text-xs ${node.version === 'new' ? 'bg-blue-900/20 border border-blue-400' : 'bg-black/40'}`}>
                    <div className="flex justify-between items-center">
                      <span>
                        {node.type === 'miner' ? '⛏️' : node.type === 'full' ? '🏛️' : '📱'} {node.name}
                      </span>
                      <span className={node.version === 'new' ? 'text-blue-400' : 'text-gray-400'}>
                        {node.version} {node.signaling ? '📡' : ''}
                      </span>
                    </div>
                    <div className={`text-xs ${node.supportsFork ? 'text-green-400' : 'text-gray-400'}`}>
                      {node.supportsFork ? '✅ Supports fork' : '⏳ Not upgraded'}
                    </div>
                  </div>
                ))}
              </div>

              {chainSplit && (
                <div className="p-3 rounded-lg bg-red-900/20 border border-red-500">
                  <h5 className="font-semibold mb-2 text-red-400">⚡ Chain Split Detected!</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div><strong>Original Chain:</strong> {chainSplit.originalChain}</div>
                      <div><strong>New Chain:</strong> {chainSplit.newChain}</div>
                    </div>
                    <div>
                      <div><strong>Split Height:</strong> {chainSplit.splitHeight}</div>
                      <div><strong>Replay Protection:</strong> 
                        <span className={chainSplit.replayProtection ? 'text-green-400' : 'text-red-400'}>
                          {chainSplit.replayProtection ? ' ✅ Active' : ' ❌ Missing'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 4: Historical Case Studies */}
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
              Learn from Historical Forks
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Bitcoin has experienced several major forks throughout its history. Each tells a story of technical innovation, 
            community governance, and the challenges of upgrading decentralized systems.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {Object.entries(CASE_STUDIES).map(([key, study]) => (
              <div
                key={key}
                onClick={() => handleSelectCaseStudy(key as 'segwit' | 'taproot' | 'bch')}
                className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
                  selectedCaseStudy === key ? 'border-blue-400' : 'border-gray-600'
                } ${study.type === 'Soft Fork' ? 'bg-green-900/20' : 'bg-red-900/20'}`}
              >
                <div className="text-center mb-2">
                  <div className="text-2xl mb-1">{study.type === 'Soft Fork' ? '🔄' : '⚡'}</div>
                  <h5 className="font-semibold text-sm">{study.name}</h5>
                </div>
                <div className="text-xs text-gray-300">
                  <div><strong>Type:</strong> {study.type}</div>
                  <div><strong>Timeline:</strong> {study.timeline}</div>
                </div>
              </div>
            ))}
          </div>

          {selectedCaseStudy && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
              <h5 className="font-semibold mb-3" style={{ color: bioluminescentTheme.colors.primary }}>
                📚 Case Study: {CASE_STUDIES[selectedCaseStudy].name}
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div><strong>Description:</strong> {CASE_STUDIES[selectedCaseStudy].description}</div>
                  <div><strong>Activation Method:</strong> {CASE_STUDIES[selectedCaseStudy].activation}</div>
                  <div><strong>Controversy:</strong> {CASE_STUDIES[selectedCaseStudy].controversy}</div>
                </div>
                <div>
                  <div><strong>Key Benefits:</strong></div>
                  <ul className="text-xs text-gray-300 mt-1 ml-4">
                    {CASE_STUDIES[selectedCaseStudy].benefits.map((benefit, i) => (
                      <li key={i}>• {benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 5: Role Selection for Game */}
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
              Navigate the Fork: Choose Your Role
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Now it's your turn! Choose your role in the Bitcoin ecosystem and see how your decisions 
            can influence the outcome of a controversial fork proposal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[
              { role: 'miner', icon: '⛏️', name: 'Miner', description: 'You control hash power and can signal for/against forks' },
              { role: 'user', icon: '👤', name: 'Bitcoin User', description: 'You can create economic pressure and influence adoption' },
              { role: 'node', icon: '🏛️', name: 'Node Operator', description: 'You validate transactions and choose which rules to follow' }
            ].map((option) => (
              <div
                key={option.role}
                onClick={() => handleStartGame(option.role as 'miner' | 'user' | 'node')}
                className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                  userRole === option.role ? 'border-blue-400 bg-blue-900/20' : 'border-gray-600 bg-black/30'
                }`}
              >
                <div className="text-center mb-2">
                  <div className="text-3xl mb-2">{option.icon}</div>
                  <h5 className="font-semibold">{option.name}</h5>
                </div>
                <div className="text-xs text-gray-300 text-center">
                  {option.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 6: Interactive Game Scenario */}
        <div className={`space-y-4 mb-6 p-4 rounded-lg ${currentStep >= 6 ? 'bg-black/20' : 'bg-black/10 opacity-50'}`}>
          <div className="flex items-center mb-3">
            <span 
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold ${
                currentStep >= 6 ? 'text-white' : 'text-gray-500'
              }`}
              style={{ backgroundColor: currentStep >= 6 ? bioluminescentTheme.colors.primary : '#6b7280' }}
            >
              6
            </span>
            <h4 className="text-lg font-semibold" style={{ color: bioluminescentTheme.colors.secondary }}>
              Make Your Decision
            </h4>
          </div>

          {gameScenario && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 165, 0, 0.1)' }}>
                <h5 className="font-semibold mb-2 text-orange-400">🎭 Scenario</h5>
                <p className="text-sm text-gray-300 mb-3">{gameScenario.situation}</p>
                <div className="text-sm">
                  <strong>Your Role:</strong> {gameScenario.yourRole === 'miner' ? '⛏️ Miner' : gameScenario.yourRole === 'user' ? '👤 User' : '🏛️ Node Operator'}
                </div>
              </div>

              {!gameScenario.choice ? (
                <div>
                  <h5 className="font-semibold mb-3 text-gray-300">Choose Your Action:</h5>
                  <div className="grid grid-cols-1 gap-3">
                    {gameScenario.options.map((option: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => handleGameChoice(option)}
                        className="p-3 rounded-lg text-left border border-gray-600 hover:border-blue-400 transition-colors"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                      >
                        <div className="font-semibold text-blue-400">{option}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-500">
                    <h5 className="font-semibold mb-2 text-blue-400">✅ Your Choice: {gameScenario.choice}</h5>
                    <p className="text-sm text-blue-300">
                      {gameScenario.consequences[gameScenario.choice as keyof typeof gameScenario.consequences]}
                    </p>
                  </div>

                  {replayAttack && (
                    <div className="p-3 rounded-lg bg-red-900/20 border border-red-500">
                      <h5 className="font-semibold mb-2 text-red-400">⚠️ Replay Attack Detected!</h5>
                      <div className="text-sm space-y-1">
                        <div><strong>Victim:</strong> {replayAttack.victim}</div>
                        <div><strong>Transaction:</strong> {replayAttack.transaction}</div>
                        <div><strong>Problem:</strong> {replayAttack.problem}</div>
                        <div className="text-yellow-400"><strong>Solution:</strong> {replayAttack.solution}</div>
                      </div>
                    </div>
                  )}
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
            🔄 Explore Different Fork
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
            You've mastered Bitcoin forks! You understand the difference between soft and hard forks, how they affect network compatibility, 
            the role of community governance, and the challenges of upgrading decentralized systems. Forks are not bugs - they're how Bitcoin evolves!
          </p>
        </div>
      )}
    </div>
  );
}