import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { realm2Missions } from "@/lib/realm2-missions";

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
        return 'url(https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-2-The-Citadel-Shados.png)';
      case 'privacy':
        return 'url(https://bitcoiners.africa/wp-content/uploads/2025/06/Realm2-Privacy-vs-Control.png)';
      case 'cbdc':
        return 'url(https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-2-CBDCs-and-Privacy.png)';
      case 'bitcoin':
        return 'url(https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-2-Bitcoins-Transparency.png)';
      case 'lightning':
        return 'url(https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-2-Lightning-Network.png)';
      case 'selfcustody':
        return 'url(https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-2-Self-Custody.png)';
      default:
        return '🔍';
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
          //  background: "linear-gradient(to bottom, #000000, #1a001a)",
           backgroundImage: "url(https://bitcoiners.africa/wp-content/uploads/2025/06/Realm-2-The-Citadel-Shados.png)",
           backgroundSize: "cover",
          //  backgroundPosition: "center",
          //  backgroundAttachment: "fixed",
          //  backgroundBlendMode: "overlay"
         }}>
      
      <div className="max-w-5xl mx-auto">
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
              className="backdrop-blur-md bg-black/60 rounded-xl p-5 border border-purple-900/50 hover:border-purple-500/70 transition-all cursor-pointer"
              onClick={() => handleStartMission(mission.id)}
            >
              <div className="h-40 rounded-lg bg-gradient-to-br from-purple-700 to-purple-900 mb-4 flex items-center justify-center">
                <span className="text-5xl">{getMissionIcon(mission.simulationType)}</span>
              </div>
              <div className="mb-2 text-xs text-purple-300 font-medium">
                Mission {index + 1} • {mission.simulationType.charAt(0).toUpperCase() + mission.simulationType.slice(1)}
              </div>
              <h3 className="text-xl font-medium text-purple-400 mb-2">{mission.title}</h3>
              <p className="text-sm text-purple-300 mb-2 italic">{mission.subtitle}</p>
              <p className="text-gray-400">{mission.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}