import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

// Theme styling
const citadelTheme = {
  name: "The Central Citadel",
  colors: {
    primary: "#00589B",
    secondary: "#0076CE",
    background: "#00243F",
    backgroundLight: "#003660",
    cardBackground: "#F0F7FF",
    textDark: "#002C4E",
    textLight: "#F0F7FF",
    accent1: "#0076CE",
    accent2: "#00A6ED",
    lightText: "#000000",
    gradientStart: "#00243F",
    gradientEnd: "#003E70",
    icon: "#00A6ED",
    border: "#0076CE"
  },
  gradients: {
    sunset: "linear-gradient(to right, #00589B, #0076CE)",
    sand: "linear-gradient(to bottom, #F0F7FF, #D6E9FF)",
    blue: "linear-gradient(to right, #0076CE, #00A6ED)"
  },
  shadows: {
    card: "0 4px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1)",
    button: "0 2px 4px rgba(0, 89, 155, 0.3)"
  }
};

// Game types
type StoryPhase = 'convenience' | 'watching' | 'controlling' | 'escape';
type NotificationType = 'friendly' | 'creepy' | 'threatening' | 'freedom';

interface Purchase {
  item: string;
  emoji: string;
  price: number;
  category: 'normal' | 'personal' | 'private' | 'forbidden';
}

interface Notification {
  message: string;
  type: NotificationType;
  show: boolean;
}

