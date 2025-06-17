import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { ArrowLeft, ChevronLeft, ChevronRight, User, Award, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { realm4Missions } from '@/lib/realm4-missions';
import { MissionContent as Realm4MissionContent } from '@/lib/realm4-missions';
import { getRealmName } from '@/lib/realm-utils';
import { miningTheme } from '@/lib/realm-themes';

export default function MissionPage() {
  const [_, params] = useRoute('/realm4/mission/:id');
  const missionId = params?.id ? parseInt(params.id) : null;
  const [mission, setMission] = useState<Realm4MissionContent | null>(null);
  const [completed, setCompleted] = useState(false);
  
  const totalMissions = realm4Missions.length;
  
  useEffect(() => {
    if (missionId) {
      // Log mission lookup process
      console.log(`Realm 4: Looking for mission with ID ${missionId}`);
      console.log('Available mission IDs:', realm4Missions.map(m => m.id));
      
      const foundMission = realm4Missions.find(m => m.id === missionId);
      
      if (foundMission) {
        console.log('Found mission:', foundMission.title);
        setMission(foundMission as unknown as Realm4MissionContent);
      } else {
        console.error(`Mission with ID ${missionId} not found in Realm 4`);
        setMission(null);
      }
    }
  }, [missionId]);
  
  const handleMissionComplete = () => {
    setCompleted(true);
    // Here you would update user progress in a real application
  };
  
  if (!mission) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(to bottom, ${miningTheme.colors.background}, ${miningTheme.colors.backgroundLight})`,
        }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ color: miningTheme.colors.primary }}>Mission not found</h1>
          <Link href="/realm4">
            <Button className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to {getRealmName(4)}
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const renderMissionContent = () => {
    if (typeof mission.content === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: mission.content }} />;
    }
    return <div>{mission.content}</div>;
  };

  if (completed) {
    return (
      <div className="min-h-screen py-12 px-4"
        style={{
          background: `linear-gradient(to bottom, ${miningTheme.colors.background}, ${miningTheme.colors.backgroundLight})`,
        }}
      >
        <div className="max-w-2xl mx-auto bg-opacity-80 bg-black backdrop-blur rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-6 text-orange-400">
            Mission Complete!
          </h1>
          
          <p className="text-orange-100 mb-8">
            You've successfully completed the {mission.title} mission. These insights about Bitcoin mining will help you understand the economic and technical foundations of the network.
          </p>
          
          {missionId !== null && missionId < realm4Missions[realm4Missions.length - 1].id ? (
            <Link href={`/realm4/mission/${missionId + 1}`}>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white mr-4">
                Next Mission
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/realm5">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white mr-4">
                Continue to Next Realm
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
          
          <Link href="/realm4">
            <Button variant="outline" className="border-orange-600 text-orange-400 hover:bg-orange-600/20">
              Return to {getRealmName(4)}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen text-white"
      style={{
        background: `linear-gradient(to bottom, ${miningTheme.colors.background}, ${miningTheme.colors.backgroundLight})`,
        backgroundImage: "url('/realms/mining.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundBlendMode: "overlay"
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/realm4">
            <a className="inline-flex items-center hover:text-orange-300 transition-colors text-orange-400">
              <ChevronLeft className="mr-2 h-5 w-5" />
              <span>Back to The Mountain Forge</span>
            </a>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/profile">
              <a className="p-2 rounded-full bg-orange-600/20 hover:bg-orange-600/30 transition-colors">
                <User className="h-5 w-5 text-orange-400" />
              </a>
            </Link>
            <Link href="/badges">
              <a className="p-2 rounded-full bg-orange-600/20 hover:bg-orange-600/30 transition-colors">
                <Award className="h-5 w-5 text-orange-400" />
              </a>
            </Link>
            <Link href="/map">
              <a className="p-2 rounded-full bg-orange-600/20 hover:bg-orange-600/30 transition-colors">
                <Map className="h-5 w-5 text-orange-400" />
              </a>
            </Link>
          </div>
        </div>

        {/* Mission Navigation */}
        <div className="flex justify-between items-center mb-8">
          {missionId && missionId > 1 ? (
            <Link href={`/realm4/mission/${missionId - 1}`}>
              <a className="inline-flex items-center px-4 py-2 bg-orange-600/20 rounded-lg hover:bg-orange-600/30 transition-colors">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Mission
              </a>
            </Link>
          ) : (
            <div></div>
          )}
          
          <div className="text-orange-400 text-sm font-medium">
            Mission {missionId} of {totalMissions}
          </div>
          
          {missionId && missionId < totalMissions ? (
            <Link href={`/realm4/mission/${missionId + 1}`}>
              <a className="inline-flex items-center px-4 py-2 bg-orange-600/20 rounded-lg hover:bg-orange-600/30 transition-colors">
                Next Mission
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Link>
          ) : (
            <Link href="/realm5">
              <a className="inline-flex items-center px-4 py-2 bg-purple-600/20 rounded-lg hover:bg-purple-600/30 transition-colors">
                Next Realm
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Link>
          )}
        </div>

        {/* Mission Content - Full Width, No Card Wrapper */}
        <div className="w-full space-y-12">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-orange-400">{mission.title}</h1>
            {mission.subtitle && (
              <p className="text-2xl md:text-3xl text-orange-300 mb-12">{mission.subtitle}</p>
            )}
          </div>

          <div className="w-full space-y-12">
            <div className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 backdrop-blur-sm rounded-2xl p-8 border border-orange-700/30">
              <div className="prose prose-invert max-w-none text-orange-100">
                {renderMissionContent()}
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={handleMissionComplete}
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-4 text-xl rounded-xl shadow-lg"
                style={{ 
                  background: `linear-gradient(45deg, ${miningTheme.colors.primary}, ${miningTheme.colors.secondary})`,
                  boxShadow: '0 8px 32px rgba(238, 114, 11, 0.3)'
                }}
              >
                Complete Mission
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}