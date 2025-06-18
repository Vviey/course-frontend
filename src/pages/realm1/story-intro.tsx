import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

// Theme styling
const originTheme = {
  name: "Realm of Origins",
  colors: {
    primary: "#EE720B",
    secondary: "#FFC567", 
    background: "#3E1E00",
    backgroundLight: "#70350A",
    cardBackground: "transparent",
    textDark: "#3E1E00",
    textLight: "#FBF4D2",
    accent1: "#EB5A00",
    accent2: "#DB9D47",
    primaryAccent: "#EE720B",
    darkText: "#3A2E00",
    gradientStart: "#B34700",
    gradientEnd: "#EE720B",
    lightText: "#000000",
    icon: "#FFC567",
    border: "#EE720B"
  },
  patterns: {
    code: "url('/textures/village-pattern.svg')"
  }
};

// Game types
type MoneyEvolution = 'barter-fails' | 'cowrie-shells' | 'gold-dust' | 'colonial-coins' | 'nation-currency' | 'revelation';
type TradeResult = 'success' | 'mismatch' | 'timing' | 'quality' | 'rejected' | 'indivisible' | 'stolen' | 'discrimination' | 'inflation';

interface TradeAttempt {
  id: string;
  item: string;
  wants: string;
  result: TradeResult;
}

interface MoneyScore {
  tradesAttempted: number;
  tradesFailed: number;
  evolutionsWitnessed: number;
}

