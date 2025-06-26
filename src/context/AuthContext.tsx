import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { MissionType, BadgeType } from '@/lib/realm-utils';
import { Highlight } from '@/components/ui/highlight-text';

// This is a purely frontend implementation of authentication context using localStorage
// It does not connect to any backend or use mock data

// Highlighted/bookmarked item interface (legacy format)
interface HighlightedItem {
  id: string;
  text: string;
  missionId: number;
  realmId: number;
  timestamp: number;
  color?: string;
  notes?: string;
}

// User profile interface
interface UserProfile {
  userId: string;
  username: string;
  avatarColor?: string;
  joinDate: number;
  bio?: string;
  highlights?: Highlight[]; // New field for storing text highlights
}

// User progress interface to track progress through the journey
interface UserProgress {
  username: string;
  userId: string;
  profile: UserProfile;
  completedMissions: number[];
  unlockedRealms: number[];
  earnedBadges: number[];
  currentRealm?: number;
  backpack: HighlightedItem[];
  completedRealms?: number[]; // Track which realms are fully completed
}

interface AuthContextType {
  // Authentication state
  isAuthenticated: boolean;
  username: string | null;
  loading: boolean;
  isLoading: boolean; // Alias for loading for backward compatibility
  
  // Testing mode
  testingMode: boolean;
  setTestingMode: (enabled: boolean) => void;
  
  // User object for compatibility with existing components
  user: {
    username: string | null;
    userId?: string;
    profile?: UserProfile | null;
    progress?: {
      completedRealms?: number[];
      completedMissions?: number[];
      unlockedRealms?: number[];
      currentRealm?: number;
    }
  } | null;
  
  // Auth methods
  login: (username: string, password: string) => void;
  register: (username: string, password: string, email?: string) => void;
  logout: () => void;
  
  // Progress tracking
  currentRealm: number;
  setCurrentRealm: (realm: number) => void;
  
  // Mission and badge progress
  completedMissions: number[];
  unlockedRealms: number[];
  earnedBadges: number[];
  completedRealms: number[];
  
  // Progress update methods
  completeMission: (missionId: number) => void;
  unlockRealm: (realmId: number) => void;
  earnBadge: (badgeId: number) => void;
  completeRealm: (realmId: number) => void;
  
  // Helper methods
  isRealmUnlocked: (realmId: number) => boolean;
  isRealmCompleted: (realmId: number) => boolean;
  
  // User profile methods
  userProfile: UserProfile | null;
  updateProfile: (profile: Partial<UserProfile>) => void;
  
  // New method for updating user profile with highlights
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  
  // Backpack/highlighting methods (legacy)
  backpack: HighlightedItem[];
  addToBackpack: (text: string, missionId: number, realmId: number, color?: string) => void;
  removeFromBackpack: (id: string) => void;
  updateBackpackItem: (id: string, updates: Partial<HighlightedItem>) => void;
  
  // New highlighting methods
  addHighlight: (highlight: Highlight) => void;
  removeHighlight: (id: string) => void;
  updateHighlight: (id: string, updates: Partial<Highlight>) => void;
  getHighlights: () => Highlight[];
}

// Create default context value
const initialAuthContext: AuthContextType = {
  isAuthenticated: false,
  username: null,
  loading: true,
  isLoading: true,
  testingMode: false,
  setTestingMode: () => {},
  user: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  currentRealm: 1,
  setCurrentRealm: () => {},
  completedMissions: [],
  unlockedRealms: [1],
  earnedBadges: [],
  completedRealms: [],
  completeMission: () => {},
  unlockRealm: () => {},
  earnBadge: () => {},
  completeRealm: () => {},
  isRealmUnlocked: () => false,
  isRealmCompleted: () => false,
  userProfile: null,
  updateProfile: () => {},
  updateUserProfile: () => {},
  backpack: [],
  addToBackpack: () => {},
  removeFromBackpack: () => {},
  updateBackpackItem: () => {},
  addHighlight: () => {},
  removeHighlight: () => {},
  updateHighlight: () => {},
  getHighlights: () => []
};

const AuthContext = createContext<AuthContextType>(initialAuthContext);

