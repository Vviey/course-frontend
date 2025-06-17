import { useState, useEffect } from 'react';
import { Fingerprint, Check, RefreshCw, Key, Hash, MapPin, Shuffle, Send, Shield, Cpu, Zap, Code, Lock, Unlock, Layers, Eye, TreePine, Wallet, FileKey, Home, Waves, Anchor, Clock, Server, BookOpen, Users, AlertTriangle, GitBranch, Settings, ArrowDown, ArrowUp, Triangle, TrendingUp, Zap as Lightning, Globe } from 'lucide-react';
import { bioluminescentTheme } from '@/lib/realm-themes';

interface HashingSimulatorProps {
  onComplete: () => void;
}

export default function HashingSimulator({ onComplete }: HashingSimulatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [trilemmaState, setTrilemmaState] = useState({
    security: 70,
    decentralization: 70,
    scalability: 30
  });
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [upgradeDesign, setUpgradeDesign] = useState({
    blockSize: 50,
    signatureAggregation: 50,
    offChainComputation: 50,
    nodeRequirements: 50
  });
  const [triangleInteraction, setTriangleInteraction] = useState<{active: boolean, corner: string | null}>({
    active: false,
    corner: null
  });
  const [gameScore, setGameScore] = useState(0);
  const [currentMetrics, setCurrentMetrics] = useState({
    tps: 7,
    nodeCount: 15000,
    attackCost: 100
  });
  const [challenge, setChallenge] = useState({
    completed: false,
    message: '',
    success: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Scaling examples with their trilemma impacts
  const SCALING_EXAMPLES = {
    segwit: {
      name: 'SegWit (2017)',
      description: 'Separates witness data, increases effective block size',
      impact: { security: 75, decentralization: 75, scalability: 45 },
      pros: ['Modest TPS increase', 'Maintains decentralization', 'Enables Lightning'],
      cons: ['Limited scaling improvement', 'Complex implementation'],
      tps: 14
    },
    lightning: {
      name: 'Lightning Network',
      description: 'Layer 2 payment channels for instant transactions',
      impact: { security: 65, decentralization: 60, scalability: 90 },
      pros: ['Massive TPS increase', 'Instant payments', 'Low fees'],
      cons: ['Liquidity requirements', 'Watchtower dependencies', 'Channel management'],
      tps: 1000000
    },
    blocksize: {
      name: 'Block Size Increase (BCH)',
      description: 'Increases block size from 1MB to 8MB+',
      impact: { security: 60, decentralization: 40, scalability: 80 },
      pros: ['Higher on-chain TPS', 'Simple solution'],
      cons: ['Node centralization', 'Storage requirements', 'Bandwidth needs'],
      tps: 56
    },
    sharding: {
      name: 'Sharding (Other Chains)',
      description: 'Split blockchain into parallel shards',
      impact: { security: 50, decentralization: 45, scalability: 95 },
      pros: ['Massive scalability', 'Parallel processing'],
      cons: ['Complex security model', 'Cross-shard communication', 'Validator centralization'],
      tps: 100000
    }
  };

  // Calculate triangle balance score
  const calculateBalance = (state: typeof trilemmaState) => {
    const total = state.security + state.decentralization + state.scalability;
    const average = total / 3;
    const variance = Math.pow(state.security - average, 2) + 
                    Math.pow(state.decentralization - average, 2) + 
                    Math.pow(state.scalability - average, 2);
    return Math.max(0, 100 - Math.sqrt(variance / 3));
  };

  // Calculate metrics based on trilemma state
  const calculateMetrics = (state: typeof trilemmaState) => {
    const tps = Math.round(7 * (state.scalability / 30));
    const nodeCount = Math.round(15000 * (state.decentralization / 70));
    const attackCost = Math.round(100 * (state.security / 70));
    return { tps, nodeCount, attackCost };
  };

  // Step 1: Introduction to Trilemma
  const handleIntroduceTrilemma = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setCurrentStep(2);
      setIsProcessing(false);
    }, 800);
  };

  // Step 2: Interactive Triangle
  const handleTriangleInteraction = (corner: string, value: number) => {
    setTriangleInteraction({ active: true, corner });
    
    let newState = { ...trilemmaState };
    
    // Adjust the selected corner
    newState[corner as keyof typeof trilemmaState] = value;
    
    // Apply trilemma constraint - other corners suffer
    const remainingPoints = 200 - value;
    const otherCorners = Object.keys(trilemmaState).filter(k => k !== corner);
    
    otherCorners.forEach((otherCorner, index) => {
      newState[otherCorner as keyof typeof trilemmaState] = 
        Math.max(10, Math.min(90, remainingPoints / 2 + (Math.random() - 0.5) * 20));
    });
    
    setTrilemmaState(newState);
    setCurrentMetrics(calculateMetrics(newState));
    
    setTimeout(() => {
      setTriangleInteraction({ active: false, corner: null });
    }, 1000);
  };

  // Step 3: Apply Scaling Example
  const handleApplyExample = (exampleKey: string) => {
    setIsProcessing(true);
    setSelectedExample(exampleKey);
    
    setTimeout(() => {
      const example = SCALING_EXAMPLES[exampleKey as keyof typeof SCALING_EXAMPLES];
      setTrilemmaState(example.impact);
      setCurrentMetrics({ tps: example.tps, nodeCount: calculateMetrics(example.impact).nodeCount, attackCost: calculateMetrics(example.impact).attackCost });
      setCurrentStep(4);
      setIsProcessing(false);
    }, 1000);
  };

  // Step 4: Design Your Own Upgrade
  const handleUpgradeDesign = () => {
    // Calculate impact based on upgrade parameters
    const blockSizeImpact = (upgradeDesign.blockSize - 50) / 50;
    const sigAggImpact = (upgradeDesign.signatureAggregation - 50) / 50;
    const offChainImpact = (upgradeDesign.offChainComputation - 50) / 50;
    const nodeReqImpact = (upgradeDesign.nodeRequirements - 50) / 50;
    
    const newState = {
      security: Math.max(10, Math.min(90, 70 + sigAggImpact * 20 - nodeReqImpact * 15)),
      decentralization: Math.max(10, Math.min(90, 70 - blockSizeImpact * 30 - nodeReqImpact * 20)),
      scalability: Math.max(10, Math.min(90, 30 + blockSizeImpact * 40 + offChainImpact * 50 + sigAggImpact * 15))
    };
    
    setTrilemmaState(newState);
    setCurrentMetrics(calculateMetrics(newState));
    
    const balance = calculateBalance(newState);
    setGameScore(Math.round(balance + newState.scalability / 2));
    
    if (balance > 60 && newState.scalability > 50) {
      setCurrentStep(5);
    }
  };

  // Step 5: Complete Challenge
  const handleCompleteChallenge = () => {
    setChallenge({
      completed: true,
      message: "Congratulations! You've mastered the blockchain trilemma and understand why scaling Bitcoin is such a complex challenge!",
      success: true
    });
    
    setTimeout(onComplete, 2000);
  };

  const resetSimulation = () => {
    setCurrentStep(1);
    setTrilemmaState({ security: 70, decentralization: 70, scalability: 30 });
    setSelectedExample(null);
    setUpgradeDesign({ blockSize: 50, signatureAggregation: 50, offChainComputation: 50, nodeRequirements: 50 });
    setTriangleInteraction({ active: false, corner: null });
    setGameScore(0);
    setCurrentMetrics({ tps: 7, nodeCount: 15000, attackCost: 100 });
    setChallenge({ completed: false, message: '', success: false });
  };

  useEffect(() => {
    if (currentStep >= 4) {
      handleUpgradeDesign();
    }
  }, [upgradeDesign, currentStep]);

  return (
    <div className="py-6">
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'rgba(8, 28, 36, 0.6)' }}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
          Bitcoin Scaling Challenge: The Blockchain Trilemma
        </h3>
        <p className="text-gray-300 mb-4">
          Discover why scaling Bitcoin is one of the hardest problems in computer science. 
          Explore the fundamental tradeoffs between security, decentralization, and scalability through an interactive trilemma triangle.
        </p>

        {/* Trilemma Concept Introduction */}
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
          <h4 className="font-semibold mb-3" style={{ color: bioluminescentTheme.colors.primary }}>
            🔺 The Blockchain Trilemma
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-black/30 rounded">
              <div className="text-2xl mb-2">🔒</div>
              <h5 className="font-semibold text-green-400 mb-1">Security</h5>
              <p className="text-gray-300 text-xs">Resistance to attacks, immutability, cryptographic guarantees</p>
            </div>
            <div className="text-center p-3 bg-black/30 rounded">
              <div className="text-2xl mb-2">⚖️</div>
              <h5 className="font-semibold text-blue-400 mb-1">Decentralization</h5>
              <p className="text-gray-300 text-xs">Anyone can run nodes, no single points of control</p>
            </div>
            <div className="text-center p-3 bg-black/30 rounded">
              <div className="text-2xl mb-2">🚀</div>
              <h5 className="font-semibold text-orange-400 mb-1">Scalability</h5>
              <p className="text-gray-300 text-xs">High transaction throughput, low latency, global capacity</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-900/20 rounded border border-yellow-500">
            <p className="text-yellow-300 text-sm">
              💡 <strong>The Challenge:</strong> You can optimize any two, but the third will suffer. There's no perfect solution!
            </p>
          </div>
        </div>

        {/* Current Network Metrics */}
        <div className="mb-6 p-4 rounded-lg bg-black/30">
          <h5 className="font-semibold mb-3 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-blue-400" />
            Current Network Metrics
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-black/40 rounded">
              <div className="text-lg font-bold text-orange-400">{currentMetrics.tps}</div>
              <div className="text-gray-400">Transactions/Second</div>
            </div>
            <div className="text-center p-3 bg-black/40 rounded">
              <div className="text-lg font-bold text-blue-400">{currentMetrics.nodeCount.toLocaleString()}</div>
              <div className="text-gray-400">Active Nodes</div>
            </div>
            <div className="text-center p-3 bg-black/40 rounded">
              <div className="text-lg font-bold text-green-400">${currentMetrics.attackCost}B</div>
              <div className="text-gray-400">51% Attack Cost</div>
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
              Understand the Trilemma Challenge
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Bitcoin currently prioritizes security and decentralization over raw scalability. With ~7 transactions per second, 
            it's slower than traditional payment systems but offers unprecedented security and censorship resistance.
          </p>

          <button
            onClick={handleIntroduceTrilemma}
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
                Loading Trilemma...
              </>
            ) : (
              <>
                <Triangle className="mr-2 h-4 w-4" />
                Explore the Trilemma
              </>
            )}
          </button>

          {/* Interactive Trilemma Triangle */}
          <div className="relative">
            <div className="flex justify-center mb-6">
              <div className="relative w-80 h-80">
                {/* Triangle SVG */}
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Triangle outline */}
                  <polygon 
                    points="100,20 20,160 180,160" 
                    fill="rgba(6, 214, 160, 0.1)" 
                    stroke="#06d6a0" 
                    strokeWidth="2"
                  />
                  
                  {/* Dynamic triangle based on current state */}
                  <polygon 
                    points={`100,${20 + (100 - trilemmaState.security)}, ${20 + (100 - trilemmaState.decentralization)},160 ${180 - (100 - trilemmaState.scalability)},160`}
                    fill="rgba(6, 214, 160, 0.3)" 
                    stroke="#40e0d0" 
                    strokeWidth="2"
                  />
                  
                  {/* Corner labels and interactive areas */}
                  <circle 
                    cx="100" cy="20" r="8" 
                    fill="#10b981" 
                    className="cursor-pointer hover:r-12 transition-all"
                    onClick={() => currentStep >= 2 && handleTriangleInteraction('security', Math.min(90, trilemmaState.security + 10))}
                  />
                  <text x="100" y="10" textAnchor="middle" className="fill-white text-xs font-semibold">🔒 Security</text>
                  
                  <circle 
                    cx="20" cy="160" r="8" 
                    fill="#3b82f6" 
                    className="cursor-pointer hover:r-12 transition-all"
                    onClick={() => currentStep >= 2 && handleTriangleInteraction('decentralization', Math.min(90, trilemmaState.decentralization + 10))}
                  />
                  <text x="20" y="180" textAnchor="middle" className="fill-white text-xs font-semibold">⚖️ Decent.</text>
                  
                  <circle 
                    cx="180" cy="160" r="8" 
                    fill="#f97316" 
                    className="cursor-pointer hover:r-12 transition-all"
                    onClick={() => currentStep >= 2 && handleTriangleInteraction('scalability', Math.min(90, trilemmaState.scalability + 10))}
                  />
                  <text x="180" y="180" textAnchor="middle" className="fill-white text-xs font-semibold">🚀 Scale</text>
                </svg>
              </div>
            </div>

            {/* Trilemma Values */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-2 rounded bg-green-900/20">
                <div className="text-lg font-bold text-green-400">{trilemmaState.security}%</div>
                <div className="text-xs text-gray-400">Security</div>
              </div>
              <div className="p-2 rounded bg-blue-900/20">
                <div className="text-lg font-bold text-blue-400">{trilemmaState.decentralization}%</div>
                <div className="text-xs text-gray-400">Decentralization</div>
              </div>
              <div className="p-2 rounded bg-orange-900/20">
                <div className="text-lg font-bold text-orange-400">{trilemmaState.scalability}%</div>
                <div className="text-xs text-gray-400">Scalability</div>
              </div>
            </div>

            {triangleInteraction.active && (
              <div className="mt-4 p-3 rounded-lg bg-yellow-900/20 border border-yellow-500">
                <p className="text-yellow-300 text-sm">
                  🔄 Adjusting {triangleInteraction.corner}... Notice how other aspects are affected by the trilemma constraint!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Interactive Triangle */}
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
              Stretch the Triangle
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Click on any corner of the triangle above to try improving that aspect. 
            Watch how the triangle morphs and other properties suffer due to the trilemma constraint.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded bg-black/40">
              <h5 className="font-semibold text-green-400 mb-2">Improve Security 🔒</h5>
              <p className="text-xs text-gray-300">
                More validation, stronger cryptography, but slower transactions and higher node requirements.
              </p>
            </div>
            <div className="p-3 rounded bg-black/40">
              <h5 className="font-semibold text-blue-400 mb-2">Boost Decentralization ⚖️</h5>
              <p className="text-xs text-gray-300">
                Lower node requirements, more participants, but limited scalability and complexity constraints.
              </p>
            </div>
            <div className="p-3 rounded bg-black/40">
              <h5 className="font-semibold text-orange-400 mb-2">Increase Scalability 🚀</h5>
              <p className="text-xs text-gray-300">
                Higher TPS, but potentially centralized infrastructure or reduced security guarantees.
              </p>
            </div>
          </div>

          {currentStep >= 2 && (
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 rounded text-white font-medium flex items-center text-sm"
              style={{ backgroundColor: bioluminescentTheme.colors.primary }}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Explore Real-World Examples
            </button>
          )}
        </div>

        {/* Step 3: Real-World Scaling Examples */}
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
              Real-World Scaling Solutions
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            See how actual Bitcoin scaling solutions handle the trilemma. Each approach makes different tradeoffs 
            between security, decentralization, and scalability.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {Object.entries(SCALING_EXAMPLES).map(([key, example]) => (
              <div
                key={key}
                onClick={() => handleApplyExample(key)}
                className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                  selectedExample === key ? 'border-blue-400' : 'border-gray-600'
                } bg-black/30 hover:bg-black/50`}
              >
                <div className="flex items-center mb-2">
                  <div className="text-2xl mr-3">
                    {key === 'segwit' ? '🔄' : key === 'lightning' ? '⚡' : key === 'blocksize' ? '📦' : '🔀'}
                  </div>
                  <h5 className="font-semibold">{example.name}</h5>
                </div>
                <p className="text-sm text-gray-300 mb-3">{example.description}</p>
                
                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div className="text-center">
                    <div className={`font-bold ${example.impact.security > 70 ? 'text-green-400' : example.impact.security > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {example.impact.security}%
                    </div>
                    <div className="text-gray-400">Security</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-bold ${example.impact.decentralization > 70 ? 'text-green-400' : example.impact.decentralization > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {example.impact.decentralization}%
                    </div>
                    <div className="text-gray-400">Decent.</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-bold ${example.impact.scalability > 70 ? 'text-green-400' : example.impact.scalability > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {example.impact.scalability}%
                    </div>
                    <div className="text-gray-400">Scale</div>
                  </div>
                </div>
                
                <div className="text-xs text-purple-400">
                  <strong>TPS:</strong> {example.tps.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {selectedExample && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
              <h5 className="font-semibold mb-3" style={{ color: bioluminescentTheme.colors.primary }}>
                📊 Applied: {SCALING_EXAMPLES[selectedExample as keyof typeof SCALING_EXAMPLES].name}
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="mb-2"><strong>Advantages:</strong></div>
                  <ul className="text-xs text-green-300 space-y-1">
                    {SCALING_EXAMPLES[selectedExample as keyof typeof SCALING_EXAMPLES].pros.map((pro, i) => (
                      <li key={i}>✅ {pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="mb-2"><strong>Tradeoffs:</strong></div>
                  <ul className="text-xs text-red-300 space-y-1">
                    {SCALING_EXAMPLES[selectedExample as keyof typeof SCALING_EXAMPLES].cons.map((con, i) => (
                      <li key={i}>⚠️ {con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Design Your Own Upgrade */}
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
              Design Your Scaling Solution
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Now it's your turn! Adjust the parameters below to design your own scaling upgrade. 
            Try to balance the trilemma while improving transaction throughput.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Block Size: {upgradeDesign.blockSize}%</label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={upgradeDesign.blockSize}
                    onChange={(e) => setUpgradeDesign(prev => ({ ...prev, blockSize: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none slider"
                    style={{ accentColor: bioluminescentTheme.colors.primary }}
                  />
                  <p className="text-xs text-gray-400">Larger blocks = more TPS, but harder to run nodes</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Signature Aggregation: {upgradeDesign.signatureAggregation}%</label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={upgradeDesign.signatureAggregation}
                    onChange={(e) => setUpgradeDesign(prev => ({ ...prev, signatureAggregation: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none slider"
                    style={{ accentColor: bioluminescentTheme.colors.secondary }}
                  />
                  <p className="text-xs text-gray-400">Batch signatures = space savings and better security</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Off-Chain Computation: {upgradeDesign.offChainComputation}%</label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={upgradeDesign.offChainComputation}
                    onChange={(e) => setUpgradeDesign(prev => ({ ...prev, offChainComputation: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none slider"
                    style={{ accentColor: bioluminescentTheme.colors.accent1 }}
                  />
                  <p className="text-xs text-gray-400">Layer 2 solutions = massive scaling, new trust models</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Node Requirements: {upgradeDesign.nodeRequirements}%</label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={upgradeDesign.nodeRequirements}
                    onChange={(e) => setUpgradeDesign(prev => ({ ...prev, nodeRequirements: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none slider"
                    style={{ accentColor: bioluminescentTheme.colors.accent2 }}
                  />
                  <p className="text-xs text-gray-400">Higher requirements = better performance, fewer participants</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-black/40">
              <h5 className="font-semibold mb-2 text-blue-400">Your Design Results:</h5>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-400">{currentMetrics.tps}</div>
                  <div className="text-gray-400">TPS</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">{currentMetrics.nodeCount.toLocaleString()}</div>
                  <div className="text-gray-400">Nodes</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">${currentMetrics.attackCost}B</div>
                  <div className="text-gray-400">Attack Cost</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400">{Math.round(calculateBalance(trilemmaState))}</div>
                  <div className="text-gray-400">Balance Score</div>
                </div>
              </div>
            </div>

            {gameScore > 70 && (
              <div className="p-3 rounded-lg bg-green-900/20 border border-green-500">
                <h5 className="font-semibold text-green-400 mb-2">🎉 Excellent Design!</h5>
                <p className="text-sm text-green-300">
                  Score: {gameScore}/100 - You've created a well-balanced scaling solution that maintains the trilemma equilibrium 
                  while significantly improving throughput. Real protocol designers face these exact same challenges!
                </p>
                <button
                  onClick={handleCompleteChallenge}
                  className="mt-3 px-4 py-2 rounded text-white font-medium text-sm"
                  style={{ backgroundColor: bioluminescentTheme.colors.primary }}
                >
                  Complete Challenge
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={resetSimulation}
            className="px-6 py-2 rounded text-white font-medium"
            style={{ backgroundColor: bioluminescentTheme.colors.secondary }}
          >
            🔄 Try Different Approach
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
            You've mastered the blockchain trilemma! You understand why scaling Bitcoin is so challenging and how different 
            solutions make various tradeoffs. There's no perfect solution - only creative engineering that pushes the boundaries 
            of what's possible while maintaining Bitcoin's core values of security and decentralization.
          </p>
        </div>
      )}
    </div>
  );
}