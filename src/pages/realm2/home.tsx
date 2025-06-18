import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { realm2Missions } from "@/lib/realm2-missions";
import { citadelTheme } from "@/lib/realm-themes";

// The Central Citadel - Realm 2 Home Page
export default function Realm2Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading effect
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  // Handler to navigate to missions
  const handleStartMission = (missionId: number) => {
    setLocation(`/realm/2/mission/${missionId - 100}`);
  };

  // Get appropriate icon for mission type
  const getMissionIcon = (type: string) => {
    switch (type) {
      case 'surveillance':
        return '👁️';
      case 'privacy':
        return '🔒';
      case 'cbdc':
        return '🏛️';
      case 'bitcoin':
        return '₿';
      case 'lightning':
        return '⚡';
      case 'selfcustody':
        return '🔐';
      default:
        return '🏛️';
    }
  };

  // Get mission image for display
  const getMissionImage = (type: string) => {
    switch (type) {
      case 'surveillance':
        return 'https://pfst.cf2.poecdn.net/base/image/137c532c1abed120993d8553ac65c58b94e84c2af25209c4d6bb7900f271d356?w=530&h=260';
      case 'privacy':
        return 'https://pfst.cf2.poecdn.net/base/image/1074938abe59a0c71e2e5c44ff52edae347ba4b38a8c9e1efdf7ea73ae3c6da4?w=530&h=260';
      case 'cbdc':
        return 'https://pfst.cf2.poecdn.net/base/image/d2d82b9c4569d1c62fabb7ad35624de452c34185b8005971783452be61d27147?w=530&h=260';
      case 'bitcoin':
        return 'https://pfst.cf2.poecdn.net/base/image/52f1a844c3ef86ecd1408f83ba2517f59f33f2ee4265f741e73173a219a09250?w=530&h=260';
      case 'lightning':
        return 'https://pfst.cf2.poecdn.net/base/image/aa3a018485d39bb26c5c71d9795bb229400c83736522c742aaaeea390c5b5147?w=530&h=260';
      case 'selfcustody':
        return 'https://pfst.cf2.poecdn.net/base/image/aa3a018485d39bb26c5c71d9795bb229400c83736522c742aaaeea390c5b5147?w=530&h=260';
      default:
        return 'https://pfst.cf2.poecdn.net/base/image/d2d82b9c4569d1c62fabb7ad35624de452c34185b8005971783452be61d27147?w=530&h=260';
    }
  };

  // Container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  // Item animations
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-medium text-purple-500">Loading The Central Citadel...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 sm:px-6 lg:px-8" 
         style={{
           backgroundImage: "url(https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-2-The-Citadel-Shados.png)",
           backgroundSize: "cover",
           backgroundPosition: "center",
           backgroundAttachment: "fixed",
           backgroundBlendMode: "overlay"
         }}>
      
      <div className="max-w-5xl mx-auto">
        {/* Navigation Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setLocation('/map')}
              className="flex items-center px-4 py-2 rounded-lg hover:bg-purple-900/30 transition-colors border border-purple-900/50"
              style={{ color: citadelTheme.colors?.primary || '#a855f7' }}
            >
              <span className="mr-2">←</span>
              <span>Return to Map</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLocation('/profile')}
                className="p-2 rounded-full hover:bg-purple-900/30 transition-colors border border-purple-900/50"
                style={{ color: citadelTheme.colors?.primary || '#a855f7' }}
              >
                👤
              </button>
              <button
                onClick={() => setLocation('/badges')}
                className="p-2 rounded-full hover:bg-purple-900/30 transition-colors border border-purple-900/50"
                style={{ color: citadelTheme.colors?.primary || '#a855f7' }}
              >
                🏆
              </button>
              <button
                onClick={() => setLocation('/journey')}
                className="p-2 rounded-full hover:bg-purple-900/30 transition-colors border border-purple-900/50"
                style={{ color: citadelTheme.colors?.primary || '#a855f7' }}
              >
                🗺️
              </button>
            </div>
          </div>
        </div>
        
        <div className="backdrop-blur-md bg-black/60 rounded-xl p-6 mb-8 border border-purple-900/50">
          <h1 className="text-4xl font-bold text-purple-500 mb-2">The Central Citadel</h1>
          <p className="text-xl text-purple-200 mb-6">Realm 2: Where Privacy Meets Control</p>
          
          <p className="text-gray-300 mb-4">
            Welcome to The Central Citadel, a walled city-state where every transaction is monitored, every purchase is tracked, 
            and financial freedom is just an illusion.
          </p>
          
          <p className="text-gray-300 mb-4">
            In this realm, Asha will discover how centralized monetary control creates a surveillance system where privacy becomes a luxury, 
            and why Bitcoin offers an alternative approach to financial sovereignty.
          </p>
          
          <div className="flex space-x-4 mt-8">
            <button 
              onClick={() => setLocation('/map')}
              className="px-5 py-2 bg-transparent border border-purple-600 text-purple-400 rounded-md hover:bg-purple-900/30 transition-colors"
            >
              Return to Map
            </button>
            <button 
              onClick={() => handleStartMission(realm2Missions[0].id)}
              className="px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Begin Journey
            </button>
          </div>
        </div>
        
        {/* Mission cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {realm2Missions.map((mission, index) => (
            <motion.div 
              key={mission.id}
              variants={itemVariants}
              className="backdrop-blur-md bg-black/60 rounded-xl overflow-hidden border border-purple-900/50 hover:border-purple-500/70 transition-all cursor-pointer"
              onClick={() => handleStartMission(mission.id)}
              whileHover={{ 
                y: -5,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                borderColor: citadelTheme.colors?.primary || '#a855f7'
              }}
            >
              <div className="h-40 relative overflow-hidden">
                <img 
                  src={getMissionImage(mission.simulationType)} 
                  alt={mission.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="text-3xl">{getMissionIcon(mission.simulationType)}</span>
                </div>
              </div>
              
              <div className="p-5">
                <div className="mb-2 text-xs text-purple-300 font-medium">
                  Mission {index + 1} • {mission.simulationType.charAt(0).toUpperCase() + mission.simulationType.slice(1)}
                </div>
                <h3 className="text-xl font-medium text-purple-400 mb-2">{mission.title}</h3>
                <p className="text-sm text-purple-300 mb-2 italic">{mission.subtitle}</p>
                <p className="text-gray-400 text-sm">{mission.description}</p>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-xs font-medium uppercase text-purple-300">
                    Start Mission
                  </div>
                  
                  {mission.completed && (
                    <div className="bg-green-900/20 text-green-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Completed
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}