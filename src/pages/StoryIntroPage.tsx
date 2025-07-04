import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function StoryIntroPage() {
  const [, setLocation] = useLocation();
  const [showStory, setShowStory] = useState(false);
  const [glowingCoins, setGlowingCoins] = useState<{x: number, y: number, size: number, delay: number}[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const { username } = useAuth();

  // Generate random glowing coins for the background
  useEffect(() => {
    const coins = Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 5
    }));
    setGlowingCoins(coins);
  }, []);

  // Scroll event for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const parallaxBg = document.querySelector('.parallax-bg') as HTMLElement;
      if (parallaxBg) {
        parallaxBg.style.transform = `translateY(${scrollTop * 0.5}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowStory(true);
    }
  };

  const goToSignup = () => {
    setLocation('/auth');
  };

  const goToLogin = () => {
    setLocation('/auth');
  };

  // Skip to authentication
  const skipToHome = () => {
    setLocation('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 to-amber-950 text-amber-100 overflow-hidden relative">
      {/* Background parallax elements */}
      <div className="parallax-bg absolute inset-0 bg-[url('/patterns/african-pattern.svg')] opacity-10 bg-repeat"></div>
      
      {/* Floating glowing coins animation */}
      {glowingCoins.map((coin, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full z-0 bg-amber-400"
          style={{
            left: `${coin.x}%`,
            top: `${coin.y}%`,
            width: `${coin.size}px`,
            height: `${coin.size}px`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2],
            boxShadow: [
              '0 0 5px 0px rgba(251, 191, 36, 0.4)',
              '0 0 10px 5px rgba(251, 191, 36, 0.6)',
              '0 0 5px 0px rgba(251, 191, 36, 0.4)'
            ]
          }}
          transition={{
            duration: 3 + coin.delay,
            repeat: Infinity,
            delay: coin.delay
          }}
        />
      ))}
      
      {/* Content container */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-amber-300 mb-4 font-serif drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
            Asha and the Whisper of Coins
          </h1>
          <p className="text-xl md:text-2xl text-amber-200/80 italic tracking-wide">
            Journey Through the Realms of Money
          </p>
        </motion.div>

        {!showStory ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto relative"
          >
            <div className="w-full aspect-[16/9] bg-amber-950/60 rounded-xl overflow-hidden relative shadow-[0_0_15px_rgba(251,191,36,0.3)] border-2 border-amber-800/50 mb-8">
              <img 
                src="https://bitcoiners.africa/wp-content/uploads/2025/06/1.png" 
                alt="Story Background" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-70"
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8 backdrop-blur-sm bg-amber-950/40 rounded-lg w-full max-w-2xl flex">
                  {/* Asha on the left */}
                  {currentStep <= 1 && (
                    <div className="w-1/4 flex items-center justify-center">
                      <img 
                        src="https://bitcoiners.africa/wp-content/uploads/2025/06/2-1.png" 
                        alt="Asha" 
                        className="h-32 object-contain"
                      />
                    </div>
                  )}
                  
                  {/* Story Text in the middle */}
                  <div className="flex-1">
                    {currentStep === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                      >
                        <h2 className="text-2xl font-bold text-amber-300">The Journey Begins</h2>
                        <p className="text-amber-100">In a thriving African town where tradition and technology live side by side, a young girl named Asha begins to question the nature of money itself.</p>
                      </motion.div>
                    )}
                    
                    {currentStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                      >
                        <h2 className="text-2xl font-bold text-amber-300">A World in Transition</h2>
                        <p className="text-amber-100">As her country shifts from cash to digital systems, Asha notices changes that raise big questions about control, freedom, and the future of money.</p>
                      </motion.div>
                    )}
                    
                    {currentStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                      >
                        <h2 className="text-2xl font-bold text-amber-300">The Elder's Guidance</h2>
                        <p className="text-amber-100">Guided by a mysterious elder named Odu, Asha will explore ancient markets, digital fortresses, and everything in between to discover the true nature of value.</p>
                      </motion.div>
                    )}
                    
                    {currentStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                      >
                        <h2 className="text-2xl font-bold text-amber-300">Your Adventure Awaits</h2>
                        <p className="text-amber-100">Walk alongside Asha through seven magical realms, each teaching valuable lessons about money's past, present, and future.</p>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Odu on the right */}
                  {currentStep >= 2 && (
                    <div className="w-1/4 flex items-center justify-center">
                      <img 
                        src="/assets/characters/odu.svg" 
                        alt="Odu" 
                        className="h-32 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Progress dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {[0, 1, 2, 3].map((step) => (
                  <div 
                    key={step} 
                    className={`w-3 h-3 rounded-full ${currentStep >= step ? 'bg-amber-400' : 'bg-gray-600'}`}
                  ></div>
                ))}
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextStep}
                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-amber-100 rounded-full font-bold text-lg shadow-lg hover:from-amber-500 hover:to-amber-600 transition-all border border-amber-500/30 flex items-center"
              >
                {currentStep < 3 ? 'Continue Story' : 'Begin Journey'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={skipToHome}
                className="px-6 py-3 bg-amber-900/60 text-amber-300 rounded-full font-bold text-lg hover:bg-amber-800/60 transition-all border border-amber-700/30"
              >
                Skip Intro
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-amber-950/60 backdrop-blur-sm border-2 border-amber-700/40 rounded-lg p-6 md:p-8 shadow-[0_0_20px_rgba(251,191,36,0.2)] mb-8"
            >
              <div className="text-center mb-6">
                <img 
                  src="https://bitcoiners.africa/wp-content/uploads/2025/06/3-1.png" 
                  alt="Asha and Odu with the coin" 
                  className="max-h-48 mx-auto object-contain"
                />
              </div>
              
              <h2 className="text-2xl font-bold text-amber-300 mb-4 flex items-center">
                <motion.span 
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.2, 1] 
                  }} 
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                  className="inline-block mr-3 text-3xl"
                >
                  ✨
                </motion.span>
                Your Quest Awaits
              </h2>
              
              <div className="space-y-6 my-6">
                <div className="p-4 bg-gradient-to-r from-amber-900/40 to-amber-800/20 border-l-4 border-amber-400 rounded flex items-start">
                  <div className="bg-amber-400 text-amber-950 h-8 w-8 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">?</div>
                  <p className="text-lg">Who controls our money?</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-amber-900/40 to-amber-800/20 border-l-4 border-amber-400 rounded flex items-start">
                  <div className="bg-amber-400 text-amber-950 h-8 w-8 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">?</div>
                  <p className="text-lg">What do we give up when everything becomes digital?</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-amber-900/40 to-amber-800/20 border-l-4 border-amber-400 rounded flex items-start">
                  <div className="bg-amber-400 text-amber-950 h-8 w-8 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">?</div>
                  <p className="text-lg">Is there another way?</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-amber-900/30 to-transparent p-4 rounded-lg mb-4 border border-amber-700/30">
                <h3 className="text-xl font-bold text-amber-300 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Game Features
                </h3>
                <ul className="space-y-2 list-inside text-amber-100">
                  <li className="flex items-center">
                    <span className="inline-block w-6 h-6 mr-2 bg-amber-400 text-amber-950 rounded-full flex items-center justify-center font-bold">✓</span>
                    <span>Interactive story with decision points</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-6 h-6 mr-2 bg-amber-400 text-amber-950 rounded-full flex items-center justify-center font-bold">✓</span>
                    <span>Collect badges and rewards as you learn</span>
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-6 h-6 mr-2 bg-amber-400 text-amber-950 rounded-full flex items-center justify-center font-bold">✓</span>
                    <span>Track your progress with the glowing chain map</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4"
            >
              <Button 
                onClick={goToSignup}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-100 px-8 py-6 text-lg rounded-full shadow-[0_0_15px_rgba(251,191,36,0.3)] flex items-center space-x-2 group transition-all duration-300"
              >
                <span>Begin Your Journey</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
              
              <Button 
                onClick={goToLogin}
                variant="outline" 
                className="border-amber-600 text-amber-300 hover:bg-amber-800/40 px-8 py-6 text-lg rounded-full flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Return to Your Journey</span>
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}