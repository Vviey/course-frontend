import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';
import MissionLayout from './mission-layout';
import { getRealmName } from '@/lib/realm-utils';

// Types
type MissionComponent = React.ComponentType<any>;
type MissionData = {
  title?: string;
  subtitle?: string;
  content?: React.ReactNode;
};

// Loading indicator
const Loading = () => (
  <div className="flex items-center justify-center min-h-[80vh]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2 text-foreground">Loading mission...</span>
  </div>
);

// Error message display
const ErrorMessage = ({ realmId, missionId }: { realmId: string; missionId: string }) => {
  const [, setLocation] = useLocation();
  
  const realmIdNumber = parseInt(realmId);
  const validRealmId = !isNaN(realmIdNumber) && realmIdNumber >= 1 && realmIdNumber <= 7;
  const realmName = validRealmId ? getRealmName(realmIdNumber) : "the Map";
  const returnPath = validRealmId ? `/realm/${realmId}` : "/map";
  
  const errorMessage = !realmId || isNaN(Number(realmId))
    ? "Invalid realm specified. Please return to the map and select a valid realm."
    : !missionId || isNaN(Number(missionId))
    ? "Invalid mission specified. Please return to the realm and select a valid mission."
    : `We couldn't find mission ${missionId} in ${realmName}. It may have been moved or doesn't exist.`;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <h1 className="text-2xl font-bold mb-4 text-destructive">Mission not found</h1>
      <p className="mb-6 text-center max-w-md text-muted-foreground">
        {errorMessage}
      </p>
      <button
        onClick={() => setLocation(returnPath)}
        className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-md text-primary-foreground transition-colors"
      >
        Return to {realmName}
      </button>
    </div>
  );
};

// Mission loader with static imports
const loadMissionComponent = async (realmId: string, missionId: string): Promise<MissionComponent | null> => {
  const realmNum = Number(realmId);
  const missionNum = Number(missionId);

  if (realmNum < 1 || realmNum > 7) return null;

  try {
    // Try to load the most specific path first
    const specificImport = await import(`@/pages/realm${realmNum}/mission${missionNum}.tsx`)
      .then(m => m.default)
      .catch(() => null);

    if (specificImport) return specificImport;

    // Fallback to alternative naming patterns
    const alternativePatterns = [
      `mission`,
      `missions`,
      `barter-web-challenge`,
      `mining-simulator`,
      `consensus-simulator`,
      // Add all other patterns here
    ];

    for (const pattern of alternativePatterns) {
      try {
        const module = await import(`@/pages/realm${realmNum}/${pattern}.tsx`);
        if (module?.default) return module.default;
      } catch {
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error('Error loading mission:', error);
    return null;
  }
};

export default function MissionWrapper() {
  const params = useParams<{ realmId: string; missionId: string }>();
  const { realmId, missionId } = params;
  const [state, setState] = useState<{
    loading: boolean;
    error: boolean;
    missionData: MissionData | null;
    MissionComponent: MissionComponent | null;
  }>({
    loading: true,
    error: false,
    missionData: null,
    MissionComponent: null,
  });

  useEffect(() => {
    let isMounted = true;

    const loadMission = async () => {
      if (!realmId || isNaN(Number(realmId)) || !missionId || isNaN(Number(missionId))) {
        setState(prev => ({ ...prev, loading: false, error: true }));
        return;
      }

      try {
        const missionComponent = await loadMissionComponent(realmId, missionId);
        
        if (!missionComponent) {
          throw new Error(`Mission ${missionId} in Realm ${realmId} not found`);
        }

        const realmNum = Number(realmId);
        const fullMissionId = realmNum >= 1 && realmNum <= 2 
          ? realmNum * 100 + Number(missionId)
          : Number(missionId);

        if (isMounted) {
          setState({
            loading: false,
            error: false,
            MissionComponent: missionComponent,
            missionData: {
              title: `Mission ${missionId}`,
              subtitle: `A learning journey in ${getRealmName(realmNum)}`,
            },
          });
        }
      } catch (error) {
        console.error('Failed to load mission:', error);
        if (isMounted) {
          setState(prev => ({ ...prev, loading: false, error: true }));
        }
      }
    };

    loadMission();

    return () => {
      isMounted = false;
    };
  }, [realmId, missionId]);

  const { loading, error, MissionComponent, missionData } = state;

  if (loading) return <Loading />;
  if (error || !MissionComponent) return <ErrorMessage realmId={realmId} missionId={missionId} />;

  // Special case for mission 1 in realm 1 (or any other custom layout missions)
  if ((missionId === '1' && realmId === '1') || 
      (MissionComponent as any).useCustomLayout) {
    return <MissionComponent />;
  }

  return (
    <MissionLayout
      realmId={realmId}
      title={missionData?.title || `Mission ${missionId}`}
      subtitle={missionData?.subtitle}
    >
      <MissionComponent />
    </MissionLayout>
  );
}