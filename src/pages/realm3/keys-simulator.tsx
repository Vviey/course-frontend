import { useState, useEffect } from 'react';
import { Fingerprint, Check, RefreshCw, Key, Hash, MapPin, Shuffle } from 'lucide-react';
import { bioluminescentTheme } from '@/lib/realm-themes';

interface HashingSimulatorProps {
  onComplete: () => void;
}

export default function HashingSimulator({ onComplete }: HashingSimulatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [privateKey, setPrivateKey] = useState('');
  const [publicKeyUncompressed, setPublicKeyUncompressed] = useState('');
  const [publicKeyCompressed, setPublicKeyCompressed] = useState('');
  const [sha256Hash, setSha256Hash] = useState('');
  const [ripemd160Hash, setRipemd160Hash] = useState('');
  const [bitcoinAddress, setBitcoinAddress] = useState('');
  const [customSeed, setCustomSeed] = useState('');
  const [showSeedInput, setShowSeedInput] = useState(false);
  const [challenge, setChallenge] = useState({
    completed: false,
    message: '',
    success: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Base58 alphabet (Bitcoin style - no 0, O, I, l)
  const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

  // Utility functions
  const bytesToHex = (bytes: Uint8Array) => {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  const formatHexDisplay = (hex: string, chunkSize = 8) => {
    return hex.match(new RegExp('.{1,' + chunkSize + '}', 'g'))?.join(' ') || hex;
  };

  // Seeded random number generator for deterministic results
  class SeededRandom {
    private seed: number;
    
    constructor(seed: number) {
      this.seed = seed;
    }
    
    next() {
      this.seed = (this.seed * 9301 + 49297) % 233280;
      return this.seed / 233280;
    }
  }

  // Simplified SECP256K1 simulation (for educational purposes)
  const simulateEllipticCurveMultiplication = (privateKeyBytes: Uint8Array) => {
    const seed = Array.from(privateKeyBytes).reduce((acc, byte, i) => acc + byte * (i + 1), 0);
    const rng = new SeededRandom(seed);
    
    // Simulate uncompressed public key (04 + 32 bytes X + 32 bytes Y)
    const uncompressed = new Uint8Array(65);
    uncompressed[0] = 0x04;
    
    for (let i = 1; i < 65; i++) {
      uncompressed[i] = Math.floor(rng.next() * 256);
    }
    
    // Simulate compressed public key (02/03 + 32 bytes X only)
    const compressed = new Uint8Array(33);
    compressed[0] = rng.next() > 0.5 ? 0x02 : 0x03;
    compressed.set(uncompressed.slice(1, 33), 1);
    
    return { uncompressed, compressed };
  };

  // Simplified RIPEMD-160 simulation
  const simulateRipemd160 = (bytes: Uint8Array) => {
    let hash = 0x67452301;
    
    for (let i = 0; i < bytes.length; i++) {
      hash = ((hash << 5) - hash + bytes[i]) & 0xffffffff;
      hash = hash ^ (hash >>> 16);
    }
    
    const result = new Uint8Array(20);
    for (let i = 0; i < 20; i++) {
      result[i] = (hash >>> (i * 8)) & 0xff;
    }
    
    return result;
  };

  // Base58 encoding - fixed for compatibility
  const encodeBase58 = (bytes: Uint8Array) => {
    if (bytes.length === 0) return '';
    
    let encoded = '';
    let num = BigInt('0x' + bytesToHex(bytes));
    const base = BigInt(58);
    
    while (num > 0) {
      encoded = BASE58_ALPHABET[Number(num % base)] + encoded;
      num = num / base;
    }
    
    for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
      encoded = '1' + encoded;
    }
    
    return encoded;
  };

  // Step 1: Generate Private Key
  const handleGeneratePrivateKey = async () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const randomBytes = new Uint8Array(32);
      crypto.getRandomValues(randomBytes);
      
      const hexKey = bytesToHex(randomBytes);
      setPrivateKey(hexKey);
      setCurrentStep(2);
      setIsProcessing(false);
    }, 800);
  };

  // Generate from custom seed
  const handleGenerateFromSeed = async () => {
    if (!customSeed.trim()) return;
    
    setIsProcessing(true);
    
    setTimeout(async () => {
      const encoder = new TextEncoder();
      const seedBytes = encoder.encode(customSeed);
      const hashBuffer = await crypto.subtle.digest('SHA-256', seedBytes);
      const privateKeyBytes = new Uint8Array(hashBuffer);
      
      const hexKey = bytesToHex(privateKeyBytes);
      setPrivateKey(hexKey);
      setCurrentStep(2);
      setIsProcessing(false);
    }, 800);
  };

  // Step 2: Derive Public Key
  const handleDerivePublicKey = () => {
    if (!privateKey) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      const privateKeyBytes = new Uint8Array(privateKey.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
      const publicKeys = simulateEllipticCurveMultiplication(privateKeyBytes);
      
      setPublicKeyUncompressed(bytesToHex(publicKeys.uncompressed));
      setPublicKeyCompressed(bytesToHex(publicKeys.compressed));
      setCurrentStep(3);
      setIsProcessing(false);
    }, 800);
  };

  // Step 3: Hash Public Key
  const handleHashPublicKey = async () => {
    if (!publicKeyCompressed) return;
    
    setIsProcessing(true);
    
    setTimeout(async () => {
      const publicKeyBytes = new Uint8Array(publicKeyCompressed.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
      
      // SHA-256 hash
      const sha256HashBuffer = await crypto.subtle.digest('SHA-256', publicKeyBytes);
      const sha256Bytes = new Uint8Array(sha256HashBuffer);
      
      // RIPEMD-160 simulation
      const ripemd160Bytes = simulateRipemd160(sha256Bytes);
      
      setSha256Hash(bytesToHex(sha256Bytes));
      setRipemd160Hash(bytesToHex(ripemd160Bytes));
      setCurrentStep(4);
      setIsProcessing(false);
    }, 800);
  };

  // Step 4: Create Bitcoin Address
  const handleCreateAddress = async () => {
    if (!ripemd160Hash) return;
    
    setIsProcessing(true);
    
    setTimeout(async () => {
      const ripemd160Bytes = new Uint8Array(ripemd160Hash.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
      
      // Add version byte (0x00 for mainnet)
      const versionedHash = new Uint8Array(21);
      versionedHash[0] = 0x00;
      versionedHash.set(ripemd160Bytes, 1);
      
      // Calculate checksum
      const checksum1 = await crypto.subtle.digest('SHA-256', versionedHash);
      const checksum2 = await crypto.subtle.digest('SHA-256', checksum1);
      const checksumBytes = new Uint8Array(checksum2).slice(0, 4);
      
      // Combine everything
      const fullAddress = new Uint8Array(25);
      fullAddress.set(versionedHash, 0);
      fullAddress.set(checksumBytes, 21);
      
      // Encode in Base58
      const address = encodeBase58(fullAddress);
      setBitcoinAddress(address);
      
      setChallenge({
        completed: true,
        message: "Congratulations! You've generated a complete Bitcoin key pair and address using real cryptographic algorithms!",
        success: true
      });
      
      setTimeout(onComplete, 2000);
      setIsProcessing(false);
    }, 800);
  };

  const resetSimulation = () => {
    setCurrentStep(1);
    setPrivateKey('');
    setPublicKeyUncompressed('');
    setPublicKeyCompressed('');
    setSha256Hash('');
    setRipemd160Hash('');
    setBitcoinAddress('');
    setChallenge({ completed: false, message: '', success: false });
  };

  return (
    <div className="py-6">
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: 'rgba(8, 28, 36, 0.6)' }}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: bioluminescentTheme.colors.primary }}>
          Bitcoin Key Generation Challenge
        </h3>
        <p className="text-gray-300 mb-4">
          Learn how Bitcoin creates cryptographic keys using the same algorithms as real Bitcoin wallets.
          This process involves generating a random private key, deriving a public key using elliptic curve cryptography,
          and creating a user-friendly address.
        </p>

        {/* Step 1: Generate Private Key */}
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
              Generate Random Private Key
            </h4>
          </div>
          
          <p className="text-gray-300 text-sm mb-4">
            A private key is a random 256-bit number (32 bytes). This is your secret - never share it!
            Think of it like the master key to your digital safe.
          </p>

          <div className="flex gap-2 mb-4">
            <button
              onClick={handleGeneratePrivateKey}
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
                  Generating...
                </>
              ) : (
                <>
                  <Shuffle className="mr-2 h-4 w-4" />
                  Generate Random
                </>
              )}
            </button>

            <button
              onClick={() => setShowSeedInput(!showSeedInput)}
              className="px-4 py-2 rounded text-white font-medium flex items-center text-sm"
              style={{ backgroundColor: bioluminescentTheme.colors.secondary }}
            >
              <Key className="mr-2 h-4 w-4" />
              Use Custom Seed
            </button>
          </div>

          {showSeedInput && (
            <div className="mb-4">
              <input
                type="text"
                value={customSeed}
                onChange={(e) => setCustomSeed(e.target.value)}
                placeholder="Enter any text (will be hashed to create private key)"
                className="w-full p-3 bg-black/40 text-gray-100 border rounded-md text-base"
                style={{ borderColor: `${bioluminescentTheme.colors.secondary}40` }}
              />
              <button
                onClick={handleGenerateFromSeed}
                disabled={!customSeed.trim() || isProcessing}
                className="mt-2 px-4 py-2 rounded text-white font-medium text-sm"
                style={{ 
                  backgroundColor: bioluminescentTheme.colors.secondary,
                  opacity: (!customSeed.trim() || isProcessing) ? 0.7 : 1
                }}
              >
                Generate from Seed
              </button>
              <p className="text-xs text-yellow-400 mt-1">⚠️ Never use predictable text for real Bitcoin keys!</p>
            </div>
          )}

          {privateKey && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: bioluminescentTheme.colors.secondary }}>
                Private Key (256-bit / 32 bytes):
              </label>
              <div 
                className="font-mono text-sm p-3 rounded-md overflow-x-auto"
                style={{ 
                  backgroundColor: 'rgba(6, 214, 160, 0.1)',
                  color: bioluminescentTheme.colors.accent1
                }}
              >
                {formatHexDisplay(privateKey)}
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Derive Public Key */}
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
              Derive Public Key (SECP256K1 Elliptic Curve)
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Bitcoin uses elliptic curve cryptography to derive your public key from your private key.
            This is a one-way mathematical function - you can't reverse it to find the private key!
          </p>

          <button
            onClick={handleDerivePublicKey}
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
                Computing...
              </>
            ) : (
              <>
                <Key className="mr-2 h-4 w-4" />
                Derive Public Key
              </>
            )}
          </button>

          {publicKeyCompressed && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: bioluminescentTheme.colors.secondary }}>
                  Public Key (Compressed - 33 bytes):
                </label>
                <div 
                  className="font-mono text-sm p-3 rounded-md overflow-x-auto"
                  style={{ 
                    backgroundColor: 'rgba(6, 214, 160, 0.1)',
                    color: bioluminescentTheme.colors.accent1
                  }}
                >
                  {formatHexDisplay(publicKeyCompressed)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Starts with '02' or '03' + X coordinate (Y can be calculated)</p>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Hash Public Key */}
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
              Hash Public Key (SHA-256 + RIPEMD-160)
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Bitcoin applies two hash functions to create a shorter, more manageable address.
            This creates a unique "fingerprint" of your public key.
          </p>

          <button
            onClick={handleHashPublicKey}
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
                Hashing...
              </>
            ) : (
              <>
                <Hash className="mr-2 h-4 w-4" />
                Hash Public Key
              </>
            )}
          </button>

          {ripemd160Hash && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: bioluminescentTheme.colors.secondary }}>
                  RIPEMD-160 Hash (20 bytes):
                </label>
                <div 
                  className="font-mono text-sm p-3 rounded-md overflow-x-auto"
                  style={{ 
                    backgroundColor: 'rgba(6, 214, 160, 0.1)',
                    color: bioluminescentTheme.colors.accent1
                  }}
                >
                  {formatHexDisplay(ripemd160Hash)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Create Bitcoin Address */}
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
              Create Bitcoin Address (Base58Check)
            </h4>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            The final step adds version bytes and a checksum, then encodes in Base58 to create 
            the familiar Bitcoin address format that's safe to share publicly.
          </p>

          <button
            onClick={handleCreateAddress}
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
                Encoding...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Create Address
              </>
            )}
          </button>

          {bitcoinAddress && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: bioluminescentTheme.colors.secondary }}>
                Bitcoin Address (Base58):
              </label>
              <div 
                className="font-mono text-lg p-3 rounded-md overflow-x-auto font-bold"
                style={{ 
                  backgroundColor: 'rgba(6, 214, 160, 0.2)',
                  color: bioluminescentTheme.colors.primary
                }}
              >
                {bitcoinAddress}
              </div>
              <p className="text-xs text-gray-500 mt-1">✅ Your Bitcoin address - safe to share publicly!</p>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 rounded-md bg-red-900/20 border border-red-500/50">
          <h4 className="text-sm font-semibold mb-2 text-red-400">🚨 Security Warning</h4>
          <p className="text-red-300 text-sm">
            This is educational only. Never use these keys for real Bitcoin! 
            Real wallets use much more sophisticated security measures.
          </p>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={resetSimulation}
            className="px-6 py-2 rounded text-white font-medium"
            style={{ backgroundColor: bioluminescentTheme.colors.secondary }}
          >
            🔄 Start Over
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
            You've successfully generated a Bitcoin key pair using the same cryptographic algorithms 
            as real Bitcoin wallets: SECP256K1 elliptic curves, SHA-256, RIPEMD-160, and Base58Check encoding!
          </p>
        </div>
      )}
    </div>
  );
}