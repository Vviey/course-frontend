import { useLocation, useParams } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { getTotalMissionsForRealm, getMissionTitle } from '@/lib/realm-utils';

export interface UseMissionNavigationProps {
  realmId: number;
  onMissionComplete?: () => void;
  redirectToRealmHome?: boolean;
}

export function useMissionNavigation({ 
  realmId, 
  onMissionComplete,
  redirectToRealmHome = true 
}: UseMissionNavigationProps) {
  const [, setLocation] = useLocation();
  const { missionId } = useParams<{ missionId: string }>();
  const { user, loading } = useAuth();

  // Parse mission ID from URL
  const currentMissionId = parseInt(missionId || '1');
  const totalMissions = getTotalMissionsForRealm(realmId);
  const missionTitle = getMissionTitle(realmId, currentMissionId);

  // Authentication redirect
  const checkAuth = () => {
    if (!loading && !user) {
      setLocation('/auth');
      return false;
    }
    return true;
  };

  // Mission completion handler
  const handleMissionComplete = () => {
    if (onMissionComplete) {
      onMissionComplete();
    }
    
    if (redirectToRealmHome) {
      setTimeout(() => {
        setLocation(`/realm/${realmId}`);
      }, 2000);
    }
  };

  // Navigation helpers
  const navigateToMission = (missionNumber: number) => {
    setLocation(`/realm/${realmId}/mission/${missionNumber}`);
  };

  const navigateToRealmHome = () => {
    setLocation(`/realm/${realmId}`);
  };

  const navigateToHome = () => {
    setLocation('/home');
  };

  return {
    currentMissionId,
    totalMissions,
    missionTitle,
    user,
    loading,
    checkAuth,
    handleMissionComplete,
    navigateToMission,
    navigateToRealmHome,
    navigateToHome,
    setLocation
  };
}