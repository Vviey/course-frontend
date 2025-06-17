import { useState, useEffect } from 'react';
import { Fingerprint, Check, RefreshCw, Key, Hash, MapPin, Shuffle, Send, Shield, Cpu, Zap, Code, Lock, Unlock, Layers, Eye, TreePine, Wallet, FileKey, Home } from 'lucide-react';
import { bioluminescentTheme } from '@/lib/realm-themes';

interface HashingSimulatorProps {
  onComplete: () => void;
}

interface KeyPair {
  privateKey: string;
  publicKey: string;
  address: string;
  pubKeyHash: string;
}

interface HDWallet {
  master: string;
  purpose: KeyPair;
  coinType: KeyPair;
  account: KeyPair;
  external: KeyPair;
  internal: KeyPair;
}

interface GeneratedAddress {
  path: string;
  address: string;
  privateKey: string;
  publicKey: string;
  type: 'receiving' | 'change';
}

interface WatchOnlyWallet {
  xpub: string;
  addresses: Array<{
    path: string;
    address: string;
    publicKey: string;
    canSpend: boolean;
  }>;
}

export default function HashingSimulator({ onComplete }: HashingSimulatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedWalletType, setSelectedWalletType] = useState('software');
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [masterKey, setMasterKey] = useState('');
  const [hdWalletTree, setHdWalletTree] = useState<HDWallet | null>(null);
  const [generatedAddresses, setGeneratedAddresses] = useState<GeneratedAddress[]>([]);
  const [watchOnlyWallet, setWatchOnlyWallet] = useState<WatchOnlyWallet>({ xpub: '', addresses: [] });
  const [entropy, setEntropy] = useState<{bits: number, randomness: string}>({ bits: 0, randomness: '' });
  const [challenge, setChallenge] = useState({
    completed: false,
    message: '',
    success: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // BIP39 word list (simplified for demo)
  const BIP39_WORDS = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
    'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
    'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
    'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'agent', 'agree',
    'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert', 'alien',
    'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter', 'always',
    'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry',
    'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique', 'anxiety', 'any',
    'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic', 'area', 'arena',
    'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow'
  ];

  // Wallet type configurations
  const WALLET_TYPES = {
    software: {
      icon: '💻',
      name: 'Software Wallet',
      description: 'App on phone/computer',
      pros: ['Convenient', 'Free', 'Easy to use'],
      cons: ['Connected to internet', 'Malware risk'],
      storage: 'Device storage',
      security: 'Medium'
    },
    hardware: {
      icon: '🔒',
      name: 'Hardware Wallet',
      description: 'Physical device',
      pros: ['Offline storage', 'High security', 'Tamper resistant'],
      cons: ['Costs money', 'Can be lost/damaged'],
      storage: 'Secure element',
      security: 'High'
    },
    custodial: {
      icon: '🏦',
      name: 'Custodial Wallet',
      description: 'Exchange holds keys',
      pros: ['Easy recovery', 'No responsibility', 'User-friendly'],
      cons: ['Not your keys', 'Counterparty risk', 'Can be frozen'],
      storage: 'Third party',
      security: 'Depends on provider'
    },
    paper: {
      icon: '📄',
      name: 'Paper Wallet',
      description: 'Keys printed on paper',
      pros: ['Completely offline', 'No electronic risk', 'Free'],
      cons: ['Can be lost/damaged', 'Hard to use', 'No backup'],
      storage: 'Physical paper',
      security: 'High if stored well'
    }
  };

  // Utility functions
  const generateEntropy = (bits: number = 128) => {
    const bytes = new Uint8Array(bits / 8);
    crypto.getRandomValues(bytes);
    const randomness = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    return { bits, randomness };
  };

  const generateSeedFromEntropy = (entropyHex: string) => {
    // Simplified BIP39 implementation for demo
    const entropyBytes = entropyHex.match(/.{2}/g)?.map(byte => parseInt(byte, 16)) || [];
    const seedWords: string[] = [];
    
    for (let i = 0; i < 12; i++) {
      const wordIndex = (entropyBytes[i] || 0) % BIP39_WORDS.length;
      seedWords.push(BIP39_WORDS[wordIndex]);
    }
    
    return seedWords;
  };

  const deriveMasterKey = (seedPhrase: string[]) => {
    // Simplified master key derivation
    const seedString = seedPhrase.join(' ');
    const hash = Array.from(new TextEncoder().encode(seedString))
      .reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
    return 'xprv' + hash.substring(0, 108); // Simplified extended private key
  };

  const deriveChildKey = (masterKey: string, path: string): KeyPair => {
    // Simplified BIP32 key derivation
    const pathHash = Array.from(new TextEncoder().encode(masterKey + path))
      .reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
    
    const privateKey = pathHash.substring(0, 64);
    const publicKey = '03' + pathHash.substring(64, 128);
    const pubKeyHash = pathHash.substring(128, 168);
    const address = '1' + pubKeyHash.substring(0, 25);
    
    return { privateKey, publicKey, address, pubKeyHash };
  };

  const formatDerivationPath = (path: string) => {
    const parts = path.split('/');
    
    return parts.map((part, i) => ({
      part,
      description: i === 0 ? 'Master Key' : 
                   i === 1 ? 'Purpose (BIP44)' :
                   i === 2 ? 'Coin Type (Bitcoin)' :
                   i === 3 ? 'Account #' + part.replace('\'', '') :
                   i === 4 ? (part === '0' ? 'External Chain' : 'Internal Chain (Change)') :
                   'Address Index #' + part
    }));
  };

  // Step 1: Wallet Type Selection
  const handleSelectWalletType = (walletType: string) => {
    setSelectedWalletType(walletType);
  };

  const handleStartWalletCreation = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setCurrentStep(2);
      setIsProcessing(false);
    }, 800);
  };

  // Step 2: Generate Seed Phrase (BIP39)
  const handleGenerateSeedPhrase = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const newEntropy = generateEntropy(128);
      const seed = generateSeedFromEntropy(newEntropy.randomness);
      
      setEntropy(newEntropy);
      setSeedPhrase(seed);
      setCurrentStep(3);
      setIsProcessing(false);
    }, 1000);
  };

  // Step 3: Derive Master Key (BIP32)
  const handleDeriveMasterKey = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const masterKey = deriveMasterKey(seedPhrase);
      setMasterKey(masterKey);
      setCurrentStep(4);
      setIsProcessing(false);
    }, 800);
  };

  // Step 4: Create HD Wallet Tree (BIP44)
  const handleCreateHDWallet = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const tree: HDWallet = {
        master: masterKey,
        purpose: deriveChildKey(masterKey, "m/44'"),
        coinType: deriveChildKey(masterKey, "m/44'/0'"),
        account: deriveChildKey(masterKey, "m/44'/0'/0'"),
        external: deriveChildKey(masterKey, "m/44'/0'/0'/0"),
        internal: deriveChildKey(masterKey, "m/44'/0'/0'/1")
      };
      
      setHdWalletTree(tree);
      setCurrentStep(5);
      setIsProcessing(false);
    }, 1000);
  };

  // Step 5: Generate Multiple Addresses
  const handleGenerateAddresses = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const addresses: GeneratedAddress[] = [];
      
      // Generate external addresses (receiving)
      for (let i = 0; i < 3; i++) {
        const path = `m/44'/0'/0'/0/${i}`;
        const keys = deriveChildKey(masterKey, path);
        addresses.push({ 
          path, 
          ...keys,
          type: 'receiving'
        });
      }
      
      // Generate internal addresses (change)
      for (let i = 0; i < 2; i++) {
        const path = `m/44'/0'/0'/1/${i}`;
        const keys = deriveChildKey(masterKey, path);
        addresses.push({ 
          path, 
          ...keys,
          type: 'change'
        });
      }
      
      setGeneratedAddresses(addresses);
      setCurrentStep(6);
      setIsProcessing(false);
    }, 1000);
  };

  // Step 6: Create Watch-Only Wallet
  const handleCreateWatchOnly = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      // Generate extended public key (xpub)
      const xpub = 'xpub' + masterKey.substring(4, 112); // Convert xprv to xpub (simplified)
      
      const watchAddresses = generatedAddresses.slice(0, 3).map(addr => ({
        path: addr.path,
        address: addr.address,
        publicKey: addr.publicKey,
        canSpend: false
      }));
      
      setWatchOnlyWallet({ xpub, addresses: watchAddresses });
      
      setChallenge({
        completed: true,
        message: "Congratulations! You've mastered Bitcoin wallet technology from seed phrases to HD derivation!",
        success: true
      });
      
      setTimeout(onComplete, 2000);
      setIsProcessing(false);
    }, 800);
  };

  const resetSimulation = () => {
    setCurrentStep(1);
    setSelectedWalletType('software');
    setSeedPhrase([]);
    setMasterKey('');
    setHdWalletTree(null);
    setGeneratedAddresses([]);
    setWatchOnlyWallet({ xpub: '', addresses: [] });
    setEntropy({ bits: 0, randomness: '' });
    setChallenge({ completed: false, message: '', success: false });
  };

  return (
    <div className="py-6">
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'rgba(8, 28, 36, 0.6)' }}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
          Bitcoin Wallet Deep Dive Challenge
        </h3>
        <p className="text-gray-300 mb-4">
          Learn how Bitcoin wallets really work! Discover that wallets are key managers, not coin containers, 
          and explore the industry standards that make Bitcoin wallets secure and user-friendly.
        </p>

        {/* Key Concept Box */}
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
          <h4 className="font-semibold mb-3" style={{ color: bioluminescentTheme.colors.primary }}>
            🔑 Key Insight: Wallets Don't Hold Coins!
          </h4>
          <div className="text-sm text-gray-300 space-y-2">
            <p>• <strong>Reality:</strong> Your Bitcoin lives on the blockchain, not in your wallet</p>
            <p>• <strong>Wallet's Job:</strong> Manage private keys that prove ownership of blockchain coins</p>
            <p>• <strong>Analogy:</strong> Think of your wallet as a keychain, not a coin purse</p>
            <p>• <strong>Standards:</strong> BIP39 (seed phrases), BIP32 (HD wallets), BIP44 (organization)</p>
          </div>
        </div>

        {/* Step 1: Wallet Types & Introduction */}
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
              Understanding Wallet Types
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Bitcoin wallets come in different forms, but they all do the same job: manage your private keys. 
            Let's explore the main types and understand what makes each one special.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {Object.entries(WALLET_TYPES).map(([type, config]) => (
              <div
                key={type}
                onClick={() => handleSelectWalletType(type)}
                className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
                  selectedWalletType === type ? 'ring-2 ring-blue-400 border-blue-400' : 'border-gray-600'
                }`}
                style={{ backgroundColor: selectedWalletType === type ? 'rgba(6, 214, 160, 0.1)' : 'rgba(0, 0, 0, 0.3)' }}
              >
                <div className="text-2xl mb-1">{config.icon}</div>
                <div className="text-sm font-semibold text-gray-200 mb-1">{config.name}</div>
                <div className="text-xs text-gray-400 mb-2">{config.description}</div>
                <div className="text-xs space-y-1">
                  <div><strong>Security:</strong> {config.security}</div>
                  <div><strong>Storage:</strong> {config.storage}</div>
                </div>
              </div>
            ))}
          </div>

          {selectedWalletType && (
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
              <h5 className="font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
                {WALLET_TYPES[selectedWalletType as keyof typeof WALLET_TYPES].icon} {WALLET_TYPES[selectedWalletType as keyof typeof WALLET_TYPES].name}
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="mb-1"><strong>Advantages:</strong></div>
                  <ul className="text-xs text-green-300 space-y-1">
                    {WALLET_TYPES[selectedWalletType as keyof typeof WALLET_TYPES].pros.map((pro, i) => (
                      <li key={i}>✅ {pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="mb-1"><strong>Considerations:</strong></div>
                  <ul className="text-xs text-yellow-300 space-y-1">
                    {WALLET_TYPES[selectedWalletType as keyof typeof WALLET_TYPES].cons.map((con, i) => (
                      <li key={i}>⚠️ {con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleStartWalletCreation}
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
                Loading...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Start Wallet Creation
              </>
            )}
          </button>
        </div>

        {/* Step 2: Generate Seed Phrase (BIP39) */}
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
              Generate Seed Phrase (BIP39 Standard)
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            The seed phrase is your wallet's "master blueprint." It's generated from cryptographically secure randomness 
            and converted to human-readable words using the BIP39 standard (2048 possible words).
          </p>

          <button
            onClick={handleGenerateSeedPhrase}
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
                Generating Entropy...
              </>
            ) : (
              <>
                <Shuffle className="mr-2 h-4 w-4" />
                Generate Secure Seed Phrase
              </>
            )}
          </button>

          {entropy.bits > 0 && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/50">
                <h5 className="font-semibold mb-2 text-red-400">🎲 Entropy Generation (Randomness)</h5>
                <div className="text-xs space-y-2">
                  <div><strong>Bits of Entropy:</strong> {entropy.bits} bits</div>
                  <div><strong>Raw Randomness:</strong> <span className="font-mono">{entropy.randomness.substring(0, 32)}...</span></div>
                  <div className="text-gray-400">This randomness is converted to human-readable words using BIP39</div>
                </div>
              </div>

              {seedPhrase.length > 0 && (
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
                  <h5 className="font-semibold mb-3" style={{ color: bioluminescentTheme.colors.primary }}>
                    🌱 Your 12-Word Seed Phrase (BIP39)
                  </h5>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-3">
                    {seedPhrase.map((word, i) => (
                      <div key={i} className="flex items-center p-2 bg-black/40 rounded text-sm">
                        <span className="w-6 h-6 bg-green-500 text-black rounded-full flex items-center justify-center text-xs font-bold mr-2">
                          {i + 1}
                        </span>
                        <span className="font-mono">{word}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-yellow-400 bg-yellow-900/20 p-2 rounded">
                    ⚠️ In real life, write this down on paper and store it safely! This controls all your Bitcoin.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 3: Derive Master Key (BIP32) */}
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
              Create Master Key (BIP32 HD Wallets)
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Your seed phrase is mathematically converted into a "master key" using BIP32. This master key is the root 
            of a tree that can generate billions of child keys and Bitcoin addresses deterministically.
          </p>

          <button
            onClick={handleDeriveMasterKey}
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
                Deriving Master Key...
              </>
            ) : (
              <>
                <Key className="mr-2 h-4 w-4" />
                Derive Master Key
              </>
            )}
          </button>

          {masterKey && (
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
              <h5 className="font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
                🔑 Master Private Key (Extended Key)
              </h5>
              <div className="font-mono text-sm bg-black/40 p-3 rounded break-all">
                {masterKey}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                This extended private key (xprv) contains the master key + chain code for deterministic derivation
              </div>
            </div>
          )}
        </div>

        {/* Step 4: HD Wallet Tree Structure (BIP44) */}
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
              Build HD Wallet Tree (BIP44 Organization)
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            BIP44 defines how to organize your keys in a tree structure. It's like a filing system: 
            Purpose → Coin Type → Account → Chain → Address Index. This lets one seed manage multiple cryptocurrencies and accounts.
          </p>

          <button
            onClick={handleCreateHDWallet}
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
                Building Tree...
              </>
            ) : (
              <>
                <TreePine className="mr-2 h-4 w-4" />
                Create HD Wallet Tree
              </>
            )}
          </button>

          {hdWalletTree && (
            <div className="p-4 rounded-lg bg-black/30">
              <h5 className="font-semibold mb-3 flex items-center">
                <TreePine className="h-4 w-4 mr-2 text-green-400" />
                HD Wallet Derivation Tree (BIP44)
              </h5>
              <div className="space-y-3 text-sm">
                <div className="flex items-center p-2 bg-green-900/20 rounded">
                  <span className="font-mono mr-3">m</span>
                  <span className="text-green-400">Master Key (Root)</span>
                </div>
                <div className="ml-4 flex items-center p-2 bg-blue-900/20 rounded">
                  <span className="font-mono mr-3">m/44'</span>
                  <span className="text-blue-400">Purpose: BIP44 Standard</span>
                </div>
                <div className="ml-8 flex items-center p-2 bg-purple-900/20 rounded">
                  <span className="font-mono mr-3">m/44'/0'</span>
                  <span className="text-purple-400">Coin Type: Bitcoin (0)</span>
                </div>
                <div className="ml-12 flex items-center p-2 bg-yellow-900/20 rounded">
                  <span className="font-mono mr-3">m/44'/0'/0'</span>
                  <span className="text-yellow-400">Account: #0</span>
                </div>
                <div className="ml-16 space-y-1">
                  <div className="flex items-center p-2 bg-orange-900/20 rounded">
                    <span className="font-mono mr-3">m/44'/0'/0'/0</span>
                    <span className="text-orange-400">External Chain (Receiving addresses)</span>
                  </div>
                  <div className="flex items-center p-2 bg-red-900/20 rounded">
                    <span className="font-mono mr-3">m/44'/0'/0'/1</span>
                    <span className="text-red-400">Internal Chain (Change addresses)</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400 bg-black/40 p-2 rounded">
                💡 Each level adds organization: Purpose (BIP44) → Bitcoin → Account → Receiving/Change → Specific Address
              </div>
            </div>
          )}
        </div>

        {/* Step 5: Generate Multiple Addresses */}
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
              Generate Multiple Addresses
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Now we'll generate actual Bitcoin addresses from our HD wallet tree. Each address has its own private key, 
            but they're all mathematically derived from your original seed phrase.
          </p>

          <button
            onClick={handleGenerateAddresses}
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
                Generating Addresses...
              </>
            ) : (
              <>
                <Home className="mr-2 h-4 w-4" />
                Generate Bitcoin Addresses
              </>
            )}
          </button>

          {generatedAddresses.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(6, 214, 160, 0.1)' }}>
                  <h5 className="font-semibold mb-3 text-green-400">📨 Receiving Addresses (External Chain)</h5>
                  <div className="space-y-2">
                    {generatedAddresses.filter(addr => addr.type === 'receiving').map((addr, i) => (
                      <div key={i} className="p-2 bg-black/40 rounded text-xs">
                        <div className="font-mono text-green-300">{addr.address}</div>
                        <div className="text-gray-400 mt-1">{addr.path}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Share these addresses to receive Bitcoin payments
                  </div>
                </div>

                <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 165, 0, 0.1)' }}>
                  <h5 className="font-semibold mb-3 text-orange-400">🔄 Change Addresses (Internal Chain)</h5>
                  <div className="space-y-2">
                    {generatedAddresses.filter(addr => addr.type === 'change').map((addr, i) => (
                      <div key={i} className="p-2 bg-black/40 rounded text-xs">
                        <div className="font-mono text-orange-300">{addr.address}</div>
                        <div className="text-gray-400 mt-1">{addr.path}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Used internally by wallet for transaction change
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/40">
                <h5 className="font-semibold mb-2 text-gray-300">🔍 Derivation Path Breakdown</h5>
                <div className="text-xs space-y-1">
                  {formatDerivationPath(generatedAddresses[0].path).map((part, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="font-mono text-blue-300">{part.part}</span>
                      <span className="text-gray-400">{part.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 6: Watch-Only Wallet */}
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
              Create Watch-Only Wallet
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            A watch-only wallet uses your extended public key (xpub) to generate addresses and monitor balances 
            WITHOUT having access to private keys. Perfect for businesses or monitoring portfolios safely.
          </p>

          <button
            onClick={handleCreateWatchOnly}
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
                Creating Watch-Only...
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Generate Watch-Only Wallet
              </>
            )}
          </button>

          {watchOnlyWallet.xpub && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(64, 224, 208, 0.1)' }}>
                <h5 className="font-semibold mb-2" style={{ color: bioluminescentTheme.colors.secondary }}>
                  👁️ Extended Public Key (xpub)
                </h5>
                <div className="font-mono text-xs bg-black/40 p-2 rounded break-all">
                  {watchOnlyWallet.xpub}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Share this to create watch-only wallets - no spending risk!
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/30">
                <h5 className="font-semibold mb-3 text-gray-300">🔍 Watch-Only Addresses</h5>
                <div className="space-y-2">
                  {watchOnlyWallet.addresses.map((addr, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-black/40 rounded text-xs">
                      <div>
                        <div className="font-mono text-blue-300">{addr.address}</div>
                        <div className="text-gray-400">{addr.path}</div>
                      </div>
                      <div className="flex items-center text-orange-400">
                        <Eye className="h-3 w-3 mr-1" />
                        <span>Monitor Only</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-3 bg-blue-900/20 p-2 rounded">
                  💡 These addresses can be monitored for incoming transactions, but cannot spend funds
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Standards Reference */}
        <div className="mb-6 p-4 rounded-lg bg-black/30">
          <h4 className="font-semibold mb-3" style={{ color: bioluminescentTheme.colors.secondary }}>
            📋 Bitcoin Standards Reference
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-black/40 rounded">
              <h5 className="font-semibold text-green-400 mb-2">BIP39</h5>
              <p className="text-gray-300 text-xs">Mnemonic seed phrases - converts entropy to human-readable words</p>
            </div>
            <div className="p-3 bg-black/40 rounded">
              <h5 className="font-semibold text-blue-400 mb-2">BIP32</h5>
              <p className="text-gray-300 text-xs">Hierarchical Deterministic wallets - tree structure for key derivation</p>
            </div>
            <div className="p-3 bg-black/40 rounded">
              <h5 className="font-semibold text-purple-400 mb-2">BIP44</h5>
              <p className="text-gray-300 text-xs">Multi-account hierarchy - organization standard for HD wallets</p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={resetSimulation}
            className="px-6 py-2 rounded text-white font-medium"
            style={{ backgroundColor: bioluminescentTheme.colors.secondary }}
          >
            🔄 Create New Wallet
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
            You now understand the true nature of Bitcoin wallets! They're sophisticated key managers that use industry standards 
            like BIP39, BIP32, and BIP44 to securely generate and organize your Bitcoin addresses. Remember: your coins live on 
            the blockchain, your wallet just holds the keys!
          </p>
        </div>
      )}
    </div>
  );
}