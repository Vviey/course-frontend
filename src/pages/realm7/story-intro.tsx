import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

// Type definitions
type FuturePath = 'extractive' | 'centralized' | 'decentralized' | 'ubuntu';
type ChallengeDecision = 'educate' | 'resist' | 'migrate' | 'build' | 'lightning' | 'barter' | 'sats' | 'hybrid';

interface FutureScenario {
  id: string;
  title: string;
  description: string;
  challenge: string;
  decisions: {
    option: ChallengeDecision;
    label: string;
    impact: {
      freedom: number;
      fairness: number;
      sustainability: number;
      ubuntu: number;
    };
  }[];
}

interface TimeRippleMetrics {
  freedom: number;
  fairness: number;
  sustainability: number;
  ubuntu: number;
}

const HorizonBeyondSimulation = () => {
  const [, setLocation] = useLocation();
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'memory-gates' | 'future-paths' | 'final-reflection'>('intro');
  const [selectedPath, setSelectedPath] = useState<FuturePath | null>(null);
  const [decisions, setDecisions] = useState<Record<string, ChallengeDecision>>({});
  const [metrics, setMetrics] = useState<TimeRippleMetrics>({
    freedom: 50,
    fairness: 50,
    sustainability: 50,
    ubuntu: 50
  });
  const [showOutcome, setShowOutcome] = useState(false);
  const [futureHeadline, setFutureHeadline] = useState('');
  const [completedRealms, setCompletedRealms] = useState<string[]>([]);

  // Future scenarios
  const [scenarios] = useState<FutureScenario[]>([
    {
      id: 'ban-scenario',
      title: 'The Great Ban',
      description: 'Your government declares Bitcoin illegal, freezing known wallets and arresting node operators.',
      challenge: 'How do you respond?',
      decisions: [
        {
          option: 'educate',
          label: 'Organize secret education camps',
          impact: { freedom: 10, fairness: 5, sustainability: 0, ubuntu: 15 }
        },
        {
          option: 'resist',
          label: 'Run underground nodes with mesh networks',
          impact: { freedom: 20, fairness: 10, sustainability: -5, ubuntu: 5 }
        },
        {
          option: 'migrate',
          label: 'Help node operators flee to safe jurisdictions',
          impact: { freedom: 15, fairness: 5, sustainability: 10, ubuntu: 10 }
        },
        {
          option: 'build',
          label: 'Create stealth wallet tech with privacy coins',
          impact: { freedom: 25, fairness: 15, sustainability: 5, ubuntu: 0 }
        }
      ]
    },
    {
      id: 'corporate-scenario',
      title: 'Digital Leviathan',
      description: 'A megacorp offers "free" digital money with full surveillance and behavioral scoring.',
      challenge: 'Your community considers adopting it. What do you do?',
      decisions: [
        {
          option: 'lightning',
          label: 'Onboard everyone to Lightning with privacy tools',
          impact: { freedom: 20, fairness: 15, sustainability: 10, ubuntu: 20 }
        },
        {
          option: 'resist',
          label: 'Organize protests against corporate surveillance',
          impact: { freedom: 15, fairness: 20, sustainability: 5, ubuntu: 10 }
        },
        {
          option: 'barter',
          label: 'Revive local barter systems as resistance',
          impact: { freedom: 10, fairness: 25, sustainability: 15, ubuntu: 30 }
        },
        {
          option: 'hybrid',
          label: 'Create a hybrid system (Bitcoin + local credit)',
          impact: { freedom: 15, fairness: 20, sustainability: 20, ubuntu: 25 }
        }
      ]
    },
    {
      id: 'collapse-scenario',
      title: 'After the Collapse',
      description: 'The national currency hyperinflates. Your village must rebuild its economy from scratch.',
      challenge: 'What foundation do you propose?',
      decisions: [
        {
          option: 'sats',
          label: 'Bitcoin standard with community mining',
          impact: { freedom: 25, fairness: 15, sustainability: -10, ubuntu: 10 }
        },
        {
          option: 'barter',
          label: 'Gift economy with mutual credit ledger',
          impact: { freedom: 10, fairness: 25, sustainability: 20, ubuntu: 30 }
        },
        {
          option: 'hybrid',
          label: 'Bitcoin for large transactions, barter for local',
          impact: { freedom: 20, fairness: 20, sustainability: 15, ubuntu: 25 }
        },
        {
          option: 'build',
          label: 'Create a new asset-backed community currency',
          impact: { freedom: 15, fairness: 20, sustainability: 10, ubuntu: 20 }
        }
      ]
    }
  ]);

  // Memory gates representing past realms
  const memoryGates = [
    {
      id: 'barter-realm',
      name: 'Realm Of Origin',
      question: "What did barter teach us about trust's role in value exchange?",
      answers: [
        { text: "Trust is unnecessary with perfect records", value: { freedom: -5, fairness: -5, sustainability: 0, ubuntu: -10 } },
        { text: "Trust is localized and personal", value: { freedom: 5, fairness: 10, sustainability: 0, ubuntu: 15 } },
        { text: "Trust is inefficient compared to algorithms", value: { freedom: 10, fairness: -5, sustainability: 0, ubuntu: -10 } }
      ]
    },
    {
      id: 'fiat-realm',
      name: 'Central Citadel',
      question: "What was the fatal flaw of centralized digital money?",
      answers: [
        { text: "It was too slow to innovate", value: { freedom: -5, fairness: -5, sustainability: 0, ubuntu: 0 } },
        { text: "It enabled surveillance and control", value: { freedom: 15, fairness: 10, sustainability: 5, ubuntu: 5 } },
        { text: "It excluded too many people", value: { freedom: 5, fairness: 15, sustainability: 0, ubuntu: 10 } }
      ]
    },
    {
      id: 'bitcoin-realm',
      name: 'Forest Of Spark',
      question: "Bitcoin's core innovation was...",
      answers: [
        { text: "Digital scarcity", value: { freedom: 5, fairness: 0, sustainability: -5, ubuntu: 0 } },
        { text: "Decentralized consensus", value: { freedom: 15, fairness: 10, sustainability: 0, ubuntu: 5 } },
        { text: "Programmable money", value: { freedom: 10, fairness: 5, sustainability: 5, ubuntu: 0 } }
      ]
    },
    {
      id: 'ubuntu-realm',
      name: 'Ubuntu Village',
      question: "Ubuntu economics teaches us...",
      answers: [
        { text: "Community precedes individuality", value: { freedom: -5, fairness: 15, sustainability: 10, ubuntu: 20 } },
        { text: "Sharing creates abundance", value: { freedom: 5, fairness: 20, sustainability: 15, ubuntu: 25 } },
        { text: "All wealth is relational", value: { freedom: 0, fairness: 15, sustainability: 10, ubuntu: 30 } }
      ]
    }
  ];

  const [gateAnswers, setGateAnswers] = useState<Record<string, number>>({});

  // Update metrics when decisions change
  useEffect(() => {
    const newMetrics = { freedom: 50, fairness: 50, sustainability: 50, ubuntu: 50 };
    
    // Add gate answers impact
    Object.values(gateAnswers).forEach(answerIndex => {
      const gate = memoryGates.find(g => g.id in gateAnswers);
      if (gate) {
        const answer = gate.answers[answerIndex];
        Object.keys(newMetrics).forEach(key => {
          newMetrics[key as keyof TimeRippleMetrics] += answer.value[key as keyof TimeRippleMetrics];
        });
      }
    });
    
    // Add scenario decisions impact
    Object.entries(decisions).forEach(([scenarioId, decision]) => {
      const scenario = scenarios.find(s => s.id === scenarioId);
      if (scenario) {
        const decisionData = scenario.decisions.find(d => d.option === decision);
        if (decisionData) {
          Object.keys(newMetrics).forEach(key => {
            newMetrics[key as keyof TimeRippleMetrics] += decisionData.impact[key as keyof TimeRippleMetrics];
          });
        }
      }
    });
    
    // Clamp values between 0 and 100
    Object.keys(newMetrics).forEach(key => {
      newMetrics[key as keyof TimeRippleMetrics] = Math.max(0, Math.min(100, newMetrics[key as keyof TimeRippleMetrics]));
    });
    
    setMetrics(newMetrics);
  }, [gateAnswers, decisions]);

  // Determine the final path based on metrics
  useEffect(() => {
    if (Object.keys(decisions).length === scenarios.length && currentPhase === 'final-reflection') {
      if (metrics.ubuntu > 70 && metrics.freedom > 60) {
        setSelectedPath('ubuntu');
      } else if (metrics.freedom > 70 && metrics.fairness > 60) {
        setSelectedPath('decentralized');
      } else if (metrics.freedom < 40 && metrics.ubuntu < 40) {
        setSelectedPath('extractive');
      } else {
        setSelectedPath('centralized');
      }
      setShowOutcome(true);
    }
  }, [decisions, metrics, currentPhase]);

  const handleGateAnswer = (gateId: string, answerIndex: number) => {
    setGateAnswers(prev => ({ ...prev, [gateId]: answerIndex }));
    setCompletedRealms(prev => [...prev, gateId]);
    
    // Move to next gate or phase when all answered
    if (completedRealms.length + 1 >= memoryGates.length) {
      setTimeout(() => setCurrentPhase('future-paths'), 1500);
    }
  };

  const handleScenarioDecision = (scenarioId: string, decision: ChallengeDecision) => {
    setDecisions(prev => ({ ...prev, [scenarioId]: decision }));
    
    // Move to final reflection when all scenarios decided
    if (Object.keys(decisions).length + 1 >= scenarios.length) {
      setTimeout(() => setCurrentPhase('final-reflection'), 1500);
    }
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 'intro':
        return (
          <div className="text-center space-y-8 animate-fadeIn">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              The Horizon Beyond
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              "You've journeyed through the ages of money. Now stand at the edge of time and shape what comes next."
            </p>
            <div className="text-6xl my-8">🌌</div>
            <button
              onClick={() => setCurrentPhase('memory-gates')}
              className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all"
            >
              Begin Final Trial
            </button>
          </div>
        );
      
      case 'memory-gates':
        return (
          <div className="space-y-12">
            <h2 className="text-3xl font-bold text-center text-purple-300">Memory Gateways</h2>
            <p className="text-center text-gray-400">Answer wisely—your past shapes your future</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {memoryGates.map((gate, index) => (
                <div 
                  key={gate.id}
                  className={`bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border-2 ${gateAnswers[gate.id] !== undefined ? 'border-green-500' : 'border-purple-500'} transition-all`}
                >
                  <div className="flex items-center mb-4">
                    <div className="text-2xl mr-3">{index + 1}.</div>
                    <h3 className="text-xl font-semibold text-purple-300">{gate.name}</h3>
                  </div>
                  <p className="text-gray-300 mb-4">{gate.question}</p>
                  
                  <div className="space-y-3">
                    {gate.answers.map((answer, i) => (
                      <button
                        key={i}
                        onClick={() => handleGateAnswer(gate.id, i)}
                        disabled={gateAnswers[gate.id] !== undefined}
                        className={`w-full text-left p-3 rounded-lg transition-all ${gateAnswers[gate.id] === i ? 'bg-green-900 text-green-100' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'} ${gateAnswers[gate.id] !== undefined && gateAnswers[gate.id] !== i ? 'opacity-50' : ''}`}
                      >
                        {answer.text}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'future-paths':
        return (
          <div className="space-y-12">
            <h2 className="text-3xl font-bold text-center text-blue-300">Forked Futures</h2>
            <p className="text-center text-gray-400">Your choices ripple through time</p>
            
            <div className="space-y-8">
              {scenarios.map(scenario => (
                <div key={scenario.id} className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border-2 border-blue-500">
                  <h3 className="text-xl font-semibold text-blue-300 mb-2">{scenario.title}</h3>
                  <p className="text-gray-300 mb-4">{scenario.description}</p>
                  <p className="font-medium text-yellow-200 mb-4">{scenario.challenge}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scenario.decisions.map(decision => (
                      <button
                        key={decision.option}
                        onClick={() => handleScenarioDecision(scenario.id, decision.option)}
                        disabled={decisions[scenario.id] !== undefined}
                        className={`p-4 rounded-lg transition-all ${decisions[scenario.id] === decision.option ? 'bg-blue-900 text-blue-100' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'} ${decisions[scenario.id] !== undefined && decisions[scenario.id] !== decision.option ? 'opacity-50' : ''}`}
                      >
                        <div className="font-medium">{decision.label}</div>
                        <div className="text-xs mt-2 text-gray-400">
                          Impact: {Object.entries(decision.impact).map(([key, val]) => (
                            <span key={key} className="mr-2">
                              {key}: {val > 0 ? '+' : ''}{val}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Time Ripple Meter */}
            <div className="bg-gray-900 bg-opacity-80 p-6 rounded-xl border border-yellow-500 mt-8">
              <h3 className="text-xl font-semibold text-yellow-300 mb-4">Time Ripple Meter</h3>
              <div className="space-y-4">
                {Object.entries(metrics).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300 capitalize">{key}</span>
                      <span className="text-gray-400">{value}/100</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${key === 'freedom' ? 'bg-blue-500' : key === 'fairness' ? 'bg-green-500' : key === 'sustainability' ? 'bg-emerald-500' : 'bg-purple-500'}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'final-reflection':
        return (
          <div className="space-y-8 text-center animate-fadeIn">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
              Your Sovereign Future
            </h2>
            
            {showOutcome && selectedPath && (
              <div className="mt-8">
                {selectedPath === 'ubuntu' && (
                  <div className="bg-gradient-to-br from-purple-900 to-green-900 p-8 rounded-xl border-2 border-green-500">
                    <div className="text-6xl mb-4">🌍</div>
                    <h3 className="text-2xl font-bold text-green-300 mb-2">Path of Harmony</h3>
                    <p className="text-gray-300 mb-4">
                      You blended Bitcoin's sovereignty with Ubuntu's wisdom. Your communities thrive through:
                    </p>
                    <ul className="text-left max-w-md mx-auto space-y-2 text-gray-200">
                      <li>• Circular Bitcoin economies with local mutual aid</li>
                      <li>• Education that roots tech in cultural values</li>
                      <li>• Decentralized nodes managed as community trusts</li>
                    </ul>
                    <p className="mt-6 text-green-200 font-medium">
                      "The tree does not eat its own fruit. The river does not drink its own water."
                    </p>
                  </div>
                )}
                
                {selectedPath === 'decentralized' && (
                  <div className="bg-gradient-to-br from-blue-900 to-indigo-900 p-8 rounded-xl border-2 border-blue-500">
                    <div className="text-6xl mb-4">🕊️</div>
                    <h3 className="text-2xl font-bold text-blue-300 mb-2">Path of Freedom</h3>
                    <p className="text-gray-300 mb-4">
                      You chose radical decentralization. The future features:
                    </p>
                    <ul className="text-left max-w-md mx-auto space-y-2 text-gray-200">
                      <li>• Censorship-resistant financial networks</li>
                      <li>• Privacy-focused tools and protocols</li>
                      <li>• A thriving ecosystem of open-source builders</li>
                    </ul>
                    <p className="mt-6 text-blue-200 font-medium">
                      "Don't trust, verify—but build so others don't have to."
                    </p>
                  </div>
                )}
                
                {selectedPath === 'extractive' && (
                  <div className="bg-gradient-to-br from-red-900 to-amber-900 p-8 rounded-xl border-2 border-red-500">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-2xl font-bold text-red-300 mb-2">Path of Power</h3>
                    <p className="text-gray-300 mb-4">
                      Efficiency and control dominated your choices. The consequences:
                    </p>
                    <ul className="text-left max-w-md mx-auto space-y-2 text-gray-200">
                      <li>• Centralized digital infrastructure</li>
                      <li>• Wealth concentrated in tech elites</li>
                      <li>• Constant surveillance and social scoring</li>
                    </ul>
                    <p className="mt-6 text-red-200 font-medium">
                      "The master's tools will never dismantle the master's house."
                    </p>
                  </div>
                )}
                
                {selectedPath === 'centralized' && (
                  <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-8 rounded-xl border-2 border-gray-500">
                    <div className="text-6xl mb-4">🏙️</div>
                    <h3 className="text-2xl font-bold text-gray-300 mb-2">Path of Control</h3>
                    <p className="text-gray-300 mb-4">
                      You accepted some centralization for stability. The result:
                    </p>
                    <ul className="text-left max-w-md mx-auto space-y-2 text-gray-200">
                      <li>• Convenient but controlled digital money</li>
                      <li>• Corporate-run financial services</li>
                      <li>• Gradual erosion of privacy and autonomy</li>
                    </ul>
                    <p className="mt-6 text-gray-400 font-medium">
                      "The road to dystopia is paved with good intentions."
                    </p>
                  </div>
                )}
                
                <div className="mt-8 bg-gray-900 bg-opacity-70 p-6 rounded-xl border border-yellow-400">
                  <h4 className="text-xl font-semibold text-yellow-300 mb-4">Write the Headline</h4>
                  <p className="text-gray-400 mb-4">Complete this future headline based on your path:</p>
                  <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                    <input
                      type="text"
                      value={futureHeadline}
                      onChange={(e) => setFutureHeadline(e.target.value)}
                      placeholder="e.g. 'Community Bitcoin Nodes Power Local Economies'"
                      className="flex-1 p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (futureHeadline) {
                          navigator.clipboard.writeText(
                            `🚀 My Bitcoin Future: "${futureHeadline}"\n` +
                            `Path: ${selectedPath === 'ubuntu' ? 'Harmony' : selectedPath === 'decentralized' ? 'Freedom' : selectedPath === 'extractive' ? 'Power' : 'Control'}\n` +
                            `Freedom: ${metrics.freedom} | Fairness: ${metrics.fairness} | Ubuntu: ${metrics.ubuntu}`
                          );
                        }
                      }}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
                    >
                      Copy & Share
                    </button>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button
                    onClick={() => setLocation('/')}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 px-8 rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all"
                  >
                    Claim Your Seed of Sovereignty
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      className="min-h-screen p-6 md:p-12 bg-gradient-to-b from-gray-900 to-black text-white"
      style={{
        backgroundImage: currentPhase === 'intro' ? 
          "radial-gradient(circle at center, rgba(125, 211, 252, 0.1) 0%, transparent 70%)" : 
          "none"
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => setLocation('/realm/6')}
            className="flex items-center text-blue-400 hover:text-blue-300 transition-all"
          >
            Continue with Your Final Challenge →
          </button>
          <div className="text-sm text-gray-500">
            Final Trial: The Horizon Beyond
          </div>
        </div>
        
        {/* Main content */}
        <div className="mt-12">
          {renderPhase()}
        </div>
      </div>
      
      {/* Floating Asha character */}
      <div className="fixed bottom-8 right-8 z-10">
        <div 
          className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg cursor-pointer hover:scale-110 transition-all"
          title="Asha - Your Guide"
        >
          👩🏽
        </div>
      </div>
    </div>
  );
};

export default HorizonBeyondSimulation;