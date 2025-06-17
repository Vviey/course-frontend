import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, User, Award, Map, Home } from 'lucide-react';
import { Link } from 'wouter';
import { getRealmTheme } from '@/lib/realm-themes';

interface RealmMissionLayoutProps {
  realmId: number;
  missionId: number;
  totalMissions: number;
  title: string;
  subtitle: string;
  children: ReactNode;
  onComplete?: () => void;
}

export function RealmMissionLayout({ 
  realmId, 
  missionId, 
  totalMissions, 
  title, 
  subtitle, 
  children 
}: RealmMissionLayoutProps) {
  const theme = getRealmTheme(realmId);
  const realmNames = {
    1: "Realm of Origins",
    2: "The Central Citadel", 
    3: "The Forest of Sparks",
    4: "The Mountain Forge",
    5: "The Council of Forks",
    6: "The Ubuntu Village",
    7: "The Summit of Knowledge"
  };

  const nextRealmId = realmId < 7 ? realmId + 1 : null;

  return (
    <div 
      className="min-h-screen text-white"
      style={{
        background: `linear-gradient(to bottom, ${theme.colors.background}, ${theme.colors.backgroundLight})`,
        backgroundImage: `url('/realms/realm${realmId}.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundBlendMode: "overlay"
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href={`/realm${realmId}`}>
            <a className="inline-flex items-center hover:opacity-80 transition-colors" 
              style={{ color: theme.colors.secondary }}
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              <span>Back to {realmNames[realmId as keyof typeof realmNames]}</span>
            </a>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/profile">
              <a className="p-2 rounded-full hover:opacity-80 transition-colors"
                style={{ backgroundColor: `${theme.colors.primary}20` }}>
                <User className="h-5 w-5" style={{ color: theme.colors.secondary }} />
              </a>
            </Link>
            <Link href="/badges">
              <a className="p-2 rounded-full hover:opacity-80 transition-colors"
                style={{ backgroundColor: `${theme.colors.primary}20` }}>
                <Award className="h-5 w-5" style={{ color: theme.colors.secondary }} />
              </a>
            </Link>
            <Link href="/map">
              <a className="p-2 rounded-full hover:opacity-80 transition-colors"
                style={{ backgroundColor: `${theme.colors.primary}20` }}>
                <Map className="h-5 w-5" style={{ color: theme.colors.secondary }} />
              </a>
            </Link>
          </div>
        </div>

        {/* Mission Navigation */}
        <div className="flex justify-between items-center mb-8">
          {missionId > 1 ? (
            <Link href={`/realm/${realmId}/mission/${missionId - 1}`}>
              <a className="inline-flex items-center px-4 py-2 rounded-lg hover:opacity-80 transition-colors"
                style={{ backgroundColor: `${theme.colors.primary}20` }}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                <span style={{ color: theme.colors.textLight }}>Previous Mission</span>
              </a>
            </Link>
          ) : (
            <div></div>
          )}
          
          <div className="text-sm font-medium" style={{ color: theme.colors.secondary }}>
            Mission {missionId} of {totalMissions}
          </div>
          
          {missionId < totalMissions ? (
            <Link href={`/realm/${realmId}/mission/${missionId + 1}`}>
              <a className="inline-flex items-center px-4 py-2 rounded-lg hover:opacity-80 transition-colors"
                style={{ backgroundColor: `${theme.colors.primary}20` }}>
                <span style={{ color: theme.colors.textLight }}>Next Mission</span>
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Link>
          ) : nextRealmId ? (
            <Link href={`/realm${nextRealmId}`}>
              <a className="inline-flex items-center px-4 py-2 rounded-lg hover:opacity-80 transition-colors"
                style={{ backgroundColor: `${theme.colors.accent1 || theme.colors.primary}30` }}>
                <span style={{ color: theme.colors.textLight }}>Next Realm</span>
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Link>
          ) : (
            <div className="text-center">
              <span className="font-semibold" style={{ color: theme.colors.accent1 || theme.colors.secondary }}>
                Final Mission
              </span>
            </div>
          )}
        </div>

        {/* Mission Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: theme.colors.primary }}>
            {title}
          </h1>
          <p className="text-xl md:text-2xl" style={{ color: theme.colors.secondary }}>
            {subtitle}
          </p>
        </div>

        {/* Mission Content */}
        <div className="space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}