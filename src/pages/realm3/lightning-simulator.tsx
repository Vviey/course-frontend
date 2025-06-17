import { useState, useEffect } from 'react';
import { Zap, Users, ArrowRight, CheckCircle, Clock, DollarSign, Lock, Unlock } from 'lucide-react';
import { bioluminescentTheme } from '@/lib/realm-themes';

interface LightningSimulatorProps {
  onComplete: () => void;
}

type SimulationStep = 'opening' | 'payments' | 'routing' | 'closing' | 'completed';

interface Channel {
  id: string;
  participants: string[];
  capacity: number;
  aliceBalance: number;
  bobBalance: number;
  isOpen: boolean;
  onChain: boolean;
}

export default function LightningSimulator({ onComplete }: LightningSimulatorProps) {
  const [currentStep, setCurrentStep] = useState<SimulationStep>('opening');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [transactionHistory, setTransactionHistory] = useState<string[]>([]);
  const [challenge, setChallenge] = useState({
    completed: false,
    message: '',
    success: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const addToHistory = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTransactionHistory(prev => [...prev, `${timestamp}: ${message}`]);
  };

  const openChannel = () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    addToHistory("Alice initiating channel opening with Bob...");
    
    setTimeout(() => {
      const newChannel: Channel = {
        id: 'alice-bob-001',
        participants: ['Alice', 'Bob'],
        capacity: 1.0,
        aliceBalance: 0.8,
        bobBalance: 0.2,
        isOpen: true,
        onChain: true
      };
      
      setChannels([newChannel]);
      addToHistory("✅ On-chain transaction confirmed! Channel opened with 1.0 BTC capacity");
      addToHistory("💰 Alice: 0.8 BTC, Bob: 0.2 BTC in channel");
      setIsProcessing(false);
      setCurrentStep('payments');
    }, 2000);
  };

  const sendPayment = (amount: number) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    addToHistory(`Alice sending ${amount} BTC to Bob...`);
    
    setTimeout(() => {
      setChannels(prev => prev.map(channel => {
        if (channel.id === 'alice-bob-001') {
          return {
            ...channel,
            aliceBalance: channel.aliceBalance - amount,
            bobBalance: channel.bobBalance + amount
          };
        }
        return channel;
      }));
      
      addToHistory(`⚡ Payment sent instantly! No on-chain transaction needed`);
      addToHistory(`💰 New balances - Alice: ${channels[0]?.aliceBalance - amount || 0} BTC, Bob: ${channels[0]?.bobBalance + amount || 0} BTC`);
      setIsProcessing(false);
    }, 1000);
  };

  const routePayment = () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    addToHistory("Alice wants to pay Carol but has no direct channel...");
    
    setTimeout(() => {
      const bobCarolChannel: Channel = {
        id: 'bob-carol-001',
        participants: ['Bob', 'Carol'],
        capacity: 0.5,
        aliceBalance: 0, // This represents Carol's balance
        bobBalance: 0.3,
        isOpen: true,
        onChain: false
      };
      
      setChannels(prev => [...prev, bobCarolChannel]);
      addToHistory("Setting up routing path: Alice → Bob → Carol");
      
      setTimeout(() => {
        addToHistory("🔐 Using HTLC (Hash Time-Locked Contract) for security");
        addToHistory("🧅 Payment routed with onion encryption for privacy");
        addToHistory("⚡ 0.1 BTC successfully routed from Alice to Carol!");
        
        setChannels(prev => prev.map(channel => {
          if (channel.id === 'alice-bob-001') {
            return {
              ...channel,
              aliceBalance: channel.aliceBalance - 0.1,
              bobBalance: channel.bobBalance + 0.1
            };
          }
          if (channel.id === 'bob-carol-001') {
            return {
              ...channel,
              bobBalance: channel.bobBalance - 0.1,
              aliceBalance: channel.aliceBalance + 0.1
            };
          }
          return channel;
        }));
        
        setIsProcessing(false);
        setCurrentStep('closing');
      }, 1500);
    }, 1500);
  };

  const closeChannel = () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    addToHistory("Alice initiating channel closure...");
    
    setTimeout(() => {
      addToHistory("📡 Broadcasting final channel state to Bitcoin blockchain");
      addToHistory("⛓️ On-chain settlement transaction confirmed");
      addToHistory("💰 Final balances settled on Bitcoin base layer");
      
      setChannels(prev => prev.map(channel => ({
        ...channel,
        isOpen: false,
        onChain: true
      })));
      
      setChallenge({
        completed: true,
        message: "Congratulations! You've successfully completed the Lightning Network simulation.",
        success: true
      });
      
      setIsProcessing(false);
      setCurrentStep('completed');
      
      setTimeout(onComplete, 2000);
    }, 2000);
  };

  const getStepActions = () => {
    switch (currentStep) {
      case 'opening':
        return (
          <button
            onClick={openChannel}
            disabled={isProcessing}
            className="px-4 py-2 rounded text-white font-medium flex items-center"
            style={{ 
              backgroundColor: bioluminescentTheme.colors.primary,
              opacity: isProcessing ? 0.7 : 1
            }}
          >
            {isProcessing ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Opening Channel...
              </>
            ) : (
              <>
                <Unlock className="mr-2 h-4 w-4" />
                Open Channel
              </>
            )}
          </button>
        );
      
      case 'payments':
        return (
          <div className="space-y-2">
            <button
              onClick={() => sendPayment(0.1)}
              disabled={isProcessing || !channels[0]?.isOpen}
              className="px-4 py-2 rounded text-white font-medium flex items-center mr-2"
              style={{ backgroundColor: bioluminescentTheme.colors.secondary }}
            >
              <Zap className="mr-2 h-4 w-4" />
              Send 0.1 BTC
            </button>
            <button
              onClick={() => setCurrentStep('routing')}
              disabled={isProcessing}
              className="px-4 py-2 rounded text-white font-medium flex items-center"
              style={{ backgroundColor: bioluminescentTheme.colors.accent1 }}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Try Multi-hop Payment
            </button>
          </div>
        );
      
      case 'routing':
        return (
          <button
            onClick={routePayment}
            disabled={isProcessing}
            className="px-4 py-2 rounded text-white font-medium flex items-center"
            style={{ backgroundColor: bioluminescentTheme.colors.accent2 }}
          >
            {isProcessing ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Routing Payment...
              </>
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" />
                Route via Bob
              </>
            )}
          </button>
        );
      
      case 'closing':
        return (
          <button
            onClick={closeChannel}
            disabled={isProcessing}
            className="px-4 py-2 rounded text-white font-medium flex items-center"
            style={{ backgroundColor: bioluminescentTheme.colors.primary }}
          >
            {isProcessing ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Closing Channel...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Close Channel
              </>
            )}
          </button>
        );
      
      default:
        return null;
    }
  };

  const getStepInfo = () => {
    switch (currentStep) {
      case 'opening':
        return {
          title: '🔓 Step 1: Open a Payment Channel',
          description: 'Alice and Bob will lock Bitcoin in a multi-signature address to create a payment channel.'
        };
      case 'payments':
        return {
          title: '⚡ Step 2: Send Lightning Payments',
          description: 'Now you can send instant payments between Alice and Bob with no on-chain transactions.'
        };
      case 'routing':
        return {
          title: '🔗 Step 3: Multi-hop Payment Routing',
          description: 'Alice can pay Carol even without a direct channel by routing through Bob.'
        };
      case 'closing':
        return {
          title: '🔒 Step 4: Close the Channel',
          description: 'When finished, the channel can be closed and final balances settled on-chain.'
        };
      case 'completed':
        return {
          title: '✅ Simulation Complete!',
          description: "You've experienced the full Lightning Network workflow!"
        };
      default:
        return { title: '', description: '' };
    }
  };

  return (
    <div className="py-6">
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'rgba(8, 28, 36, 0.6)' }}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
          ⚡ Lightning Network Interactive Simulation
        </h3>
        <p className="text-gray-300 mb-4">
          Experience how the Lightning Network enables instant, cheap Bitcoin payments through payment channels.
          Follow Alice, Bob, and Carol as they open channels, send payments, and settle on-chain.
        </p>
        
        {/* Network Visualization */}
        <div className="mb-6 p-4 bg-black/30 rounded-md">
          <h4 className="text-sm font-semibold mb-3" style={{ color: bioluminescentTheme.colors.secondary }}>
            Lightning Network Participants:
          </h4>
          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: bioluminescentTheme.colors.primary }}
              >
                <span className="text-white font-bold">A</span>
              </div>
              <p className="text-xs text-gray-300">Alice</p>
              <p className="text-xs" style={{ color: bioluminescentTheme.colors.accent1 }}>
                {channels[0]?.aliceBalance?.toFixed(1) || '1.0'} BTC
              </p>
            </div>
            
            {channels.length > 0 && (
              <div className="flex-1 flex items-center">
                <div 
                  className="flex-1 h-1 rounded"
                  style={{ backgroundColor: channels[0]?.isOpen ? bioluminescentTheme.colors.accent1 : 'gray' }}
                ></div>
                <div className="mx-2 text-xs text-gray-400">
                  {channels[0]?.isOpen ? '⚡ Open' : '🔒 Closed'}
                </div>
                <div 
                  className="flex-1 h-1 rounded"
                  style={{ backgroundColor: channels[0]?.isOpen ? bioluminescentTheme.colors.accent1 : 'gray' }}
                ></div>
              </div>
            )}
            
            <div className="text-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: bioluminescentTheme.colors.secondary }}
              >
                <span className="text-white font-bold">B</span>
              </div>
              <p className="text-xs text-gray-300">Bob</p>
              <p className="text-xs" style={{ color: bioluminescentTheme.colors.accent1 }}>
                {channels[0]?.bobBalance?.toFixed(1) || '0.5'} BTC
              </p>
            </div>
            
            {channels.length > 1 && (
              <>
                <div className="flex-1 flex items-center">
                  <div 
                    className="flex-1 h-1 rounded"
                    style={{ backgroundColor: channels[1]?.isOpen ? bioluminescentTheme.colors.accent2 : 'gray' }}
                  ></div>
                  <div className="mx-2 text-xs text-gray-400">
                    {channels[1]?.isOpen ? '⚡ Open' : '🔒 Closed'}
                  </div>
                  <div 
                    className="flex-1 h-1 rounded"
                    style={{ backgroundColor: channels[1]?.isOpen ? bioluminescentTheme.colors.accent2 : 'gray' }}
                  ></div>
                </div>
                
                <div className="text-center">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                    style={{ backgroundColor: bioluminescentTheme.colors.accent2 }}
                  >
                    <span className="text-white font-bold">C</span>
                  </div>
                  <p className="text-xs text-gray-300">Carol</p>
                  <p className="text-xs" style={{ color: bioluminescentTheme.colors.accent1 }}>
                    {channels[1]?.aliceBalance?.toFixed(1) || '0.3'} BTC
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Channel Information */}
        {channels.length > 0 && (
          <div className="mb-6 p-4 bg-black/30 rounded-md">
            <h4 className="text-sm font-semibold mb-3" style={{ color: bioluminescentTheme.colors.secondary }}>
              Active Channels:
            </h4>
            {channels.map((channel, index) => (
              <div key={channel.id} className="mb-2 p-3 bg-black/20 rounded border-l-4" 
                   style={{ borderLeftColor: bioluminescentTheme.colors.accent1 }}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {channel.participants.join(' ↔ ')}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    channel.isOpen ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                  }`}>
                    {channel.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Capacity: {channel.capacity} BTC | 
                  {channel.participants[0]}: {channel.aliceBalance.toFixed(1)} BTC | 
                  {channel.participants[1]}: {channel.bobBalance.toFixed(1)} BTC
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Current Step Instructions */}
        <div className="mb-4 p-4 rounded-md" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
          <h4 className="text-sm font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
            {getStepInfo().title}
          </h4>
          <p className="text-sm text-gray-300">
            {getStepInfo().description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-6">
          {getStepActions()}
        </div>

        {/* Transaction History */}
        <div className="mb-6 p-4 bg-black/30 rounded-md">
          <h4 className="text-sm font-semibold mb-2" style={{ color: bioluminescentTheme.colors.secondary }}>
            Transaction History:
          </h4>
          <div className="max-h-32 overflow-y-auto">
            {transactionHistory.length === 0 ? (
              <p className="text-xs text-gray-500">No transactions yet...</p>
            ) : (
              transactionHistory.map((tx, index) => (
                <p key={index} className="text-xs text-gray-300 mb-1 font-mono">
                  {tx}
                </p>
              ))
            )}
          </div>
        </div>

        {/* Educational Content */}
        <div className="bg-black/30 p-4 rounded-md">
          <h4 className="text-sm font-semibold mb-2" style={{ color: bioluminescentTheme.colors.secondary }}>
            Key Lightning Network Concepts:
          </h4>
          <ul className="text-sm space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="inline-block mr-2 mt-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: bioluminescentTheme.colors.accent1 }}></span>
              <span><strong>Payment Channels:</strong> Multi-signature Bitcoin addresses that enable off-chain transactions.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block mr-2 mt-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: bioluminescentTheme.colors.accent1 }}></span>
              <span><strong>HTLCs:</strong> Hash Time-Locked Contracts ensure atomic payments across the network.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block mr-2 mt-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: bioluminescentTheme.colors.accent1 }}></span>
              <span><strong>Routing:</strong> Payments can be sent through intermediate nodes without direct channels.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block mr-2 mt-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: bioluminescentTheme.colors.accent1 }}></span>
              <span><strong>Settlement:</strong> Final balances are recorded on the Bitcoin blockchain when channels close.</span>
            </li>
          </ul>
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
            Lightning Network Mastery Achieved! ⚡
          </h3>
          <p className="text-gray-300">
            You've successfully experienced how Lightning Network enables instant, cheap Bitcoin payments
            while maintaining security through the base layer. You now understand payment channels, routing,
            and settlement - the core building blocks of Bitcoin's scaling solution.
          </p>
        </div>
      )}
    </div>
  );
}