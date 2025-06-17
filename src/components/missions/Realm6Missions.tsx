import { useState } from 'react';
import { ChevronLeft, ChevronRight, User, Award, Map } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { utilityTheme } from '@/lib/realm-themes';

interface MissionContent {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  content?: string | {
    introduction: string;
    sections: { title: string; content: string }[];
  };
  simulationType?: string;
}

interface Realm6MissionsProps {
  mission: MissionContent;
  onComplete?: () => void;
  missionId: number;
  realmId: number;
  totalMissions: number;
}

export function Realm6Missions({ mission, onComplete, missionId, realmId, totalMissions }: Realm6MissionsProps) {
  const [currentSection, setCurrentSection] = useState<string>('intro');

  const renderContent = () => {
    if (typeof mission.content === 'string') {
      return (
        <div className="prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: mission.content }} />
        </div>
      );
    }

    if (mission.content && typeof mission.content === 'object') {
      return (
        <div className="space-y-8">
          {mission.content.introduction && (
            <div className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: mission.content.introduction }} />
            </div>
          )}
          
          {mission.content.sections?.map((section: any, index: number) => (
            <div key={index} className="space-y-4">
              <h3 className="text-2xl font-bold text-red-400">{section.title}</h3>
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div 
      className="min-h-screen text-white"
      style={{
        background: `linear-gradient(to bottom, ${utilityTheme.colors.background}, ${utilityTheme.colors.backgroundLight})`,
        backgroundImage: "url('/realms/ubuntu.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundBlendMode: "overlay"
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/realm6">
            <a className="inline-flex items-center hover:text-red-300 transition-colors text-red-400">
              <ChevronLeft className="mr-2 h-5 w-5" />
              <span>Back to The Ubuntu Village</span>
            </a>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/profile">
              <a className="p-2 rounded-full bg-red-600/20 hover:bg-red-600/30 transition-colors">
                <User className="h-5 w-5 text-red-400" />
              </a>
            </Link>
            <Link href="/badges">
              <a className="p-2 rounded-full bg-red-600/20 hover:bg-red-600/30 transition-colors">
                <Award className="h-5 w-5 text-red-400" />
              </a>
            </Link>
            <Link href="/map">
              <a className="p-2 rounded-full bg-red-600/20 hover:bg-red-600/30 transition-colors">
                <Map className="h-5 w-5 text-red-400" />
              </a>
            </Link>
          </div>
        </div>

        {/* Mission Navigation */}
        <div className="flex justify-between items-center mb-8">
          {missionId > 1 ? (
            <Link href={`/realm/6/mission/${missionId - 1}`}>
              <a className="inline-flex items-center px-4 py-2 bg-red-600/20 rounded-lg hover:bg-red-600/30 transition-colors">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Mission
              </a>
            </Link>
          ) : (
            <div></div>
          )}
          
          <div className="text-red-400 text-sm font-medium">
            Mission {missionId} of {totalMissions}
          </div>
          
          {missionId < totalMissions ? (
            <Link href={`/realm/6/mission/${missionId + 1}`}>
              <a className="inline-flex items-center px-4 py-2 bg-red-600/20 rounded-lg hover:bg-red-600/30 transition-colors">
                Next Mission
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Link>
          ) : (
            <Link href="/realm7">
              <a className="inline-flex items-center px-4 py-2 bg-blue-600/20 rounded-lg hover:bg-blue-600/30 transition-colors">
                Next Realm
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Link>
          )}
        </div>

        {/* Mission Content - Full Width, No Card Wrapper */}
        <div className="w-full space-y-12">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-red-400">{mission.title}</h1>
            <p className="text-2xl md:text-3xl text-red-300 mb-12">{mission.subtitle}</p>
          </div>

          <div className="w-full space-y-12">
            <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 backdrop-blur-sm rounded-2xl p-8 border border-red-700/30">
              {renderContent()}
            </div>
            
            <div className="text-center">
              <Button 
                onClick={() => onComplete && onComplete()}
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 text-xl rounded-xl shadow-lg"
                style={{ 
                  background: `linear-gradient(45deg, ${utilityTheme.colors.primary}, ${utilityTheme.colors.secondary})`,
                  boxShadow: '0 8px 32px rgba(208, 51, 13, 0.3)'
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