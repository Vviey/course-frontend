import { useState, useEffect } from 'react';
import { Fingerprint, Check, RefreshCw, Key, Hash, MapPin, Shuffle, Send, Shield, Cpu, Zap, Code, Lock, Unlock, Layers, Eye } from 'lucide-react';
import { bioluminescentTheme } from '@/lib/realm-themes';

interface HashingSimulatorProps {
  onComplete: () => void;
}

export default function HashingSimulator({ onComplete }: HashingSimulatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [treasureChest, setTreasureChest] = useState({ locked: true, puzzle: '', solution: '' });
  const [scriptPubKey, setScriptPubKey] = useState<string[]>([]);
  const [scriptSig, setScriptSig] = useState<string[]>([]);
  const [stack, setStack] = useState<string[]>([]);
  const [executionLog, setExecutionLog] = useState<Array<{step: string, stack: string[], operation: string, description: string}>>([]);
  const [currentOperation, setCurrentOperation] = useState(0);
  const [validationResult, setValidationResult] = useState<{valid: boolean, message: string} | null>(null);
  const [userKeys, setUserKeys] = useState({ publicKey: '', signature: '', pubKeyHash: '' });
  const [challenge, setChallenge] = useState({
    completed: false,
    message: '',
    success: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAnalogy, setShowAnalogy] = useState(true);

  // Helper functions
  const generateMockData = () => {
    const publicKey = 'PublicKey_' + Math.random().toString(16).substring(2, 10);
    const signature = 'Signature_' + Math.random().toString(16).substring(2, 10);
    const pubKeyHash = 'Hash_' + Math.random().toString(16).substring(2, 8);
    return { publicKey, signature, pubKeyHash };
  };

  const formatStackItem = (item: string) => {
    if (item === 'True') return '✅ True';
    if (item === 'False') return '❌ False';
    if (item.startsWith('Hash_')) return `🔗 ${item}`;
    if (item.startsWith('PublicKey_')) return `🔑 ${item}`;
    if (item.startsWith('Signature_')) return `✍️ ${item}`;
    return item;
  };

  // Step 1: Show Analogy
  const handleShowAnalogy = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const puzzle = "Provide the key that matches this lock pattern";
      const solution = "The correct key with matching teeth";
      
      setTreasureChest({
        locked: true,
        puzzle,
        solution
      });
      
      setCurrentStep(2);
      setIsProcessing(false);
    }, 800);
  };

  // Step 2: Create Scripts
  const handleCreateScripts = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const keys = generateMockData();
      setUserKeys(keys);
      
      // Create ScriptPubKey (locking script)
      const lockingScript = [
        'OP_DUP',
        'OP_HASH160',
        keys.pubKeyHash,
        'OP_EQUALVERIFY',
        'OP_CHECKSIG'
      ];
      
      // Create ScriptSig (unlocking script)
      const unlockingScript = [
        keys.signature,
        keys.publicKey
      ];
      
      setScriptPubKey(lockingScript);
      setScriptSig(unlockingScript);
      
      setTreasureChest({
        locked: false,
        puzzle: "Mathematical proof of ownership required",
        solution: "Signature + Public Key that matches the puzzle"
      });
      
      setCurrentStep(3);
      setIsProcessing(false);
    }, 800);
  };

  // Step 3: Execute Scripts Step by Step
  const handleExecuteStep = () => {
    if (currentOperation === 0) {
      // Start execution
      setStack([]);
      setExecutionLog([]);
      setCurrentOperation(1);
      setIsProcessing(true);
      
      setTimeout(() => {
        executeNextOperation();
      }, 500);
    } else {
      executeNextOperation();
    }
  };

  const executeNextOperation = () => {
    const allOperations = [...scriptSig, ...scriptPubKey];
    
    if (currentOperation > allOperations.length) {
      // Execution complete
      const isValid = stack.length > 0 && stack[stack.length - 1] === 'True';
      setValidationResult({
        valid: isValid,
        message: isValid ? 
          'Script execution successful! The treasure chest unlocks! 🎉' : 
          'Script execution failed! The treasure chest remains locked! 🔒'
      });
      
      if (isValid) {
        setCurrentStep(4);
        setChallenge({
          completed: true,
          message: "Congratulations! You've mastered Bitcoin Script operations and unlocked the treasure!",
          success: true
        });
        setTimeout(onComplete, 2000);
      }
      setIsProcessing(false);
      return;
    }

    const operation = allOperations[currentOperation - 1];
    const newStack = [...stack];
    let description = '';
    let stepDescription = '';

    if (currentOperation <= scriptSig.length) {
      // Executing ScriptSig
      stepDescription = `ScriptSig Step ${currentOperation}`;
      newStack.push(operation);
      description = `Push "${operation}" onto the stack`;
    } else {
      // Executing ScriptPubKey
      const pubKeyIndex = currentOperation - scriptSig.length;
      stepDescription = `ScriptPubKey Step ${pubKeyIndex}`;
      
      switch(operation) {
        case 'OP_DUP':
          if (newStack.length > 0) {
            const top = newStack[newStack.length - 1];
            newStack.push(top);
            description = 'Duplicate the top item on the stack';
          }
          break;
          
        case 'OP_HASH160':
          if (newStack.length > 0) {
            newStack.pop();
            newStack.push(userKeys.pubKeyHash);
            description = 'Hash the public key and push result to stack';
          }
          break;
          
        case 'OP_EQUALVERIFY':
          if (newStack.length >= 2) {
            const item1 = newStack.pop();
            const item2 = newStack.pop();
            if (item1 === item2) {
              description = 'Verify hashes are equal ✅ - Continue execution';
            } else {
              newStack.push('False');
              description = 'Hashes not equal ❌ - Script fails';
            }
          }
          break;
          
        case 'OP_CHECKSIG':
          if (newStack.length >= 2) {
            newStack.pop(); // Remove public key
            newStack.pop(); // Remove signature
            newStack.push('True'); // Simulate successful signature verification
            description = 'Verify signature with public key ✅ - Push True';
          }
          break;
          
        default:
          newStack.push(operation);
          description = `Push "${operation}" onto the stack`;
      }
    }

    const logEntry = {
      step: stepDescription,
      stack: [...newStack],
      operation,
      description
    };

    setStack(newStack);
    setExecutionLog(prev => [...prev, logEntry]);
    setCurrentOperation(prev => prev + 1);
    
    setTimeout(() => {
      setIsProcessing(false);
    }, 800);
  };

  const resetSimulation = () => {
    setCurrentStep(1);
    setTreasureChest({ locked: true, puzzle: '', solution: '' });
    setScriptPubKey([]);
    setScriptSig([]);
    setStack([]);
    setExecutionLog([]);
    setCurrentOperation(0);
    setValidationResult(null);
    setUserKeys({ publicKey: '', signature: '', pubKeyHash: '' });
    setChallenge({ completed: false, message: '', success: false });
    setShowAnalogy(true);
  };

  return (
    <div className="py-6">
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'rgba(8, 28, 36, 0.6)' }}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
          Bitcoin Script Challenge: The Digital Treasure Chest
        </h3>
        <p className="text-gray-300 mb-4">
          Learn how Bitcoin Script works like a puzzle that must be solved to unlock digital treasure.
          Bitcoin Script is the "rulebook" that defines exactly how coins can be spent.
        </p>

        {/* Introduction Box */}
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
          <h4 className="font-semibold mb-3" style={{ color: bioluminescentTheme.colors.primary }}>
            💡 What is Bitcoin Script?
          </h4>
          <div className="text-sm text-gray-300 space-y-2">
            <p>• <strong>Rulebook:</strong> Bitcoin Script defines WHO can spend a coin and HOW</p>
            <p>• <strong>Security First:</strong> Intentionally limited (not Turing-complete) to prevent attacks</p>
            <p>• <strong>Mathematical Proof:</strong> You must solve the "puzzle" to prove you own the coins</p>
            <p>• <strong>Two Parts:</strong> Locking script (the puzzle) + Unlocking script (your solution)</p>
          </div>
        </div>

        {/* Step 1: Treasure Chest Analogy */}
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
              The Treasure Chest Analogy
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Imagine Bitcoin as a digital treasure chest. The treasure chest has a special lock with a puzzle. 
            Only someone who can solve the puzzle can open the chest and claim the treasure inside.
          </p>

          <button
            onClick={handleShowAnalogy}
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
                Creating Treasure...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Create Digital Treasure Chest
              </>
            )}
          </button>

          {treasureChest.puzzle && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)' }}>
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">{treasureChest.locked ? '🔒' : '🔓'}</div>
                <h5 className="font-semibold text-yellow-400 mb-2">Digital Treasure Chest</h5>
                <div className="text-sm text-gray-300">
                  <div><strong>Status:</strong> {treasureChest.locked ? 'Locked' : 'Ready to Unlock'}</div>
                  <div><strong>Puzzle:</strong> {treasureChest.puzzle}</div>
                  <div><strong>Solution Required:</strong> {treasureChest.solution}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Create Scripts */}
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
              Create the Puzzle Scripts
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Now we'll create the actual Bitcoin scripts. The <strong>ScriptPubKey</strong> is the puzzle (locking script), 
            and the <strong>ScriptSig</strong> is your solution attempt (unlocking script).
          </p>

          <button
            onClick={handleCreateScripts}
            disabled={currentStep < 2 || isProcessing}
            className="px-4 py-2 rounded text-white font-medium flex items-center text-sm mb-4"
            style={{ 
              backgroundColor: currentStep >= 2 ? bioluminescentTheme.colors.primary : '#6b7280',
              opacity: (currentStep < 2 || isProcessing) ? 0.7 : 1
            }}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Creating Scripts...
              </>
            ) : (
              <>
                <Code className="mr-2 h-4 w-4" />
                Generate Scripts
              </>
            )}
          </button>

          {scriptPubKey.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 165, 0, 0.1)' }}>
                <div className="flex items-center mb-3">
                  <Lock className="h-5 w-5 text-yellow-400 mr-2" />
                  <h5 className="font-semibold text-yellow-400">ScriptPubKey (The Puzzle)</h5>
                </div>
                <div className="space-y-2">
                  {scriptPubKey.map((op, i) => (
                    <div key={i} className="flex items-center p-2 bg-black/30 rounded text-sm">
                      <span className="w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center text-xs font-bold mr-3">
                        {i + 1}
                      </span>
                      <span className="font-mono text-yellow-300">{op}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  This is the "lock" on the treasure chest. It says: "To unlock, provide a signature and public key that hash to the stored value."
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
                <div className="flex items-center mb-3">
                  <Unlock className="h-5 w-5 text-green-400 mr-2" />
                  <h5 className="font-semibold text-green-400">ScriptSig (Your Solution)</h5>
                </div>
                <div className="space-y-2">
                  {scriptSig.map((op, i) => (
                    <div key={i} className="flex items-center p-2 bg-black/30 rounded text-sm">
                      <span className="w-6 h-6 bg-green-500 text-black rounded-full flex items-center justify-center text-xs font-bold mr-3">
                        {i + 1}
                      </span>
                      <span className="font-mono text-green-300">{op}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  This is your "key" to the treasure chest. You provide your signature and public key as proof of ownership.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Execute Scripts */}
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
              Execute the Script (Solve the Puzzle!)
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Now Bitcoin will test your solution against the puzzle! It executes both scripts step-by-step using a "stack" 
            (like a stack of papers). If the final result is "True", you solved the puzzle and can spend the coins!
          </p>

          <button
            onClick={handleExecuteStep}
            disabled={currentStep < 3 || isProcessing || (currentOperation > 0 && currentOperation > [...scriptSig, ...scriptPubKey].length)}
            className="px-4 py-2 rounded text-white font-medium flex items-center text-sm mb-4"
            style={{ 
              backgroundColor: currentStep >= 3 ? bioluminescentTheme.colors.primary : '#6b7280',
              opacity: (currentStep < 3 || isProcessing || (currentOperation > 0 && currentOperation > [...scriptSig, ...scriptPubKey].length)) ? 0.7 : 1
            }}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Executing...
              </>
            ) : currentOperation === 0 ? (
              <>
                <Cpu className="mr-2 h-4 w-4" />
                Start Script Execution
              </>
            ) : (
              <>
                <Cpu className="mr-2 h-4 w-4" />
                Next Step
              </>
            )}
          </button>

          {/* Current Stack Display */}
          {currentOperation > 0 && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
              <div className="flex items-center mb-3">
                <Layers className="h-5 w-5 text-blue-400 mr-2" />
                <h5 className="font-semibold text-blue-400">Current Stack (Think: Stack of Papers)</h5>
              </div>
              <div className="min-h-[100px] border-2 border-dashed border-blue-400 rounded-lg p-3">
                {stack.length === 0 ? (
                  <div className="text-gray-400 text-center italic">Stack is empty</div>
                ) : (
                  <div className="space-y-2">
                    {stack.slice().reverse().map((item, i) => (
                      <div 
                        key={i} 
                        className={`p-2 rounded text-sm font-mono ${i === 0 ? 'bg-blue-500/30 border border-blue-400' : 'bg-black/30'}`}
                      >
                        {i === 0 && <span className="text-xs text-blue-300 mr-2">TOP:</span>}
                        {formatStackItem(item)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Execution Log */}
          {executionLog.length > 0 && (
            <div className="p-4 rounded-lg bg-black/40">
              <h5 className="font-semibold mb-3 text-gray-300">📝 Execution Log:</h5>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {executionLog.map((log, i) => (
                  <div key={i} className="p-3 bg-black/50 rounded border-l-4 border-blue-400">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-blue-300">{log.step}</span>
                      <code className="text-xs text-yellow-300 bg-black/50 px-2 py-1 rounded">{log.operation}</code>
                    </div>
                    <div className="text-sm text-gray-300 mb-2">{log.description}</div>
                    <div className="text-xs text-gray-400">
                      Stack after: [{log.stack.map(formatStackItem).join(', ')}]
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Result */}
          {validationResult && (
            <div className={`p-4 rounded-lg ${validationResult.valid ? 'bg-green-900/20 border border-green-500' : 'bg-red-900/20 border border-red-500'}`}>
              <div className="flex items-center mb-2">
                {validationResult.valid ? (
                  <Check className="h-6 w-6 text-green-400 mr-3" />
                ) : (
                  <Shield className="h-6 w-6 text-red-400 mr-3" />
                )}
                <h5 className={`font-semibold ${validationResult.valid ? 'text-green-400' : 'text-red-400'}`}>
                  Script Execution Complete!
                </h5>
              </div>
              <p className={`text-sm ${validationResult.valid ? 'text-green-300' : 'text-red-300'}`}>
                {validationResult.message}
              </p>
              
              {validationResult.valid && (
                <div className="mt-4 text-center">
                  <div className="text-6xl mb-2">🎉</div>
                  <div className="text-lg font-semibold text-green-400">Treasure Unlocked!</div>
                  <div className="text-sm text-green-300">You successfully proved ownership and can spend the Bitcoin!</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Operation Reference */}
        <div className="mb-6 p-4 rounded-lg bg-black/30">
          <h4 className="font-semibold mb-3" style={{ color: bioluminescentTheme.colors.secondary }}>
            🔧 Bitcoin Script Operations Reference
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="p-2 bg-black/40 rounded">
                <span className="font-mono text-yellow-300">OP_DUP</span>
                <div className="text-gray-400 text-xs">Duplicate the top item on the stack</div>
              </div>
              <div className="p-2 bg-black/40 rounded">
                <span className="font-mono text-yellow-300">OP_HASH160</span>
                <div className="text-gray-400 text-xs">Hash the top item and push result to stack</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="p-2 bg-black/40 rounded">
                <span className="font-mono text-yellow-300">OP_EQUALVERIFY</span>
                <div className="text-gray-400 text-xs">Check if top two items are equal, fail if not</div>
              </div>
              <div className="p-2 bg-black/40 rounded">
                <span className="font-mono text-yellow-300">OP_CHECKSIG</span>
                <div className="text-gray-400 text-xs">Verify signature matches public key</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={resetSimulation}
            className="px-6 py-2 rounded text-white font-medium"
            style={{ backgroundColor: bioluminescentTheme.colors.secondary }}
          >
            🔄 Try Another Treasure Chest
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
            You've mastered Bitcoin Script! You now understand how Bitcoin uses programmable "puzzles" to control who can spend coins. 
            This stack-based system ensures that only valid transactions with proper cryptographic proofs can unlock digital treasure!
          </p>
        </div>
      )}
    </div>
  );
}