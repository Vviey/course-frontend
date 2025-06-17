import { useState, useEffect } from 'react';
import { Fingerprint, Check, RefreshCw, Key, Hash, MapPin, Shuffle, Send, Shield, Cpu, Zap, Code, Lock, Unlock } from 'lucide-react';
import { bioluminescentTheme } from '@/lib/realm-themes';

interface HashingSimulatorProps {
  onComplete: () => void;
}

export default function HashingSimulator({ onComplete }: HashingSimulatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [aliceKeys, setAliceKeys] = useState({ privateKey: '', publicKey: '', address: '', pubKeyHash: '' });
  const [bobKeys, setBobKeys] = useState({ privateKey: '', publicKey: '', address: '', pubKeyHash: '' });
  const [utxos, setUtxos] = useState<Array<{id: string, address: string, amount: number, spent: boolean, lockingScript?: string, pubKeyHash?: string}>>([]);
  const [transaction, setTransaction] = useState<any>(null);
  const [signature, setSignature] = useState('');
  const [verificationResult, setVerificationResult] = useState<{valid: boolean, message: string} | null>(null);
  const [scripts, setScripts] = useState<{locking: string[], unlocking: string[], execution: string[]} | null>(null);
  const [scriptValidation, setScriptValidation] = useState<{valid: boolean, message: string, steps: string[]} | null>(null);
  const [mempool, setMempool] = useState<Array<any>>([]);
  const [minedBlock, setMinedBlock] = useState<any>(null);
  const [transferAmount, setTransferAmount] = useState(1.5);
  const [challenge, setChallenge] = useState({
    completed: false,
    message: '',
    success: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Utility functions
  const generateKeyPair = () => {
    const privateKey = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
    const publicKey = '04' + Array.from(crypto.getRandomValues(new Uint8Array(64)), b => b.toString(16).padStart(2, '0')).join('');
    const pubKeyHash = Array.from(crypto.getRandomValues(new Uint8Array(20)), b => b.toString(16).padStart(2, '0')).join('');
    const address = '1' + pubKeyHash.substring(0, 25);
    return { privateKey, publicKey, address, pubKeyHash };
  };

  const generateTransactionId = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
  };

  const formatHash = (hash: string, length = 12) => {
    return hash.substring(0, length) + '...' + hash.substring(hash.length - 6);
  };

  // Bitcoin Script functions
  const createLockingScript = (pubKeyHash: string) => {
    return [
      'OP_DUP',
      'OP_HASH160',
      `<${pubKeyHash.substring(0, 8)}...>`,
      'OP_EQUALVERIFY',
      'OP_CHECKSIG'
    ];
  };

  const createUnlockingScript = (signature: string, publicKey: string) => {
    return [
      `<${signature.substring(0, 8)}...>`,
      `<${publicKey.substring(0, 8)}...>`
    ];
  };

  const executeScript = (unlockingScript: string[], lockingScript: string[], publicKey: string, pubKeyHash: string) => {
    const execution = [];
    const stack: string[] = [];
    
    // Execute unlocking script first
    execution.push("📝 Executing Unlocking Script:");
    unlockingScript.forEach(op => {
      if (op.startsWith('<') && op.endsWith('>')) {
        stack.push(op);
        execution.push(`   Push ${op} to stack`);
      }
    });
    
    execution.push(`📚 Stack: [${stack.join(', ')}]`);
    execution.push("");
    execution.push("📝 Executing Locking Script:");
    
    // Execute locking script
    lockingScript.forEach(op => {
      switch(op) {
        case 'OP_DUP':
          if (stack.length > 0) {
            const top = stack[stack.length - 1];
            stack.push(top);
            execution.push("   OP_DUP: Duplicate top stack item");
            execution.push(`   Stack: [${stack.join(', ')}]`);
          }
          break;
        case 'OP_HASH160':
          if (stack.length > 0) {
            stack.pop();
            stack.push(`<Hash160(${publicKey.substring(0, 8)}...)>`);
            execution.push("   OP_HASH160: Hash the public key");
            execution.push(`   Stack: [${stack.join(', ')}]`);
          }
          break;
        case 'OP_EQUALVERIFY':
          if (stack.length >= 2) {
            stack.pop();
            stack.pop();
            execution.push("   OP_EQUALVERIFY: Verify hashes match");
            execution.push(`   Stack: [${stack.join(', ')}]`);
          }
          break;
        case 'OP_CHECKSIG':
          if (stack.length >= 2) {
            stack.pop();
            stack.push('True');
            execution.push("   OP_CHECKSIG: Verify signature");
            execution.push(`   Stack: [${stack.join(', ')}]`);
          }
          break;
        default:
          if (op.startsWith('<') && op.endsWith('>')) {
            stack.push(op);
            execution.push(`   Push ${op} to stack`);
            execution.push(`   Stack: [${stack.join(', ')}]`);
          }
      }
    });
    
    execution.push("");
    execution.push(stack.length > 0 && stack[stack.length - 1] === 'True' ? 
      "✅ Script execution successful! UTXO can be spent." : 
      "❌ Script execution failed! UTXO cannot be spent.");
    
    return {
      valid: stack.length > 0 && stack[stack.length - 1] === 'True',
      steps: execution
    };
  };

  // Step 1: Generate Keys for Alice and Bob
  const handleGenerateKeys = async () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const alice = generateKeyPair();
      const bob = generateKeyPair();
      
      setAliceKeys(alice);
      setBobKeys(bob);
      
      // Create initial UTXOs for Alice with locking scripts
      const initialUtxos = [
        { 
          id: generateTransactionId(), 
          address: alice.address, 
          amount: 2.5, 
          spent: false,
          lockingScript: createLockingScript(alice.pubKeyHash).join(' '),
          pubKeyHash: alice.pubKeyHash
        },
        { 
          id: generateTransactionId(), 
          address: alice.address, 
          amount: 1.0, 
          spent: false,
          lockingScript: createLockingScript(alice.pubKeyHash).join(' '),
          pubKeyHash: alice.pubKeyHash
        },
        { 
          id: generateTransactionId(), 
          address: alice.address, 
          amount: 0.8, 
          spent: false,
          lockingScript: createLockingScript(alice.pubKeyHash).join(' '),
          pubKeyHash: alice.pubKeyHash
        }
      ];
      setUtxos(initialUtxos);
      
      setCurrentStep(2);
      setIsProcessing(false);
    }, 800);
  };

  // Step 2: Create Transaction
  const handleCreateTransaction = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      // Find UTXOs to spend
      const neededAmount = transferAmount + 0.001;
      let selectedUtxos: any[] = [];
      let totalInput = 0;
      
      for (const utxo of utxos) {
        if (!utxo.spent && utxo.address === aliceKeys.address) {
          selectedUtxos.push(utxo);
          totalInput += utxo.amount;
          if (totalInput >= neededAmount) break;
        }
      }
      
      const changeAmount = totalInput - transferAmount - 0.001;
      
      const tx = {
        id: generateTransactionId(),
        inputs: selectedUtxos.map(utxo => ({
          previousTxId: utxo.id,
          amount: utxo.amount,
          address: utxo.address,
          lockingScript: utxo.lockingScript,
          pubKeyHash: utxo.pubKeyHash
        })),
        outputs: [
          { 
            address: bobKeys.address, 
            amount: transferAmount,
            lockingScript: createLockingScript(bobKeys.pubKeyHash).join(' ')
          },
          ...(changeAmount > 0 ? [{ 
            address: aliceKeys.address, 
            amount: changeAmount,
            lockingScript: createLockingScript(aliceKeys.pubKeyHash).join(' ')
          }] : [])
        ],
        fee: 0.001,
        timestamp: Date.now()
      };
      
      setTransaction(tx);
      setCurrentStep(3);
      setIsProcessing(false);
    }, 800);
  };

  // Step 3: Create Scripts and Sign Transaction
  const handleSignTransaction = async () => {
    if (!transaction) return;
    
    setIsProcessing(true);
    
    setTimeout(async () => {
      // Create ECDSA signature
      const txData = JSON.stringify({
        inputs: transaction.inputs,
        outputs: transaction.outputs,
        timestamp: transaction.timestamp
      });
      
      const encoder = new TextEncoder();
      const data = encoder.encode(txData + aliceKeys.privateKey);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const signatureHash = Array.from(new Uint8Array(hashBuffer), b => b.toString(16).padStart(2, '0')).join('');
      
      // Create Bitcoin Scripts
      const lockingScript = createLockingScript(aliceKeys.pubKeyHash);
      const unlockingScript = createUnlockingScript(signatureHash, aliceKeys.publicKey);
      
      setSignature(signatureHash);
      setScripts({
        locking: lockingScript,
        unlocking: unlockingScript,
        execution: []
      });
      
      setCurrentStep(4);
      setIsProcessing(false);
    }, 800);
  };

  // Step 4: Validate Scripts
  const handleValidateScript = () => {
    if (!scripts || !signature) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      const validation = executeScript(
        scripts.unlocking, 
        scripts.locking, 
        aliceKeys.publicKey, 
        aliceKeys.pubKeyHash
      );
      
      setScriptValidation({
        valid: validation.valid,
        message: validation.valid ? 
          'Script validation successful! UTXOs can be spent.' : 
          'Script validation failed! Transaction rejected.',
        steps: validation.steps
      });
      
      setVerificationResult({
        valid: validation.valid,
        message: validation.valid ? 'Transaction signature and script validated!' : 'Script validation failed!'
      });
      
      if (validation.valid) {
        setCurrentStep(5);
      }
      setIsProcessing(false);
    }, 1000);
  };

  // Step 5: Broadcast to Mempool
  const handleBroadcastTransaction = () => {
    if (!transaction || !verificationResult?.valid) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      const broadcastTx = {
        ...transaction,
        signature,
        unlockingScript: scripts?.unlocking.join(' '),
        status: 'unconfirmed',
        broadcastTime: Date.now()
      };
      
      setMempool([...mempool, broadcastTx]);
      setCurrentStep(6);
      setIsProcessing(false);
    }, 800);
  };

  // Step 6: Mine Block
  const handleMineBlock = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const block = {
        blockNumber: 750000 + Math.floor(Math.random() * 1000),
        transactions: mempool,
        timestamp: Date.now(),
        previousHash: '000000000000000' + Math.random().toString(16).substring(2, 15),
        merkleRoot: generateTransactionId(),
        nonce: Math.floor(Math.random() * 1000000),
        difficulty: '19.6T'
      };
      
      // Update UTXOs
      const updatedUtxos = [...utxos];
      
      // Mark inputs as spent
      transaction.inputs.forEach((input: any) => {
        const utxoIndex = updatedUtxos.findIndex(u => u.id === input.previousTxId);
        if (utxoIndex !== -1) {
          updatedUtxos[utxoIndex].spent = true;
        }
      });
      
      // Add new UTXOs from outputs
      transaction.outputs.forEach((output: any, index: number) => {
        updatedUtxos.push({
          id: transaction.id + ':' + index,
          address: output.address,
          amount: output.amount,
          spent: false,
          lockingScript: output.lockingScript,
          pubKeyHash: output.address === bobKeys.address ? bobKeys.pubKeyHash : aliceKeys.pubKeyHash
        });
      });
      
      setUtxos(updatedUtxos);
      setMinedBlock(block);
      setMempool([]);
      
      setChallenge({
        completed: true,
        message: "Congratulations! You've completed a full Bitcoin transaction with Script validation from UTXO locking to unlocking!",
        success: true
      });
      
      setTimeout(onComplete, 2000);
      setIsProcessing(false);
    }, 2000);
  };

  const resetSimulation = () => {
    setCurrentStep(1);
    setAliceKeys({ privateKey: '', publicKey: '', address: '', pubKeyHash: '' });
    setBobKeys({ privateKey: '', publicKey: '', address: '', pubKeyHash: '' });
    setUtxos([]);
    setTransaction(null);
    setSignature('');
    setVerificationResult(null);
    setScripts(null);
    setScriptValidation(null);
    setMempool([]);
    setMinedBlock(null);
    setChallenge({ completed: false, message: '', success: false });
  };

  return (
    <div className="py-6">
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'rgba(8, 28, 36, 0.6)' }}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
          Bitcoin Transaction & Script Challenge
        </h3>
        <p className="text-gray-300 mb-4">
          Learn how Bitcoin Scripts control spending conditions through locking and unlocking mechanisms.
          See how UTXOs are locked with conditions and unlocked with signatures and public keys.
        </p>

        {/* Step 1: Key Generation */}
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
              Generate Keys & Create UTXOs with Locking Scripts
            </h4>
          </div>
          
          <p className="text-gray-300 text-sm mb-4">
            Generate cryptographic keys and create UTXOs protected by locking scripts that define spending conditions.
          </p>

          <button
            onClick={handleGenerateKeys}
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
                Generating...
              </>
            ) : (
              <>
                <Key className="mr-2 h-4 w-4" />
                Generate Keys & UTXOs
              </>
            )}
          </button>

          {aliceKeys.address && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
                  <h5 className="font-semibold mb-2" style={{ color: bioluminescentTheme.colors.accent1 }}>
                    👩 Alice (Sender)
                  </h5>
                  <div className="text-xs space-y-1">
                    <div><strong>Address:</strong> {formatHash(aliceKeys.address)}</div>
                    <div><strong>PubKeyHash:</strong> {formatHash(aliceKeys.pubKeyHash)}</div>
                    <div><strong>Balance:</strong> 4.3 BTC</div>
                  </div>
                </div>
                <div className="p-3 rounded" style={{ backgroundColor: 'rgba(64, 224, 208, 0.1)' }}>
                  <h5 className="font-semibold mb-2" style={{ color: bioluminescentTheme.colors.secondary }}>
                    👨 Bob (Receiver)
                  </h5>
                  <div className="text-xs space-y-1">
                    <div><strong>Address:</strong> {formatHash(bobKeys.address)}</div>
                    <div><strong>PubKeyHash:</strong> {formatHash(bobKeys.pubKeyHash)}</div>
                    <div><strong>Balance:</strong> 0 BTC</div>
                  </div>
                </div>
              </div>

              {utxos.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-semibold mb-2" style={{ color: bioluminescentTheme.colors.secondary }}>
                    Alice's UTXOs with Locking Scripts:
                  </h5>
                  <div className="space-y-3">
                    {utxos.filter(u => !u.spent && u.address === aliceKeys.address).map((utxo, i) => (
                      <div key={i} className="p-3 bg-black/30 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm">
                            <strong>{utxo.amount} BTC</strong> - {formatHash(utxo.id)}
                          </div>
                          <Lock className="h-4 w-4 text-yellow-400" />
                        </div>
                        <div className="text-xs">
                          <div className="text-gray-400 mb-1">🔒 Locking Script (scriptPubKey):</div>
                          <div className="font-mono text-yellow-300 bg-black/40 p-2 rounded text-xs">
                            {utxo.lockingScript}
                          </div>
                          <div className="text-gray-400 mt-1 text-xs">
                            💡 This script says: "To spend this UTXO, provide a signature and public key that hashes to {formatHash(utxo.pubKeyHash || '', 6)}"
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Create Transaction */}
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
              Create Transaction
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Create a transaction that references UTXOs to spend and creates new UTXOs with their own locking scripts.
          </p>

          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm">Amount to send:</label>
            <input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(parseFloat(e.target.value) || 0)}
              min="0.001"
              max="4.2"
              step="0.1"
              className="px-3 py-1 bg-black/40 text-gray-100 border rounded text-base"
              style={{ borderColor: `${bioluminescentTheme.colors.secondary}40` }}
            />
            <span className="text-sm">BTC</span>
          </div>

          <button
            onClick={handleCreateTransaction}
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
                Creating...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Create Transaction
              </>
            )}
          </button>

          {transaction && (
            <div className="p-3 rounded" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
              <h5 className="font-semibold mb-2">Transaction Details:</h5>
              <div className="text-xs space-y-2">
                <div><strong>Transaction ID:</strong> {formatHash(transaction.id)}</div>
                <div><strong>Inputs (UTXOs to unlock):</strong></div>
                <ul className="ml-4 space-y-1">
                  {transaction.inputs.map((inp: any, i: number) => (
                    <li key={i} className="bg-black/30 p-2 rounded">
                      <div>{inp.amount} BTC from {formatHash(inp.previousTxId)}</div>
                      <div className="text-gray-400">Must unlock: {inp.lockingScript}</div>
                    </li>
                  ))}
                </ul>
                <div><strong>Outputs (New UTXOs to create):</strong></div>
                <ul className="ml-4 space-y-1">
                  {transaction.outputs.map((out: any, i: number) => (
                    <li key={i} className="bg-black/30 p-2 rounded">
                      <div>{out.amount} BTC → {out.address === bobKeys.address ? 'Bob' : 'Alice (change)'}</div>
                      <div className="text-gray-400">New locking script: {out.lockingScript}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Create Scripts and Sign */}
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
              Create Unlocking Script & Sign
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Create an unlocking script (scriptSig) that provides the signature and public key needed to satisfy the locking script conditions.
          </p>

          <button
            onClick={handleSignTransaction}
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
                Creating Scripts...
              </>
            ) : (
              <>
                <Code className="mr-2 h-4 w-4" />
                Create Scripts & Sign
              </>
            )}
          </button>

          {scripts && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded" style={{ backgroundColor: 'rgba(255, 165, 0, 0.1)' }}>
                  <div className="flex items-center mb-2">
                    <Lock className="h-4 w-4 text-yellow-400 mr-2" />
                    <h5 className="font-semibold text-yellow-400">Locking Script (scriptPubKey)</h5>
                  </div>
                  <div className="font-mono text-xs bg-black/40 p-2 rounded">
                    {scripts.locking.join(' ')}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Set by the previous transaction owner - defines spending conditions
                  </p>
                </div>
                
                <div className="p-3 rounded" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
                  <div className="flex items-center mb-2">
                    <Unlock className="h-4 w-4 text-green-400 mr-2" />
                    <h5 className="font-semibold text-green-400">Unlocking Script (scriptSig)</h5>
                  </div>
                  <div className="font-mono text-xs bg-black/40 p-2 rounded">
                    {scripts.unlocking.join(' ')}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Created by Alice - provides signature and public key to unlock UTXO
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Validate Script */}
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
              Execute & Validate Scripts
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Bitcoin nodes execute the scripts to verify that Alice can spend the UTXOs. The unlocking script must satisfy all conditions in the locking script.
          </p>

          <button
            onClick={handleValidateScript}
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
                Executing...
              </>
            ) : (
              <>
                <Cpu className="mr-2 h-4 w-4" />
                Execute Script
              </>
            )}
          </button>

          {scriptValidation && (
            <div className={`p-3 rounded ${scriptValidation.valid ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
              <h5 className={`font-semibold mb-2 ${scriptValidation.valid ? 'text-green-400' : 'text-red-400'}`}>
                Script Execution:
              </h5>
              <div className="text-xs space-y-1 font-mono bg-black/40 p-3 rounded max-h-64 overflow-y-auto">
                {scriptValidation.steps.map((step, i) => (
                  <div key={i} className={step.startsWith('✅') ? 'text-green-400' : step.startsWith('❌') ? 'text-red-400' : 'text-gray-300'}>
                    {step}
                  </div>
                ))}
              </div>
              <p className={`text-sm mt-2 ${scriptValidation.valid ? 'text-green-300' : 'text-red-300'}`}>
                {scriptValidation.message}
              </p>
            </div>
          )}
        </div>

        {/* Step 5: Broadcast to Mempool */}
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
              Broadcast to Mempool
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            The validated transaction is broadcast to the network and waits in the mempool for mining.
          </p>

          <button
            onClick={handleBroadcastTransaction}
            disabled={currentStep < 5 || isProcessing || !verificationResult?.valid}
            className="px-4 py-2 rounded text-white font-medium flex items-center text-sm mb-4"
            style={{ 
              backgroundColor: currentStep >= 5 && verificationResult?.valid ? bioluminescentTheme.colors.primary : '#6b7280',
              opacity: (currentStep < 5 || isProcessing || !verificationResult?.valid) ? 0.7 : 1
            }}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Broadcasting...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Broadcast Transaction
              </>
            )}
          </button>

          {mempool.length > 0 && (
            <div className="p-3 rounded" style={{ backgroundColor: 'rgba(255, 165, 0, 0.1)' }}>
              <h5 className="font-semibold mb-2 text-orange-400">Mempool Status:</h5>
              <div className="text-sm text-orange-300">
                ⏳ Transaction with valid scripts waiting for mining...
              </div>
            </div>
          )}
        </div>

        {/* Step 6: Mining */}
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
              Mining & UTXO Updates
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Miners include the transaction in a block. Old UTXOs are marked as spent, and new UTXOs are created with fresh locking scripts.
          </p>

          <button
            onClick={handleMineBlock}
            disabled={currentStep < 6 || isProcessing}
            className="px-4 py-2 rounded text-white font-medium flex items-center text-sm mb-4"
            style={{ 
              backgroundColor: currentStep >= 6 ? bioluminescentTheme.colors.primary : '#6b7280',
              opacity: (currentStep < 6 || isProcessing) ? 0.7 : 1
            }}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Mining...
              </>
            ) : (
              <>
                <Cpu className="mr-2 h-4 w-4" />
                Mine Block
              </>
            )}
          </button>

          {minedBlock && (
            <div className="space-y-4">
              <div className="p-3 rounded" style={{ backgroundColor: 'rgba(6, 214, 160, 0.2)' }}>
                <h5 className="font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
                  ✅ Block Mined Successfully!
                </h5>
                <div className="text-sm space-y-1">
                  <div><strong>Block #{minedBlock.blockNumber}</strong></div>
                  <div>Scripts executed and validated ✓</div>
                  <div>UTXOs updated ✓</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded bg-black/30">
                  <h6 className="text-sm font-semibold mb-1 text-green-400">✅ New UTXOs Created:</h6>
                  <div className="text-xs space-y-2">
                    {utxos.filter(u => !u.spent && u.id.includes(':')).map((utxo, i) => (
                      <div key={i} className="bg-green-900/20 p-2 rounded">
                        <div><strong>{utxo.amount} BTC</strong> → {utxo.address === bobKeys.address ? 'Bob' : 'Alice'}</div>
                        <div className="text-gray-400">Protected by: {utxo.lockingScript}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded bg-black/30">
                  <h6 className="text-sm font-semibold mb-1 text-red-400">❌ UTXOs Spent:</h6>
                  <div className="text-xs space-y-1">
                    {utxos.filter(u => u.spent).map((utxo, i) => (
                      <div key={i} className="bg-red-900/20 p-2 rounded">
                        <div><strong>{utxo.amount} BTC</strong> - {formatHash(utxo.id)}</div>
                        <div className="text-gray-400">Successfully unlocked and spent</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={resetSimulation}
            className="px-6 py-2 rounded text-white font-medium"
            style={{ backgroundColor: bioluminescentTheme.colors.secondary }}
          >
            🔄 Start New Transaction
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
            You've mastered Bitcoin Scripts! You've seen how locking scripts protect UTXOs and how unlocking scripts 
            provide the necessary signatures and public keys to spend them. This is the foundation of Bitcoin's programmable money!
          </p>
        </div>
      )}
    </div>
  );
}