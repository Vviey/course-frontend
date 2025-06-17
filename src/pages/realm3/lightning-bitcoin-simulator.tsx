import { useState, useEffect } from 'react';
import { Clock, DollarSign, Eye, BarChart3, Zap, Link, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { bioluminescentTheme } from '@/lib/realm-themes';

interface LayerComparisonSimulatorProps {
  onComplete: () => void;
}

type TransactionMethod = 'onchain' | 'lightning' | null;
type TransactionStatus = 'pending' | 'mempool' | 'confirming' | 'completed' | 'failed';
type FeeLevel = 'low' | 'medium' | 'high';

interface Transaction {
  id: string;
  method: TransactionMethod;
  amount: number;
  fee: number;
  feeLevel?: FeeLevel;
  status: TransactionStatus;
  startTime: number;
  confirmationTime?: number;
  confirmations: number;
  estimatedTime: string;
  privacy: 'public' | 'private';
  route?: string[];
}

export default function LayerComparisonSimulator({ onComplete }: LayerComparisonSimulatorProps) {
  const [selectedMethod, setSelectedMethod] = useState<TransactionMethod>(null);
  const [amount, setAmount] = useState(0.001);
  const [feeLevel, setFeeLevel] = useState<FeeLevel>('medium');
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [completedTransactions, setCompletedTransactions] = useState<Transaction[]>([]);
  const [mempoolCongestion, setMempoolCongestion] = useState<'low' | 'medium' | 'high'>('medium');
  const [challenge, setChallenge] = useState({
    completed: false,
    message: '',
    success: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const getFeeInfo = (method: TransactionMethod, feeLevel: FeeLevel, amount: number) => {
    if (method === 'lightning') {
      return {
        fee: 0.000001, // 1 sat
        estimatedTime: '< 1 second',
        usdFee: '$0.00'
      };
    } else {
      const baseFees = {
        low: { sat: 5000, time: '30-60 mins' },
        medium: { sat: 15000, time: '10-30 mins' },
        high: { sat: 50000, time: '1-10 mins' }
      };
      
      const congestionMultiplier = {
        low: 1,
        medium: 2,
        high: 4
      };
      
      const finalFee = baseFees[feeLevel].sat * congestionMultiplier[mempoolCongestion];
      return {
        fee: finalFee / 100000000, // Convert to BTC
        estimatedTime: baseFees[feeLevel].time,
        usdFee: `$${(finalFee * 0.00001).toFixed(2)}` // Rough USD estimate
      };
    }
  };

  const sendTransaction = () => {
    if (!selectedMethod || isProcessing) return;
    
    setIsProcessing(true);
    const feeInfo = getFeeInfo(selectedMethod, feeLevel, amount);
    
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      method: selectedMethod,
      amount,
      fee: feeInfo.fee,
      feeLevel: selectedMethod === 'onchain' ? feeLevel : undefined,
      status: 'pending',
      startTime: Date.now(),
      confirmations: 0,
      estimatedTime: feeInfo.estimatedTime,
      privacy: selectedMethod === 'lightning' ? 'private' : 'public',
      route: selectedMethod === 'lightning' ? ['Alice', 'Bob'] : undefined
    };
    
    setCurrentTransaction(newTransaction);
    
    if (selectedMethod === 'lightning') {
      // Lightning: instant completion
      setTimeout(() => {
        setCurrentTransaction(prev => prev ? {
          ...prev,
          status: 'completed',
          confirmationTime: Date.now()
        } : null);
        setIsProcessing(false);
        
        setTimeout(() => {
          if (newTransaction) {
            setCompletedTransactions(prev => [...prev, { ...newTransaction, status: 'completed', confirmationTime: Date.now() }]);
            setCurrentTransaction(null);
            checkChallengeCompletion();
          }
        }, 1000);
      }, 500);
    } else {
      // On-chain: simulate mempool and confirmations
      setTimeout(() => {
        setCurrentTransaction(prev => prev ? { ...prev, status: 'mempool' } : null);
        
        setTimeout(() => {
          setCurrentTransaction(prev => prev ? { ...prev, status: 'confirming', confirmations: 1 } : null);
          
          const confirmationInterval = setInterval(() => {
            setCurrentTransaction(prev => {
              if (!prev || prev.confirmations >= 3) {
                clearInterval(confirmationInterval);
                if (prev) {
                  setTimeout(() => {
                    setCompletedTransactions(prevCompleted => [...prevCompleted, { ...prev, status: 'completed', confirmationTime: Date.now() }]);
                    setCurrentTransaction(null);
                    setIsProcessing(false);
                    checkChallengeCompletion();
                  }, 1000);
                }
                return prev ? { ...prev, status: 'completed', confirmationTime: Date.now() } : null;
              }
              return { ...prev, confirmations: prev.confirmations + 1 };
            });
          }, 2000);
        }, 3000);
      }, 2000);
    }
  };

  const checkChallengeCompletion = () => {
    const hasOnchain = completedTransactions.some(tx => tx.method === 'onchain') || 
                     (currentTransaction?.method === 'onchain' && currentTransaction.status === 'completed');
    const hasLightning = completedTransactions.some(tx => tx.method === 'lightning') || 
                        (currentTransaction?.method === 'lightning' && currentTransaction.status === 'completed');
    
    if (hasOnchain && hasLightning && !challenge.completed) {
      setChallenge({
        completed: true,
        message: "Excellent! You've experienced both Bitcoin layers and understand their trade-offs.",
        success: true
      });
      setTimeout(onComplete, 2000);
    }
  };

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400 animate-pulse" />;
      case 'mempool':
        return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'confirming':
        return <BarChart3 className="h-4 w-4 text-orange-400" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getElapsedTime = (startTime: number, endTime?: number) => {
    const elapsed = (endTime || Date.now()) - startTime;
    if (elapsed < 1000) return '< 1s';
    if (elapsed < 60000) return `${Math.floor(elapsed / 1000)}s`;
    return `${Math.floor(elapsed / 60000)}m ${Math.floor((elapsed % 60000) / 1000)}s`;
  };

  return (
    <div className="py-6">
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'rgba(8, 28, 36, 0.6)' }}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
          ⚖️ Bitcoin Base Layer vs Lightning Network Comparison
        </h3>
        <p className="text-gray-300 mb-4">
          Experience the differences between Bitcoin's Layer 1 (on-chain) and Layer 2 (Lightning Network).
          Send transactions using both methods and compare speed, cost, privacy, and user experience.
        </p>

        {/* Transaction Setup */}
        <div className="mb-6 p-4 bg-black/30 rounded-md">
          <h4 className="text-sm font-semibold mb-3" style={{ color: bioluminescentTheme.colors.secondary }}>
            Transaction Setup:
          </h4>
          
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: bioluminescentTheme.colors.secondary }}>
                Amount (BTC):
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                step="0.0001"
                min="0.0001"
                max="1"
                className="w-full p-2 bg-black/40 text-gray-100 border rounded text-base"
                style={{ borderColor: `${bioluminescentTheme.colors.primary}40` }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: bioluminescentTheme.colors.secondary }}>
                Network Congestion:
              </label>
              <select
                value={mempoolCongestion}
                onChange={(e) => setMempoolCongestion(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full p-2 bg-black/40 text-gray-100 border rounded text-base"
                style={{ borderColor: `${bioluminescentTheme.colors.primary}40` }}
              >
                <option value="low">Low Congestion</option>
                <option value="medium">Medium Congestion</option>
                <option value="high">High Congestion</option>
              </select>
            </div>

            {selectedMethod === 'onchain' && (
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: bioluminescentTheme.colors.secondary }}>
                  Fee Priority:
                </label>
                <select
                  value={feeLevel}
                  onChange={(e) => setFeeLevel(e.target.value as FeeLevel)}
                  className="w-full p-2 bg-black/40 text-gray-100 border rounded text-base"
                  style={{ borderColor: `${bioluminescentTheme.colors.primary}40` }}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                setSelectedMethod('onchain');
                setTimeout(sendTransaction, 100);
              }}
              disabled={isProcessing}
              className="p-4 rounded border text-left transition-colors"
              style={{ 
                backgroundColor: selectedMethod === 'onchain' ? `${bioluminescentTheme.colors.primary}20` : 'rgba(0,0,0,0.2)',
                borderColor: bioluminescentTheme.colors.primary,
                opacity: isProcessing ? 0.7 : 1
              }}
            >
              <div className="flex items-center mb-2">
                <Link className="mr-2 h-5 w-5" style={{ color: bioluminescentTheme.colors.primary }} />
                <span className="font-semibold">Bitcoin On-Chain (Layer 1)</span>
              </div>
              <div className="text-sm text-gray-300">
                <div>Fee: {getFeeInfo('onchain', feeLevel, amount).usdFee}</div>
                <div>Time: {getFeeInfo('onchain', feeLevel, amount).estimatedTime}</div>
                <div>Privacy: Public ledger</div>
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedMethod('lightning');
                setTimeout(sendTransaction, 100);
              }}
              disabled={isProcessing}
              className="p-4 rounded border text-left transition-colors"
              style={{ 
                backgroundColor: selectedMethod === 'lightning' ? `${bioluminescentTheme.colors.accent1}20` : 'rgba(0,0,0,0.2)',
                borderColor: bioluminescentTheme.colors.accent1,
                opacity: isProcessing ? 0.7 : 1
              }}
            >
              <div className="flex items-center mb-2">
                <Zap className="mr-2 h-5 w-5" style={{ color: bioluminescentTheme.colors.accent1 }} />
                <span className="font-semibold">Lightning Network (Layer 2)</span>
              </div>
              <div className="text-sm text-gray-300">
                <div>Fee: {getFeeInfo('lightning', feeLevel, amount).usdFee}</div>
                <div>Time: {getFeeInfo('lightning', feeLevel, amount).estimatedTime}</div>
                <div>Privacy: Encrypted routing</div>
              </div>
            </button>
          </div>
        </div>

        {/* Current Transaction Status */}
        {currentTransaction && (
          <div className="mb-6 p-4 bg-black/30 rounded-md">
            <h4 className="text-sm font-semibold mb-3 flex items-center" style={{ color: bioluminescentTheme.colors.secondary }}>
              {getStatusIcon(currentTransaction.status)}
              <span className="ml-2">Current Transaction Status</span>
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm space-y-1">
                  <div><strong>Method:</strong> {currentTransaction.method === 'onchain' ? 'Bitcoin On-Chain' : 'Lightning Network'}</div>
                  <div><strong>Amount:</strong> {currentTransaction.amount.toFixed(4)} BTC</div>
                  <div><strong>Fee:</strong> {currentTransaction.fee.toFixed(8)} BTC</div>
                  <div><strong>Status:</strong> {currentTransaction.status.charAt(0).toUpperCase() + currentTransaction.status.slice(1)}</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm space-y-1">
                  <div><strong>Elapsed:</strong> {getElapsedTime(currentTransaction.startTime, currentTransaction.confirmationTime)}</div>
                  <div><strong>Estimated:</strong> {currentTransaction.estimatedTime}</div>
                  {currentTransaction.method === 'onchain' && (
                    <div><strong>Confirmations:</strong> {currentTransaction.confirmations}/3</div>
                  )}
                  <div><strong>Privacy:</strong> {currentTransaction.privacy.charAt(0).toUpperCase() + currentTransaction.privacy.slice(1)}</div>
                </div>
              </div>
            </div>

            {currentTransaction.method === 'onchain' && currentTransaction.status === 'confirming' && (
              <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    backgroundColor: bioluminescentTheme.colors.primary,
                    width: `${(currentTransaction.confirmations / 3) * 100}%`
                  }}
                ></div>
              </div>
            )}
          </div>
        )}

        {/* Comparison Table */}
        <div className="mb-6 bg-black/30 rounded-md overflow-hidden">
          <h4 className="text-sm font-semibold p-4 pb-2" style={{ color: bioluminescentTheme.colors.secondary }}>
            Side-by-Side Comparison:
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-3 text-gray-300">Feature</th>
                  <th className="text-left p-3 text-gray-300">Bitcoin On-Chain</th>
                  <th className="text-left p-3 text-gray-300">Lightning Network</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-700">
                  <td className="p-3 font-semibold">Speed</td>
                  <td className="p-3 text-red-300">10-60 mins</td>
                  <td className="p-3 text-green-300">Instant (&lt;1 sec)</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 font-semibold">Fee</td>
                  <td className="p-3 text-red-300">$0.50-$10+</td>
                  <td className="p-3 text-green-300">&lt; $0.01</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 font-semibold">Privacy</td>
                  <td className="p-3 text-yellow-300">Public ledger</td>
                  <td className="p-3 text-green-300">Encrypted onion routing</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 font-semibold">Scaling</td>
                  <td className="p-3 text-red-300">7 tx/sec max</td>
                  <td className="p-3 text-green-300">Millions of tx/sec</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-3 font-semibold">Ideal for</td>
                  <td className="p-3">Large/final transactions</td>
                  <td className="p-3">Micro &amp; fast payments</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Offline Receiving</td>
                  <td className="p-3 text-green-300">✅ Yes</td>
                  <td className="p-3 text-red-300">❌ No (needs recipient online)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction History */}
        {completedTransactions.length > 0 && (
          <div className="mb-6 p-4 bg-black/30 rounded-md">
            <h4 className="text-sm font-semibold mb-3" style={{ color: bioluminescentTheme.colors.secondary }}>
              Transaction History:
            </h4>
            <div className="space-y-2">
              {completedTransactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center p-2 bg-black/20 rounded">
                  <div className="flex items-center">
                    {tx.method === 'onchain' ? 
                      <Link className="mr-2 h-4 w-4" style={{ color: bioluminescentTheme.colors.primary }} /> :
                      <Zap className="mr-2 h-4 w-4" style={{ color: bioluminescentTheme.colors.accent1 }} />
                    }
                    <span className="text-sm">
                      {tx.amount.toFixed(4)} BTC via {tx.method === 'onchain' ? 'On-Chain' : 'Lightning'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {getElapsedTime(tx.startTime, tx.confirmationTime)} | Fee: {tx.fee.toFixed(8)} BTC
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Educational Content */}
        <div className="bg-black/30 p-4 rounded-md">
          <h4 className="text-sm font-semibold mb-2" style={{ color: bioluminescentTheme.colors.secondary }}>
            When to Use Each Layer:
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold mb-1 text-blue-300">Use On-Chain When:</h5>
              <ul className="text-sm space-y-1 text-gray-300">
                <li className="flex items-start">
                  <span className="inline-block mr-2 mt-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: bioluminescentTheme.colors.primary }}></span>
                  <span>Making large value transfers</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block mr-2 mt-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: bioluminescentTheme.colors.primary }}></span>
                  <span>Final settlement is critical</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block mr-2 mt-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: bioluminescentTheme.colors.primary }}></span>
                  <span>Recipient might be offline</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block mr-2 mt-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: bioluminescentTheme.colors.primary }}></span>
                  <span>Maximum security needed</span>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-1 text-yellow-300">Use Lightning When:</h5>
              <ul className="text-sm space-y-1 text-gray-300">
                <li className="flex items-start">
                  <span className="inline-block mr-2 mt-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: bioluminescentTheme.colors.accent1 }}></span>
                  <span>Making small, frequent payments</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block mr-2 mt-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: bioluminescentTheme.colors.accent1 }}></span>
                  <span>Speed is critical</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block mr-2 mt-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: bioluminescentTheme.colors.accent1 }}></span>
                  <span>Minimizing fees</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block mr-2 mt-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: bioluminescentTheme.colors.accent1 }}></span>
                  <span>Enhanced privacy desired</span>
                </li>
              </ul>
            </div>
          </div>
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
            Layer Comparison Mastery Achieved! ⚖️
          </h3>
          <p className="text-gray-300">
            You've successfully experienced both Bitcoin layers and understand their trade-offs. 
            You now know when to use on-chain transactions for security and finality, and when to use 
            Lightning Network for speed and low costs. This knowledge is essential for efficient Bitcoin usage.
          </p>
        </div>
      )}
    </div>
  );
}