// Local storage key
const USER_STORAGE_KEY = 'ashaJourneyUserData';

// Default starting state
const initialProgress: UserProgress = {
  username: '',
  userId: 'default-user-id',
  profile: {
    userId: 'default-user-id',
    username: '',
    joinDate: Date.now(),
    avatarColor: '#ffcc00'
  },
  completedMissions: [],
  unlockedRealms: [1], // Only realm 1 unlocked initially
  earnedBadges: [],
  currentRealm: 1,
  backpack: [],
  completedRealms: []
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Auth state - initialize as not authenticated
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [currentRealm, setCurrentRealm] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true); // Start with loading true
  const [testingMode, setTestingMode] = useState<boolean>(false);
  
  // Progress state
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [unlockedRealms, setUnlockedRealms] = useState<number[]>([1]);
  const [earnedBadges, setEarnedBadges] = useState<number[]>([]);
  const [completedRealms, setCompletedRealms] = useState<number[]>([]);
  
  // User profile and backpack state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [backpack, setBackpack] = useState<HighlightedItem[]>([]);
  
  // Helper function to check if a realm is unlocked
  const isRealmUnlocked = (realmId: number): boolean => {
    if (testingMode) return true; // All realms unlocked in testing mode
    return unlockedRealms.includes(realmId);
  };
  
  // Helper function to check if a realm is completed
  const isRealmCompleted = (realmId: number): boolean => {
    return completedRealms.includes(realmId);
  };
  
  // Function to automatically unlock next realm when current is completed
  const checkRealmProgression = (newCompletedRealms: number[]) => {
    const shouldUnlockRealms: number[] = [];
    
    // Logic: Realm N+1 unlocks when Realm N is completed
    for (let i = 1; i <= 6; i++) { // Assuming you have 7 realms (1-7)
      if (newCompletedRealms.includes(i) && !unlockedRealms.includes(i + 1)) {
        shouldUnlockRealms.push(i + 1);
      }
    }
    
    if (shouldUnlockRealms.length > 0) {
      setUnlockedRealms(prev => [...prev, ...shouldUnlockRealms]);
    }
  };
  
  // Check for existing user data in localStorage
  useEffect(() => {
    // Check if auth bypass is enabled
    const bypassAuth = typeof window !== 'undefined' && (window as any).__BYPASS_AUTH__ === true;
    
    try {
      if (bypassAuth) {
        // If bypassing auth, create a default user
        console.log("Auth bypass enabled - using default user");
        const defaultUser: UserProgress = {
          username: "Developer",
          userId: `user_${Date.now()}`,
          profile: {
            userId: `user_${Date.now()}`,
            username: "Developer",
            joinDate: Date.now(),
            avatarColor: '#ffcc00',
            bio: 'Bitcoin learning enthusiast exploring the realms of digital currency.'
          },
          completedMissions: [],
          unlockedRealms: [1], // Only realm 1 unlocked initially
          earnedBadges: [],
          currentRealm: 1,
          backpack: [],
          completedRealms: []
        };
        
        // Set state with default user
        setIsAuthenticated(true);
        setUsername(defaultUser.username);
        setCompletedMissions(defaultUser.completedMissions);
        setUnlockedRealms(defaultUser.unlockedRealms);
        setEarnedBadges(defaultUser.earnedBadges);
        setCompletedRealms(defaultUser.completedRealms || []);
        setCurrentRealm(defaultUser.currentRealm ?? 1);
        setUserProfile(defaultUser.profile);
        setBackpack(defaultUser.backpack);
        
        // Save to localStorage for persistence
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(defaultUser));
      } else {
        // Normal authentication flow - check localStorage
        const savedUserData = localStorage.getItem(USER_STORAGE_KEY);
        if (savedUserData) {
          const userData: UserProgress = JSON.parse(savedUserData);
          if (userData.username) {
            // Restore user data
            setIsAuthenticated(true);
            setUsername(userData.username);
            setCompletedMissions(userData.completedMissions || []);
            setUnlockedRealms(userData.unlockedRealms || [1]);
            setEarnedBadges(userData.earnedBadges || []);
            setCompletedRealms(userData.completedRealms || []);
            
            if (userData.currentRealm) {
              setCurrentRealm(userData.currentRealm ?? 1);
            }
            
            if (userData.profile) {
              setUserProfile(userData.profile);
            }
            
            if (userData.backpack) {
              setBackpack(userData.backpack);
            }
          }
        }
      }
      
      // Set loading to false after checking
      setLoading(false);
    } catch (error) {
      console.error('Failed to load user data:', error);
      setLoading(false);
    }
  }, []);
  
  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && username) {
      try {
        // Create a new user ID if it doesn't exist
        const userId = userProfile?.userId || `user_${Date.now()}`;
        
        // Create profile if it doesn't exist
        const profile = userProfile || {
          userId,
          username: username,
          joinDate: Date.now(),
          avatarColor: '#ffcc00'
        };
        
        const userData: UserProgress = {
          username: username,
          userId,
          profile,
          completedMissions,
          unlockedRealms,
          earnedBadges,
          currentRealm,
          backpack,
          completedRealms
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      } catch (error) {
        console.error('Failed to save user data to localStorage:', error);
      }
    }
  }, [isAuthenticated, username, userProfile, completedMissions, unlockedRealms, earnedBadges, currentRealm, backpack, completedRealms]);
  
  // Login function - saves user data to localStorage
  const login = (username: string, password: string) => {
    console.log(`Login functionality for ${username}`);
    
    // Check if user exists in localStorage
    try {
      const savedUserData = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUserData) {
        const userData: UserProgress = JSON.parse(savedUserData);
        if (userData.username === username) {
          // Real app would verify password here
          setIsAuthenticated(true);
          setUsername(username);
          setCompletedMissions(userData.completedMissions);
          setUnlockedRealms(userData.unlockedRealms);
          setEarnedBadges(userData.earnedBadges);
          setCompletedRealms(userData.completedRealms || []);
          if (userData.currentRealm) {
            setCurrentRealm(userData.currentRealm);
          }
          
          // Load user profile and backpack
          if (userData.profile) {
            setUserProfile(userData.profile);
          }
          if (userData.backpack) {
            setBackpack(userData.backpack);
          }
          return;
        }
      }
    } catch (error) {
      console.error('Error checking existing user:', error);
    }
    
    // If no existing user, create a new one
    const userId = `user_${Date.now()}`;
    const newUserProfile: UserProfile = {
      userId,
      username,
      joinDate: Date.now(),
      avatarColor: '#ffcc00' // Default avatar color
    };
    
    setIsAuthenticated(true);
    setUsername(username);
    setUserProfile(newUserProfile);
    setBackpack([]);
    
    // For a new user, initialize with default progress
    setCompletedMissions([]);
    setUnlockedRealms([1]); // Only realm 1 unlocked
    setEarnedBadges([]);
    setCompletedRealms([]);
  };
  
  // Register function - creates a new user in localStorage
  const register = (username: string, password: string, email?: string) => {
    console.log(`Registration functionality for ${username}`);
    
    // Create a new user ID
    const userId = `user_${Date.now()}`;
    
    // Create a new user profile
    const newUserProfile: UserProfile = {
      userId,
      username,
      joinDate: Date.now(),
      avatarColor: '#ffcc00', // Default avatar color
      bio: email ? `Contact: ${email}` : undefined
    };
    
    setIsAuthenticated(true);
    setUsername(username);
    setUserProfile(newUserProfile);
    setBackpack([]);
    
    // Initialize new user with default progress
    setCompletedMissions([]);
    setUnlockedRealms([1]); // Only realm 1 unlocked
    setEarnedBadges([]);
    setCompletedRealms([]);
  };
  
  // Logout function - clears current session
  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    // Don't clear localStorage - just end the session
  };
  
  // Update mission progress
  const completeMission = (missionId: number) => {
    if (!completedMissions.includes(missionId)) {
      setCompletedMissions(prev => [...prev, missionId]);
    }
  };
  
  // Complete a realm (this should be called when all missions in a realm are done)
  const completeRealm = (realmId: number) => {
    if (!completedRealms.includes(realmId)) {
      const newCompletedRealms = [...completedRealms, realmId];
      setCompletedRealms(newCompletedRealms);
      
      // Check if we should unlock the next realm
      checkRealmProgression(newCompletedRealms);
    }
  };
  
  // Unlock a new realm (manual unlock - you might still need this for special cases)
  const unlockRealm = (realmId: number) => {
    if (!unlockedRealms.includes(realmId)) {
      setUnlockedRealms(prev => [...prev, realmId]);
    }
  };
  
  // Award a badge
  const earnBadge = (badgeId: number) => {
    if (!earnedBadges.includes(badgeId)) {
      setEarnedBadges(prev => [...prev, badgeId]);
    }
  };
  
  // Update user profile
  const updateProfile = (profile: Partial<UserProfile>) => {
    if (!userProfile) return;
    
    setUserProfile(prev => ({
      ...prev!,
      ...profile,
      // Ensure userId doesn't change
      userId: prev!.userId
    }));
  };
  
  // Update user profile with highlights support
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (!userProfile) return;
    
    setUserProfile(prev => ({
      ...prev!,
      ...profile,
      // Ensure userId and other critical fields don't change
      userId: prev!.userId,
      username: prev!.username,
      joinDate: prev!.joinDate
    }));
  };
  
  // New highlighting methods
  const addHighlight = (highlight: Highlight) => {
    if (!userProfile) return;
    
    const currentHighlights = userProfile.highlights || [];
    updateUserProfile({
      highlights: [...currentHighlights, highlight]
    });
  };
  
  const removeHighlight = (id: string) => {
    if (!userProfile || !userProfile.highlights) return;
    
    updateUserProfile({
      highlights: userProfile.highlights.filter(h => h.id !== id)
    });
  };
  
  const updateHighlight = (id: string, updates: Partial<Highlight>) => {
    if (!userProfile || !userProfile.highlights) return;
    
    updateUserProfile({
      highlights: userProfile.highlights.map(h => 
        h.id === id ? { ...h, ...updates } : h
      )
    });
  };
  
  const getHighlights = (): Highlight[] => {
    return userProfile?.highlights || [];
  };
  
  // Legacy backpack methods
  
  // Add a highlighted item to the backpack
  const addToBackpack = (text: string, missionId: number, realmId: number, color?: string) => {
    const newItem: HighlightedItem = {
      id: `highlight_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
      text,
      missionId,
      realmId,
      timestamp: Date.now(),
      color: color || '#ffcc00'
    };
    
    setBackpack(prev => [...prev, newItem]);
  };
  
  // Remove an item from the backpack
  const removeFromBackpack = (id: string) => {
    setBackpack(prev => prev.filter(item => item.id !== id));
  };
  
  // Update a backpack item (e.g., add notes)
  const updateBackpackItem = (id: string, updates: Partial<HighlightedItem>) => {
    setBackpack(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  // Create a user object that matches what components are expecting
  const user = isAuthenticated ? {
    username,
    userId: userProfile?.userId,
    profile: userProfile,
    progress: {
      completedRealms,
      completedMissions,
      unlockedRealms: testingMode ? [1, 2, 3, 4, 5, 6, 7] : unlockedRealms, // All unlocked in testing mode
      currentRealm
    }
  } : null;

  const value = {
    isAuthenticated,
    username,
    loading,
    isLoading: loading,
    testingMode,
    setTestingMode,
    user,
    login,
    register,
    logout,
    currentRealm,
    setCurrentRealm,
    completedMissions,
    unlockedRealms: testingMode ? [1, 2, 3, 4, 5, 6, 7] : unlockedRealms, // All unlocked in testing mode
    earnedBadges,
    completedRealms,
    completeMission,
    unlockRealm,
    earnBadge,
    completeRealm,
    isRealmUnlocked,
    isRealmCompleted,
    userProfile,
    updateProfile,
    updateUserProfile,
    backpack,
    addToBackpack,
    removeFromBackpack,
    updateBackpackItem,
    addHighlight,
    removeHighlight,
    updateHighlight,
    getHighlights
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  // Since we've provided a default value for our context, it should never be null
  const context = useContext(AuthContext);
  return context;
}