const PrivacyStoryGame = () => {
  const [, setLocation] = useLocation();
  const [currentPhase, setCurrentPhase] = useState<StoryPhase>('convenience');
  const [digitalCoins, setDigitalCoins] = useState(100);
  const [privateCoins, setPrivateCoins] = useState(0);
  const [notification, setNotification] = useState<Notification>({ 
    message: '', 
    type: 'friendly', 
    show: false 
  });
  const [showContinueButton, setShowContinueButton] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Story progression tracking
  const [storyProgress, setStoryProgress] = useState({
    conveniencePurchases: 0,
    creepyNotifications: 0,
    blockedAttempts: 0,
    privatePurchases: 0
  });

  // Phase configurations
  const phaseData = {
    convenience: {
      title: "💳 Digital Convenience",
      background: citadelTheme.gradients.sunset,
      description: "Asha discovers how easy digital payments can be, but doesn't realize the hidden costs...",
      items: [
        { item: 'Coffee', emoji: '☕', price: 5, category: 'normal' as 'normal' },
        { item: 'Book', emoji: '📚', price: 15, category: 'normal' as 'normal' },
        { item: 'Lunch', emoji: '🍕', price: 12, category: 'normal' as 'normal' }
      ]
    },
    watching: {
      title: "👁️ The Watching Begins",
      background: citadelTheme.colors.background,
      description: "Asha starts noticing personalized ads and recommendations based on her purchases...",
      items: [
        { item: 'Coffee', emoji: '☕', price: 5, category: 'normal' },
        { item: 'Book', emoji: '📚', price: 15, category: 'normal' },
        { item: 'Lunch', emoji: '🍕', price: 12, category: 'normal' },
        { item: 'Medicine', emoji: '💊', price: 20, category: 'personal' as 'personal' },
        { item: 'Privacy Book', emoji: '🔒', price: 25, category: 'private' as 'private' }
      ]
    },
    controlling: {
      title: "🚫 Control Emerges",
      background: citadelTheme.colors.backgroundLight,
      description: "The system starts limiting what Asha can buy based on her profile and behavior...",
      items: [
        { item: 'Coffee', emoji: '☕', price: 5, category: 'normal' },
        { item: 'Book', emoji: '📚', price: 15, category: 'normal' },
        { item: 'Lunch', emoji: '🍕', price: 12, category: 'normal' },
        { item: 'Medicine', emoji: '💊', price: 20, category: 'personal' },
        { item: 'Privacy Book', emoji: '🔒', price: 25, category: 'private' },
        { item: 'Protest Sign', emoji: '📢', price: 10, category: 'forbidden' as 'forbidden' }
      ]
    },
    escape: {
      title: "🔐 Finding Privacy",
      background: citadelTheme.gradients.blue,
      description: "Asha discovers private transactions that can't be tracked or controlled...",
      items: [
        { item: 'Coffee', emoji: '☕', price: 5, category: 'normal' as 'normal' },
        { item: 'Book', emoji: '📚', price: 15, category: 'normal' as 'normal' },
        { item: 'Lunch', emoji: '🍕', price: 12, category: 'normal' as 'normal' },
        { item: 'Medicine', emoji: '💊', price: 20, category: 'personal' as 'personal' },
        { item: 'Privacy Book', emoji: '🔒', price: 25, category: 'private' as 'private' },
        { item: 'Protest Sign', emoji: '📢', price: 10, category: 'forbidden' as 'forbidden' }
      ]
    }
  };

  // Scroll to current phase
  useEffect(() => {
    if (scrollContainerRef.current) {
      const phaseElement = document.getElementById(`phase-${currentPhase}`);
      if (phaseElement) {
        phaseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentPhase]);

  // Show notification with auto-hide
  const showNotification = (message: string, type: NotificationType, duration = 4000) => {
    setNotification({ message, type, show: true });
    setShowContinueButton(false);
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
      setShowContinueButton(true);
    }, duration);
  };

  // Handle purchases
  const makePurchase = (item: Purchase, usePrivate = false) => {
    const wallet = usePrivate ? privateCoins : digitalCoins;
    if (wallet < item.price) {
      showNotification("Not enough money!", 'threatening');
      return;
    }

    // Update wallet
    if (usePrivate) {
      setPrivateCoins(prev => prev - item.price);
      setStoryProgress(prev => ({ ...prev, privatePurchases: prev.privatePurchases + 1 }));
    } else {
      setDigitalCoins(prev => prev - item.price);
    }

    // Phase-specific reactions
    switch (currentPhase) {
      case 'convenience':
        handleConveniencePurchase(item);
        break;
      case 'watching':
        handleWatchingPurchase(item);
        break;
      case 'controlling':
        handleControllingPurchase(item, usePrivate);
        break;
      case 'escape':
        handleEscapePurchase(item, usePrivate);
        break;
    }
  };

  const handleConveniencePurchase = (item: Purchase) => {
    showNotification(`✅ ${item.item} purchased! So convenient!`, 'friendly');
    
    setStoryProgress(prev => ({ ...prev, conveniencePurchases: prev.conveniencePurchases + 1 }));
    
    if (storyProgress.conveniencePurchases >= 2) {
      setTimeout(() => {
        setCurrentPhase('watching');
        showNotification("System updated with enhanced tracking for your convenience!", 'creepy');
      }, 2000);
    }
  };

  const handleWatchingPurchase = (item: Purchase) => {
    // Creepy personalized messages
    const creepyMessages = [
      `We noticed you bought ${item.item}. Here are 20 similar recommendations!`,
      `Based on your purchase history, we think you might like these products...`,
      `Your health score decreased. Consider healthier options.`,
      `This purchase was shared with your insurance company.`,
      `Your location and purchase logged for advertising purposes.`
    ];
    
    const message = creepyMessages[Math.floor(Math.random() * creepyMessages.length)];
    showNotification(message, 'creepy');
    
    setStoryProgress(prev => ({ ...prev, creepyNotifications: prev.creepyNotifications + 1 }));
    
    if (storyProgress.creepyNotifications >= 2) {
      setTimeout(() => {
        setCurrentPhase('controlling');
        showNotification("Enhanced security protocols now active.", 'threatening');
      }, 3000);
    }
  };

  const handleControllingPurchase = (item: Purchase, usePrivate: boolean) => {
    if (!usePrivate && (item.category === 'private' || item.category === 'forbidden')) {
      // Block the purchase
      setStoryProgress(prev => ({ ...prev, blockedAttempts: prev.blockedAttempts + 1 }));
      
      const denialMessages = [
        "🚫 This item is not available to users with your profile.",
        "🚫 Purchase denied. This conflicts with your assigned health goals.",
        "🚫 Access restricted. Please contact your account administrator.",
        "🚫 This item has been flagged as inappropriate for your demographic."
      ];
      
      showNotification(denialMessages[Math.floor(Math.random() * denialMessages.length)], 'threatening');
      
      if (storyProgress.blockedAttempts >= 1) {
        setTimeout(() => {
          setPrivateCoins(20); // Odu gives private coins
          setCurrentPhase('escape');
          showNotification("🧓🏾 Odu whispers: 'Try these private coins instead...'", 'freedom');
        }, 2000);
      }
      return;
    }
    
    // Allow normal purchases
    showNotification(`✅ ${item.item} purchased. Purchase logged and analyzed.`, 'threatening');
  };

  const handleEscapePurchase = (item: Purchase, usePrivate: boolean) => {
    if (usePrivate) {
      showNotification(`🔐 ${item.item} purchased privately! No tracking, no logging.`, 'freedom');
      
      if (storyProgress.privatePurchases >= 2) {
        setTimeout(() => {
          showVictoryScreen();
        }, 2000);
      }
    } else {
      showNotification(`⚠️ ${item.item} purchased with tracked money. Your privacy is gone.`, 'threatening');
    }
  };

  const showVictoryScreen = () => {
    setCurrentPhase('escape'); // Stay on escape phase but show victory content
  };

  const advancePhase = () => {
    const phases: StoryPhase[] = ['convenience', 'watching', 'controlling', 'escape'];
    const currentIndex = phases.indexOf(currentPhase);
    
    if (currentIndex < phases.length - 1) {
      setCurrentPhase(phases[currentIndex + 1]);
      setShowContinueButton(false);
      
      // Reset some state for new phase
      setNotification({ message: '', type: 'friendly', show: false });
      
      // Add coins for new phases
      if (phases[currentIndex + 1] === 'escape') {
        setPrivateCoins(20);
      }
    }
  };

  // Render each phase section
  const renderPhaseSection = (phase: StoryPhase) => {
    const data = phaseData[phase];
    const isCurrent = currentPhase === phase;

    return (
      <section 
        id={`phase-${phase}`}
        key={phase}
        className={`min-h-screen flex flex-col justify-center p-8 transition-all duration-500 ${isCurrent ? 'opacity-100' : 'opacity-60'}`}
        style={{ background: data.background }}
      >
        <div className="max-w-4xl mx-auto bg-black bg-opacity-40 rounded-xl p-8 border border-blue-400 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Asha character */}
            <div className="flex-shrink-0">
              <img 
                src="https://bitcoiners.africa/wp-content/uploads/2025/06/asha2.png" 
                alt="Asha" 
                className="w-48 h-48 object-contain"
              />
            </div>
            
            {/* Phase content */}
            <div className="flex-grow">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-3xl font-bold" style={{ color: citadelTheme.colors.textLight }}>
                  {data.title}
                </h2>
                <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm">
                  {phase === 'convenience' ? 'Stage 1' :
                   phase === 'watching' ? 'Stage 2' :
                   phase === 'controlling' ? 'Stage 3' : 'Stage 4'}
                </span>
              </div>
              
              <p className="text-lg mb-6" style={{ color: citadelTheme.colors.textLight }}>
                {data.description}
              </p>
              
              {/* Current money */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-2" style={{ color: citadelTheme.colors.accent2 }}>
                  YOUR MONEY
                </h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-blue-900 bg-opacity-50 px-4 py-2 rounded-lg">
                    <span className="text-xl">💳</span>
                    <span style={{ color: citadelTheme.colors.textLight }}>
                      Digital: {digitalCoins}
                    </span>
                  </div>
                  {privateCoins > 0 && (
                    <div className="flex items-center gap-2 bg-green-900 bg-opacity-50 px-4 py-2 rounded-lg">
                      <span className="text-xl">🔐</span>
                      <span style={{ color: citadelTheme.colors.textLight }}>
                        Private: {privateCoins}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Items to buy */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-2" style={{ color: citadelTheme.colors.accent2 }}>
                  ITEMS AVAILABLE
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.items.map((item, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border transition-all ${
                        phase === 'controlling' && !privateCoins && (item.category === 'private' || item.category === 'forbidden') ? 
                        'border-red-500 bg-red-900 bg-opacity-30' : 
                        'border-blue-400'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{item.emoji}</span>
                        <div>
                          <h4 className="font-medium" style={{ color: citadelTheme.colors.textLight }}>
                            {item.item}
                          </h4>
                          <p className="text-sm" style={{ color: citadelTheme.colors.textLight }}>
                            {item.category === 'normal' ? 'Normal item' :
                             item.category === 'personal' ? 'Personal' :
                             item.category === 'private' ? 'Private' : 'Restricted'}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-3" style={{ color: citadelTheme.colors.textLight }}>
                        Price: {item.price} coins
                      </p>
                      
                      <div className="space-y-2">
                        <button
                          onClick={() => makePurchase(item as Purchase, false)}
                          disabled={digitalCoins < item.price || 
                                    (phase === 'controlling' && item.category === 'forbidden' && !privateCoins)}
                          className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                            digitalCoins >= item.price && 
                            !(phase === 'controlling' && item.category === 'forbidden' && !privateCoins)
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Buy with Digital Money
                        </button>
                        
                        {privateCoins > 0 && privateCoins >= item.price && (
                          <button
                            onClick={() => makePurchase(item as Purchase, true)}
                            className="w-full py-2 px-4 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white"
                          >
                            Buy Privately
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Continue button */}
              {showContinueButton && isCurrent && phase !== 'escape' && (
                <div className="text-center mt-6">
                  <button
                    onClick={advancePhase}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Continue Story →
                  </button>
                </div>
              )}
              
              {/* Victory content */}
              {isCurrent && phase === 'escape' && storyProgress.privatePurchases >= 2 && (
                <div className="bg-green-900 bg-opacity-30 p-6 rounded-lg border border-green-400 mt-6">
                  <h3 className="text-xl font-bold mb-4 text-center" style={{ color: citadelTheme.colors.textLight }}>
                    🎉 Privacy Victory!
                  </h3>
                  <p className="mb-4 text-center" style={{ color: citadelTheme.colors.textLight }}>
                    Asha has discovered the power of private transactions that can't be tracked or controlled!
                  </p>
                  <div className="text-center">
                    <button
                      onClick={() => setLocation('/realm/2')}
                      className="bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg"
                    >
                      Continue to Next Lesson →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };
  return (
    <div 
      ref={scrollContainerRef}
      className="relative overflow-y-auto h-screen snap-y snap-mandatory"
      style={{ background: citadelTheme.colors.background }}
    >
      {/* Notification system */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className={`p-4 rounded-lg shadow-lg border-l-4 ${
            notification.type === 'friendly' ? 'bg-blue-900 border-blue-400 text-blue-100' :
            notification.type === 'creepy' ? 'bg-yellow-900 border-yellow-400 text-yellow-100' :
            notification.type === 'threatening' ? 'bg-red-900 border-red-400 text-red-100' :
            'bg-green-900 border-green-400 text-green-100'
          }`}>
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="fixed top-4 left-4 z-50">
        <button 
          onClick={() => setLocation('/realm/2')}
          className="flex items-center gap-2 bg-blue-900 bg-opacity-80 px-4 py-2 rounded-lg border border-blue-400"
          style={{ color: citadelTheme.colors.textLight }}
        >
          <span className="text-xl">→</span>
          <span>Continue to Realm</span>
        </button>
      </div>
      
      {/* Progress indicator */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex gap-2 bg-black bg-opacity-70 px-4 py-2 rounded-full border border-blue-400">
          {Object.keys(phaseData).map((phase, i) => (
            <button
              key={phase}
              onClick={() => setCurrentPhase(phase as StoryPhase)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentPhase === phase ? 'bg-blue-500 scale-125' : 'bg-blue-800'
              }`}
              aria-label={`Go to ${phaseData[phase as StoryPhase].title}`}
            />
          ))}
        </div>
      </div>
      
      {/* Odu appears in later phases */}
      {(currentPhase === 'controlling' || currentPhase === 'escape') && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="text-6xl animate-pulse">🧓🏾</div>
          {currentPhase === 'escape' && (
            <div className="absolute -top-16 right-0 bg-green-900 bg-opacity-90 rounded-lg p-2 border border-green-400 max-w-xs">
              <p className="text-green-200 text-xs">
                "Privacy is freedom, child."
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Render all phase sections */}
      {(['convenience', 'watching', 'controlling', 'escape'] as StoryPhase[]).map(phase => 
        renderPhaseSection(phase)
      )}
    </div>
  );
};

export default PrivacyStoryGame;