const TimbuktuTradingJourney = () => {
  const [, setLocation] = useLocation();
  const [currentEra, setCurrentEra] = useState<MoneyEvolution>('barter-fails');
  const [tradeAttempts, setTradeAttempts] = useState<TradeAttempt[]>([]);
  const [score, setScore] = useState<MoneyScore>({
    tradesAttempted: 0,
    tradesFailed: 0,
    evolutionsWitnessed: 0
  });
  
  const [playerInventory, setPlayerInventory] = useState({
    salt: 2,
    dates: 3,
    leather: 1,
    cowries: 0,
    goldNuggets: 0,
    colonialCoins: 0,
    nationalCurrency: 0
  });
  
  const [activeTrader, setActiveTrader] = useState<string | null>(null);
  const [tradeResult, setTradeResult] = useState<{success: boolean, message: string} | null>(null);
  const [oduWisdom, setOduWisdom] = useState('');
  const [showExchange, setShowExchange] = useState(false);
  const [inflationHappened, setInflationHappened] = useState(false);
  const [goldStolen, setGoldStolen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Era configurations
  const eraData = {
    'barter-fails': {
      title: "The Barter Struggles",
      background: originTheme.colors.background,
      year: "1300 CE",
      description: "In the bustling markets of Timbuktu, Asha tries to trade goods directly but faces the limitations of barter."
    },
    'cowrie-shells': {
      title: "The Cowrie Revolution",
      background: originTheme.colors.backgroundLight,
      year: "1320 CE", 
      description: "Coastal traders introduce cowrie shells as standardized money, solving some barter problems."
    },
    'gold-dust': {
      title: "Mansa Musa's Golden Age",
      background: originTheme.colors.background,
      year: "1324 CE",
      description: "Mansa Musa's wealth brings gold nuggets as a new standard, but they come with new problems."
    },
    'colonial-coins': {
      title: "The Colonial Disruption",
      background: originTheme.colors.backgroundLight,
      year: "1880 CE",
      description: "European colonial powers impose their metal coins, disrupting local monetary systems and creating inequality."
    },
    'nation-currency': {
      title: "The Paper Promise",
      background: originTheme.colors.background,
      year: "1960 CE",
      description: "New national currencies emerge after independence, but their value can change overnight."
    },
    'revelation': {
      title: "The Pattern Revealed",
      background: originTheme.colors.backgroundLight,
      year: "Present",
      description: "Asha discovers the fundamental problems with each monetary system throughout history."
    }
  };

  // Scroll to current era
  useEffect(() => {
    if (scrollContainerRef.current) {
      const eraElement = document.getElementById(`era-${currentEra}`);
      if (eraElement) {
        eraElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentEra]);

  // Era traders with updated pricing
  const getEraTraders = () => {
    switch (currentEra) {
      case 'barter-fails':
        return [
          { id: 'cloth-merchant', name: 'Cloth Merchant', emoji: '👳🏾‍♂️', wants: 'dates', has: 'cloth' },
          { id: 'gold-trader', name: 'Gold Trader', emoji: '👨🏾‍💼', wants: 'leather', has: 'gold' },
          { id: 'spice-seller', name: 'Spice Merchant', emoji: '🧙🏾‍♀️', wants: 'salt', has: 'spices' }
        ];
      case 'cowrie-shells':
        return [
          { id: 'coastal-trader', name: 'Coastal Trader', emoji: '🏺', accepts: 'cowries', price: 5, has: 'cloth' },
          { id: 'food-merchant', name: 'Food Merchant', emoji: '🍲', accepts: 'cowries', price: 3, has: 'food' },
          { id: 'tool-maker', name: 'Tool Maker', emoji: '⚒️', accepts: 'cowries', price: 8, has: 'tools' }
        ];
      case 'gold-dust':
        return [
          { id: 'spice-trader', name: 'Spice Trader', emoji: '🌶️', accepts: 'goldNuggets', price: 0.3, has: 'spices', fractional: true },
          { id: 'cloth-weaver', name: 'Cloth Weaver', emoji: '🧵', accepts: 'goldNuggets', price: 0.7, has: 'fine cloth', fractional: true },
          { id: 'pottery-maker', name: 'Pottery Maker', emoji: '🏺', accepts: 'goldNuggets', price: 0.4, has: 'pottery', fractional: true }
        ];
      case 'colonial-coins':
        return [
          { id: 'british-merchant', name: 'British Merchant', emoji: '🎩', accepts: 'colonialCoins', price: 10, has: 'imported goods' },
          { id: 'tax-collector', name: 'Tax Collector', emoji: '💰', accepts: 'colonialCoins', price: 15, has: 'tax receipt' },
          { id: 'colonial-shop', name: 'Colonial Shop', emoji: '🏪', accepts: 'colonialCoins', price: 7, has: 'basic goods' }
        ];
      case 'nation-currency':
        const basePrice = inflationHappened ? 6 : 3; // Prices double after inflation
        return [
          { id: 'local-shop', name: 'Local Shop', emoji: '🛒', accepts: 'nationalCurrency', price: basePrice, has: 'cloth' },
          { id: 'spice-vendor', name: 'Spice Vendor', emoji: '🌶️', accepts: 'nationalCurrency', price: basePrice - 1, has: 'spices' },
          { id: 'food-stall', name: 'Food Stall', emoji: '🍲', accepts: 'nationalCurrency', price: basePrice + 1, has: 'food' }
        ];
      default:
        return [];
    }
  };

  // Handle currency exchange for colonial era
  const handleExchange = (from: string, amount: number) => {
    if (from === 'goldNuggets' && playerInventory.goldNuggets >= amount) {
      // Fair rate: 1 gold = 2 shillings, but 1 shilling fee
      const received = (amount * 2) - 1;
      setPlayerInventory(prev => ({
        ...prev,
        goldNuggets: prev.goldNuggets - amount,
        colonialCoins: prev.colonialCoins + Math.max(0, received)
      }));
      setTradeResult({ 
        success: true, 
        message: `Exchanged ${amount} gold for ${Math.max(0, received)} shillings (1 shilling fee charged)` 
      });
    } else if (from === 'cowries' && playerInventory.cowries >= amount) {
      // Insulting rate: 100 cowries = 1 shilling, plus 1 shilling fee
      const received = Math.floor(amount / 100) - 1;
      setPlayerInventory(prev => ({
        ...prev,
        cowries: prev.cowries - amount,
        colonialCoins: prev.colonialCoins + Math.max(0, received)
      }));
      setTradeResult({ 
        success: false, 
        message: `Exchanged ${amount} cowries for only ${Math.max(0, received)} shilling${received !== 1 ? 's' : ''} (insulting rate + fees!)` 
      });
    }
    setShowExchange(false);
  };

  // Trigger inflation in paper era
  const triggerInflation = () => {
    if (!inflationHappened) {
      setInflationHappened(true);
      setTradeResult({
        success: false,
        message: "📰 BREAKING NEWS: Inflation hits! Currency value halves overnight! Your savings are now worth half!"
      });
    }
  };

  // Handle trade attempts with new mechanics
  const attemptTrade = (traderId: string, offering?: string) => {
    const traders = getEraTraders();
    const trader = traders.find(t => t.id === traderId);
    if (!trader) return;

    setActiveTrader(traderId);
    setScore(prev => ({ ...prev, tradesAttempted: prev.tradesAttempted + 1 }));

    // Barter era - random failures
    if (currentEra === 'barter-fails') {
      const success = Math.random() > 0.7;
      
      if (success) {
        setTradeResult({ success: true, message: "Trade successful!" });
        setTimeout(() => advanceEra(), 2000);
      } else {
        const failures = ['timing', 'quality', 'mismatch'] as const;
        const failureType = failures[Math.floor(Math.random() * failures.length)];
        
        setScore(prev => ({ ...prev, tradesFailed: prev.tradesFailed + 1 }));
        const messages = {
          timing: "Sorry, I needed dates YESTERDAY for my caravan!",
          quality: "This leather quality isn't what I need for my customers!",
          mismatch: "I only need HALF your salt, but you won't split it!"
        };
        
        setTradeResult({ success: false, message: messages[failureType] });
        setTradeAttempts(prev => [...prev, {
          id: Date.now().toString(),
          item: offering || 'unknown',
          wants: trader.has,
          result: failureType
        }]);
        
        if (score.tradesFailed >= 2) {
          setTimeout(() => {
            setOduWisdom("Child, I see your struggle. The problem is barter itself. Let me show you how money evolved...");
            setTimeout(() => advanceEra(), 3000);
          }, 2000);
        }
      }
    }
    
    // Gold era - indivisibility problem
    else if (currentEra === 'gold-dust') {
      if ('fractional' in trader && trader.fractional) {
        // Gold can't be divided
        setScore(prev => ({ ...prev, tradesFailed: prev.tradesFailed + 1 }));
        setTradeResult({ 
          success: false, 
          message: `This item costs ${trader.price} gold nuggets, but you can't break your gold into pieces! No one can give you change.` 
        });
        
        // Random chance of theft
        if (Math.random() > 0.7 && !goldStolen) {
          setTimeout(() => {
            setGoldStolen(true);
            setPlayerInventory(prev => ({ ...prev, goldNuggets: 0 }));
            setTradeResult({ 
              success: false, 
              message: "💀 A thief snatched your gold while you were trying to trade! Gold is valuable... and dangerous to carry." 
            });
            setTimeout(() => {
              setOduWisdom("Child, see how gold brings new problems? It cannot be divided, and wealth attracts thieves...");
              setTimeout(() => advanceEra(), 3000);
            }, 2000);
          }, 2000);
        } else if (score.tradesFailed >= 2) {
          setTimeout(() => {
            setOduWisdom("Gold seems perfect, but it cannot be divided. How do you buy something worth half a nugget?");
            setTimeout(() => advanceEra(), 3000);
          }, 2000);
        }
      }
    }
    
    // Colonial era - discrimination
    else if (currentEra === 'colonial-coins') {
      if ('price' in trader && playerInventory.colonialCoins < trader.price) {
        setTradeResult({ 
          success: false, 
          message: "We don't take your local money. Only British coins accepted here. You must exchange first." 
        });
        setShowExchange(true);
      } else {
        setPlayerInventory(prev => ({
          ...prev,
          colonialCoins: prev.colonialCoins - ('price' in trader ? trader.price : 0)
        }));
        setTradeResult({ success: true, message: "Trade completed with colonial currency." });
        setTimeout(() => advanceEra(), 2000);
      }
    }
    
    // Paper era - inflation
    else if (currentEra === 'nation-currency') {
      if (!inflationHappened) {
        // First trade triggers inflation
        triggerInflation();
        return;
      }
      
      if ('price' in trader && playerInventory.nationalCurrency < trader.price) {
        setTradeResult({ 
          success: false, 
          message: "You can't afford this anymore! Your money lost value overnight!" 
        });
        setTimeout(() => {
          setOduWisdom("What's a promise worth when it can be broken overnight, child?");
          setTimeout(() => advanceEra(), 3000);
        }, 2000);
      } else {
        setPlayerInventory(prev => ({
          ...prev,
          nationalCurrency: prev.nationalCurrency - ('price' in trader ? trader.price : 0)
        }));
        setTradeResult({ success: true, message: "Trade successful, but prices have doubled!" });
        setTimeout(() => advanceEra(), 2000);
      }
    }
    
    // Cowrie era - works fine
    else {
      if ('accepts' in trader && playerInventory[trader.accepts as keyof typeof playerInventory] >= trader.price) {
        setPlayerInventory(prev => ({
          ...prev,
          [trader.accepts]: prev[trader.accepts as keyof typeof playerInventory] - trader.price
        }));
        setTradeResult({ success: true, message: "Standardized money makes trade easy!" });
        setTimeout(() => advanceEra(), 2000);
      }
    }
  };

  const advanceEra = () => {
    const eras: MoneyEvolution[] = ['barter-fails', 'cowrie-shells', 'gold-dust', 'colonial-coins', 'nation-currency', 'revelation'];
    const currentIndex = eras.indexOf(currentEra);
    
    if (currentIndex < eras.length - 1) {
      const nextEra = eras[currentIndex + 1];
      setCurrentEra(nextEra);
      setScore(prev => ({ ...prev, evolutionsWitnessed: prev.evolutionsWitnessed + 1 }));
      setTradeResult(null);
      setActiveTrader(null);
      setOduWisdom('');
      setShowExchange(false);
      setInflationHappened(false);
      setGoldStolen(false);
      
      // Update inventory for new era
      const newInventory = { ...playerInventory };
      if (nextEra === 'cowrie-shells') {
        newInventory.cowries = 20;
      } else if (nextEra === 'gold-dust') {
        newInventory.goldNuggets = 1; // Just 1 gold nugget
      } else if (nextEra === 'colonial-coins') {
        newInventory.cowries = 100; // Some leftover cowries
        newInventory.goldNuggets = 1; // Some leftover gold
        newInventory.colonialCoins = 0; // No colonial coins initially
      } else if (nextEra === 'nation-currency') {
        newInventory.nationalCurrency = 5; // Enough for original prices
      }
      setPlayerInventory(newInventory);
    }
  };

  // Get inventory items that have count > 0
  const getVisibleInventory = () => {
    return Object.entries(playerInventory)
      .filter(([_, count]) => count > 0)
      .map(([item, count]) => ({ item, count }));
  };

  // Render each era section
  const renderEraSection = (era: MoneyEvolution) => {
    const data = eraData[era];
    const isCurrent = currentEra === era;
    const traders = getEraTraders();

    return (
      <section 
        id={`era-${era}`}
        key={era}
        className={`min-h-screen flex flex-col justify-center p-8 transition-all duration-500 ${isCurrent ? 'opacity-100' : 'opacity-60'}`}
        style={{ background: data.background }}
      >
        <div className="max-w-4xl mx-auto bg-black bg-opacity-40 rounded-xl p-8 border border-orange-400 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Asha character */}
            <div className="flex-shrink-0">
              <img 
                src="https://bitcoiners.africa/wp-content/uploads/2025/06/asha2.png" 
                alt="Asha" 
                className="w-48 h-48 object-contain"
              />
            </div>
            
            {/* Era content */}
            <div className="flex-grow">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-3xl font-bold" style={{ color: originTheme.colors.primary }}>
                  {data.title}
                </h2>
                <span className="bg-orange-900 text-orange-200 px-3 py-1 rounded-full text-sm">
                  {data.year}
                </span>
              </div>
              
              <p className="text-lg mb-6" style={{ color: originTheme.colors.textLight }}>
                {data.description}
              </p>
              
              {/* Inflation news banner for paper era */}
              {era === 'nation-currency' && inflationHappened && (
                <div className="bg-red-900 bg-opacity-70 border border-red-400 p-4 rounded-lg mb-6 animate-pulse">
                  <h4 className="text-red-200 font-bold text-lg mb-2">📰 BREAKING NEWS</h4>
                  <p className="text-red-100">Government prints more money! Currency value drops 50% overnight!</p>
                </div>
              )}
              
              {/* Current inventory */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-2" style={{ color: originTheme.colors.secondary }}>
                  ASHA'S INVENTORY
                </h3>
                <div className="flex flex-wrap gap-3">
                  {getVisibleInventory().map(({item, count}) => (
                    <div 
                      key={item} 
                      className="flex items-center gap-2 bg-orange-900 bg-opacity-50 px-3 py-2 rounded-lg"
                    >
                      <span className="text-xl">
                        {item === 'salt' ? '🧂' :
                         item === 'dates' ? '🫐' :
                         item === 'leather' ? '🦬' :
                         item === 'cowries' ? '🐚' :
                         item === 'goldNuggets' ? '🥇' :
                         item === 'colonialCoins' ? '🪙' : '💵'}
                      </span>
                      <span style={{ color: originTheme.colors.textLight }}>
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Currency exchange for colonial era */}
              {showExchange && era === 'colonial-coins' && (
                <div className="bg-gray-800 bg-opacity-70 p-6 rounded-lg mb-6 border border-gray-400">
                  <h4 className="text-gray-200 font-bold mb-4">💱 Currency Exchange (Required)</h4>
                  <p className="text-gray-300 mb-4">Exchange your local money for British coins:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {playerInventory.goldNuggets > 0 && (
                      <div className="border border-yellow-400 p-3 rounded">
                        <p className="text-yellow-200 mb-2">🥇 Gold: 1 nugget = 2 shillings</p>
                        <p className="text-red-200 text-sm mb-3">Exchange fee: 1 shilling</p>
                        <button
                          onClick={() => handleExchange('goldNuggets', 1)}
                          className="w-full py-2 px-4 bg-yellow-600 text-black rounded font-medium"
                        >
                          Exchange 1 Gold
                        </button>
                      </div>
                    )}
                    
                    {playerInventory.cowries > 0 && (
                      <div className="border border-blue-400 p-3 rounded">
                        <p className="text-blue-200 mb-2">🐚 Cowries: 100 shells = 1 shilling</p>
                        <p className="text-red-200 text-sm mb-3">Insulting rate + exchange fee!</p>
                        <button
                          onClick={() => handleExchange('cowries', 100)}
                          className="w-full py-2 px-4 bg-blue-600 text-white rounded font-medium"
                          disabled={playerInventory.cowries < 100}
                        >
                          Exchange 100 Cowries
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Traders */}
              {traders.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-2" style={{ color: originTheme.colors.secondary }}>
                    AVAILABLE TRADERS
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {traders.map(trader => (
                      <div 
                        key={trader.id}
                        className={`p-4 rounded-lg border transition-all ${activeTrader === trader.id ? 'border-orange-500 bg-orange-900 bg-opacity-30' : 'border-orange-800'}`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">{trader.emoji}</span>
                          <h4 className="font-medium" style={{ color: originTheme.colors.textLight }}>
                            {trader.name}
                          </h4>
                        </div>
                        
                        {era === 'barter-fails' ? (
                          <>
                            <p className="text-sm mb-3" style={{ color: originTheme.colors.textLight }}>
                              Wants: {'wants' in trader ? trader.wants : 'N/A'}<br />
                              Offers: {trader.has}
                            </p>
                            <button
                              onClick={() => {
                                if ('wants' in trader) {
                                  attemptTrade(trader.id, trader.wants);
                                }
                              }}
                              className="w-full py-2 px-4 rounded-lg font-medium transition-all"
                              style={{ 
                                background: originTheme.colors.primary,
                                color: originTheme.colors.textDark,
                                border: `2px solid ${originTheme.colors.secondary}`
                              }}
                            >
                              Trade {'wants' in trader ? trader.wants : 'N/A'}
                            </button>
                          </>
                        ) : (
                          <>
                            <p className="text-sm mb-3" style={{ color: originTheme.colors.textLight }}>
                              Price: {'price' in trader ? trader.price : 0} {'accepts' in trader ? (
                                trader.accepts === 'cowries' ? '🐚' : 
                                trader.accepts === 'goldNuggets' ? '🥇' : 
                                trader.accepts === 'colonialCoins' ? '🪙' : '💵'
                              ) : '💵'}
                              {'fractional' in trader && trader.fractional && <span className="text-red-300"> (fraction!)</span>}
                              <br />
                              Offers: {trader.has}
                            </p>
                            <button
                              onClick={() => attemptTrade(trader.id)}
                              className="w-full py-2 px-4 rounded-lg font-medium transition-all"
                              style={{ 
                                background: originTheme.colors.primary,
                                color: originTheme.colors.textDark,
                                border: `2px solid ${originTheme.colors.secondary}`
                              }}
                              disabled={
                                'accepts' in trader && 'price' in trader && 
                                (era === 'colonial-coins' && playerInventory.colonialCoins < trader.price) ||
                                (era === 'nation-currency' && 'price' in trader && playerInventory.nationalCurrency < trader.price) ||
                                (era === 'cowrie-shells' && 'price' in trader && playerInventory.cowries < trader.price)
                              }
                            >
                              {'accepts' in trader ? (
                                trader.accepts === 'cowries' ? 'Pay with Cowries' : 
                                trader.accepts === 'goldNuggets' ? 'Pay with Gold' : 
                                trader.accepts === 'colonialCoins' ? 'Pay with Coins' : 'Pay with Paper'
                              ) : 'Trade'}
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Trade result */}
              {tradeResult && (
                <div 
                  className={`p-4 rounded-lg mb-6 ${tradeResult.success ? 'bg-green-900 bg-opacity-50' : 'bg-red-900 bg-opacity-50'}`}
                >
                  <p className="font-medium" style={{ color: originTheme.colors.textLight }}>
                    {tradeResult.success ? '✅ ' : '❌ '}{tradeResult.message}
                  </p>
                </div>
              )}
              
              {/* Odu's wisdom */}
              {oduWisdom && (
                <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg border border-purple-400 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🧓🏾</span>
                    <p className="italic" style={{ color: originTheme.colors.textLight }}>
                      "{oduWisdom}"
                    </p>
                  </div>
                </div>
              )}
              
              {/* Failed trades */}
              {tradeAttempts.length > 0 && era === 'barter-fails' && (
                <div className="bg-orange-900 bg-opacity-30 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold mb-2" style={{ color: originTheme.colors.secondary }}>
                    FAILED TRADES
                  </h4>
                  <div className="space-y-1">
                    {tradeAttempts.slice(-3).map(attempt => (
                      <div 
                        key={attempt.id} 
                        className="text-sm"
                        style={{ color: originTheme.colors.textLight }}
                      >
                        • Couldn't trade {attempt.item} for {attempt.wants} ({attempt.result})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Victory screen
  if (currentEra === 'revelation') {
    return (
      <section 
        className="min-h-screen flex items-center justify-center p-8"
        style={{ background: originTheme.colors.backgroundLight }}
      >
        <div className="max-w-4xl mx-auto bg-black bg-opacity-50 rounded-xl p-8 border border-orange-400 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4" style={{ color: originTheme.colors.primary }}>
              The Pattern Revealed
            </h2>
            <p className="text-xl mb-6" style={{ color: originTheme.colors.textLight }}>
              "Now I understand! Each money brought solutions... but also new problems!" - Asha
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: originTheme.colors.secondary }}>
                What Asha Experienced
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span>🧂</span>
                  <span style={{ color: originTheme.colors.textLight }}>
                    <strong>Barter:</strong> No coincidence of wants, timing problems
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🐚</span>
                  <span style={{ color: originTheme.colors.textLight }}>
                    <strong>Cowries:</strong> Standardized but supply controlled by others
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🥇</span>
                  <span style={{ color: originTheme.colors.textLight }}>
                    <strong>Gold:</strong> Can't be divided, dangerous to carry (theft!)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🪙</span>
                  <span style={{ color: originTheme.colors.textLight }}>
                    <strong>Colonial Coins:</strong> Discrimination, unfair exchange rates
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>💵</span>
                  <span style={{ color: originTheme.colors.textLight }}>
                    <strong>Paper Money:</strong> Value can disappear overnight (inflation!)
                  </span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: originTheme.colors.secondary }}>
                The Pattern
              </h3>
              <div className="bg-orange-900 bg-opacity-30 p-4 rounded-lg mb-4">
                <p style={{ color: originTheme.colors.textLight }}>
                  Every solution created new problems. Every money system required trusting someone else's authority!
                </p>
              </div>
              
              <div className="bg-purple-900 bg-opacity-30 p-4 rounded-lg border border-purple-400">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🧓🏾</span>
                  <p className="italic" style={{ color: originTheme.colors.textLight }}>
                    "Child, what if money could work without needing to trust any authority? What if it couldn't be stolen, inflated, or controlled?"
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setLocation('/realm/1')}
              className="py-3 px-8 rounded-lg font-bold text-lg transition-all transform hover:scale-105"
              style={{ 
                background: `linear-gradient(to right, ${originTheme.colors.gradientStart}, ${originTheme.colors.gradientEnd})`,
                color: originTheme.colors.textDark,
                border: `2px solid ${originTheme.colors.secondary}`
              }}
            >
              🚀 Discover Bitcoin's Solution →
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div 
      ref={scrollContainerRef}
      className="relative overflow-y-auto h-screen snap-y snap-mandatory"
      style={{ background: originTheme.colors.background }}
    >
      {/* Navigation */}
      <div className="fixed top-4 left-4 z-50">
        <button 
          onClick={() => setLocation('/realm/1')}
          className="flex items-center gap-2 bg-orange-900 bg-opacity-80 px-4 py-2 rounded-lg border border-orange-400"
        >
          <span className="text-xl">→</span>
          <span style={{ color: originTheme.colors.textLight }}>Continue to Realm</span>
        </button>
      </div>
      
      {/* Progress indicator */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex gap-2 bg-black bg-opacity-70 px-4 py-2 rounded-full border border-orange-400">
          {Object.keys(eraData).map((era, i) => (
            <button
              key={era}
              onClick={() => setCurrentEra(era as MoneyEvolution)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentEra === era ? 'bg-orange-500 scale-125' : 'bg-orange-800'
              }`}
              aria-label={`Go to ${eraData[era as MoneyEvolution].title}`}
            />
          ))}
        </div>
      </div>
      
      {/* Render all era sections */}
      {(['barter-fails', 'cowrie-shells', 'gold-dust', 'colonial-coins', 'nation-currency'] as MoneyEvolution[]).map(era => 
        renderEraSection(era)
      )}
    </div>
  );
};

export default TimbuktuTradingJourney;