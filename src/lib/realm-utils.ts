/**
 * Realm Utility Functions
 * Helper functions for working with realm data in a purely frontend implementation
 */

import { realm1Missions } from './realm1-missions';
import { realm2Missions } from './realm2-missions';
import { realm3Missions } from './realm3-missions';
import { realm4Missions } from './realm4-missions';
import { realm5Missions } from './realm5-missions';
import { realm6Missions } from './realm6-missions';
import { realm7Missions } from './realm7-missions';

// Get standardized realm name based on ID
export function getRealmName(realmId: number): string {
  switch (realmId) {
    case 1: return "Realm of Origins";
    case 2: return "The Central Citadel"; 
    case 3: return "The Forest of Sparks";
    case 4: return "The Mountain Forge";
    case 5: return "The Council of Forks";
    case 6: return "The Ubuntu Village";
    case 7: return "The Summit of Knowledge";
    default: return "Unknown Realm";
  }
}

// Get total mission count for a realm
export function getTotalMissionsForRealm(realmId: number): number {
  switch (realmId) {
    case 1: return realm1Missions.length;
    case 2: return realm2Missions.length;
    case 3: return realm3Missions.length;
    case 4: return realm4Missions.length;
    case 5: return realm5Missions.length;
    case 6: return realm6Missions.length;
    case 7: return realm7Missions.length;
    default: return 0;
  }
}

// Get mission title for a specific realm and mission ID
export function getMissionTitle(realmId: number, missionId: number): string {
  switch (realmId) {
    case 1:
      const mission1 = realm1Missions.find(m => m.id === 100 + missionId);
      return mission1?.title || `Mission ${missionId}`;
    case 2:
      const mission2 = realm2Missions.find(m => m.id === missionId);
      return mission2?.title || `Mission ${missionId}`;
    case 3:
      const mission3 = realm3Missions.find(m => m.id === missionId);
      return mission3?.title || `Mission ${missionId}`;
    case 4:
      const mission4 = realm4Missions.find(m => m.id === missionId);
      return mission4?.title || `Mission ${missionId}`;
    case 5:
      const mission5 = realm5Missions.find(m => m.id === missionId);
      return mission5?.title || `Mission ${missionId}`;
    case 6:
      const mission6 = realm6Missions.find(m => m.id === missionId);
      return mission6?.title || `Mission ${missionId}`;
    case 7:
      const mission7 = realm7Missions.find(m => m.id === missionId);
      return mission7?.title || `Mission ${missionId}`;
    default:
      return `Mission ${missionId}`;
  }
}

// Check if next realm exists and has missions
export function getNextRealmInfo(realmId: number, missionId: number): { hasNextRealm: boolean; nextRealmId?: number; nextMissionId?: number } {
  const totalMissions = getTotalMissionsForRealm(realmId);
  
  // If we're at the last mission of the current realm
  if (missionId >= totalMissions) {
    const nextRealmId = realmId + 1;
    const nextRealmMissions = getTotalMissionsForRealm(nextRealmId);
    
    if (nextRealmMissions > 0) {
      return {
        hasNextRealm: true,
        nextRealmId,
        nextMissionId: 1
      };
    }
  }
  
  return { hasNextRealm: false };
}

// Get standardized realm description/focus
export function getRealmDescription(realmId: number): string {
  switch (realmId) {
    case 1: return "Foundations of Money";
    case 2: return "Governance & Central Banking";
    case 3: return "Bitcoin's Birth";
    case 4: return "Mining & Consensus";
    case 5: return "Bitcoin Governance";
    case 6: return "Bitcoin in Africa";
    case 7: return "Comprehensive Assessment";
    default: return "Unknown Focus";
  }
}

// Get the missions for a specific realm
export function getMissionsForRealm(realmId: number): MissionType[] {
  // We'll provide static mission data for each realm
  const missionsMap: Record<number, MissionType[]> = {
    1: [
      {
        id: 1,
        realmId: 1,
        name: "The Grand Market",
        description: "Explore the origins of money through an interactive market simulation.",
        type: "interactive",
        order: 1, 
        isLocked: false,
        isCompleted: false
      },
      {
        id: 2,
        realmId: 1,
        name: "Early Forms of Money",
        description: "Learn about shells, beads, and other early forms of currency.",
        type: "text",
        order: 2,
        isLocked: false,
        isCompleted: false
      },
      {
        id: 3,
        realmId: 1,
        name: "Money Properties",
        description: "Discover what makes good money through interactive challenges.",
        type: "quiz",
        order: 3,
        isLocked: true,
        isCompleted: false
      }
    ],
    2: [
      {
        id: 1,
        realmId: 2,
        name: "Central Banking",
        description: "Understand how central banks control money supply and inflation.",
        type: "text",
        order: 1,
        isLocked: false,
        isCompleted: false
      },
      {
        id: 2,
        realmId: 2,
        name: "Monetary Policy",
        description: "Study the tools central banks use to manage economies.",
        type: "interactive",
        order: 2,
        isLocked: true,
        isCompleted: false
      }
    ],
    3: [
      {
        id: 1,
        realmId: 3,
        name: "Cryptography Basics",
        description: "Learn about public-key cryptography that powers Bitcoin.",
        type: "text",
        order: 1,
        isLocked: false,
        isCompleted: false
      },
      {
        id: 2,
        realmId: 3,
        name: "Bitcoin Genesis",
        description: "Explore Satoshi Nakamoto's original vision for Bitcoin.",
        type: "interactive",
        order: 2,
        isLocked: true,
        isCompleted: false
      }
    ],
    4: [
      {
        id: 1,
        realmId: 4,
        name: "Mining Basics",
        description: "Understand the core principles of Bitcoin mining.",
        type: "text",
        order: 1,
        isLocked: false,
        isCompleted: false
      },
      {
        id: 2,
        realmId: 4,
        name: "Proof of Work",
        description: "Experience how mining secures the Bitcoin network.",
        type: "interactive",
        order: 2,
        isLocked: true,
        isCompleted: false
      }
    ],
    5: [
      {
        id: 1,
        realmId: 5,
        name: "Bitcoin Governance",
        description: "Learn how Bitcoin evolves through community consensus.",
        type: "text",
        order: 1,
        isLocked: false,
        isCompleted: false
      },
      {
        id: 2,
        realmId: 5,
        name: "The Fork Paths",
        description: "Explore the history of Bitcoin forks and their significance.",
        type: "interactive",
        order: 2,
        isLocked: true,
        isCompleted: false
      }
    ],
    6: [
      {
        id: 1,
        realmId: 6,
        name: "African Bitcoin Stories",
        description: "Discover how Bitcoin is changing lives across Africa.",
        type: "text",
        order: 1,
        isLocked: false,
        isCompleted: false
      },
      {
        id: 2,
        realmId: 6,
        name: "Community Solutions",
        description: "See real-world Bitcoin applications in African communities.",
        type: "interactive",
        order: 2,
        isLocked: true,
        isCompleted: false
      }
    ],
    7: [
      {
        id: 1,
        realmId: 7,
        name: "Knowledge Assessment",
        description: "Test your Bitcoin knowledge across all realms.",
        type: "quiz",
        order: 1,
        isLocked: false,
        isCompleted: false
      },
      {
        id: 2,
        realmId: 7,
        name: "Final Challenge",
        description: "Put your skills to the test in a comprehensive challenge.",
        type: "interactive",
        order: 2,
        isLocked: true,
        isCompleted: false
      }
    ]
  };
  
  return missionsMap[realmId] || [];
}

// Mission type definition
export interface MissionType {
  id: number;
  realmId: number;
  name: string;
  description: string;
  type: string;
  order: number;
  isLocked: boolean;
  isCompleted: boolean;
}

// Get the badges for a specific realm
export function getBadgesForRealm(realmId: number): BadgeType[] {
  // We'll provide static badge data for each realm
  const badgesMap: Record<number, BadgeType[]> = {
    1: [
      {
        id: 1,
        realmId: 1,
        name: "Market Master",
        description: "Completed the Grand Market simulation",
        imageUrl: "/badges/market-master.svg"
      },
      {
        id: 2,
        realmId: 1,
        name: "Money Historian",
        description: "Mastered the history of money origins",
        imageUrl: "/badges/money-historian.svg"
      }
    ],
    2: [
      {
        id: 3,
        realmId: 2,
        name: "Central Banker",
        description: "Successfully managed a central bank simulation",
        imageUrl: "/badges/central-banker.svg"
      }
    ],
    3: [
      {
        id: 4,
        realmId: 3,
        name: "Cryptography Pioneer",
        description: "Mastered the basics of cryptography",
        imageUrl: "/badges/crypto-pioneer.svg"
      }
    ],
    4: [
      {
        id: 5,
        realmId: 4,
        name: "Master Miner",
        description: "Successfully mined a Bitcoin block in simulation",
        imageUrl: "/badges/master-miner.svg"
      }
    ],
    5: [
      {
        id: 6,
        realmId: 5,
        name: "Governance Guru",
        description: "Understood Bitcoin's consensus mechanisms",
        imageUrl: "/badges/governance-guru.svg"
      }
    ],
    6: [
      {
        id: 7,
        realmId: 6,
        name: "Community Builder",
        description: "Applied Bitcoin solutions to community problems",
        imageUrl: "/badges/community-builder.svg"
      }
    ],
    7: [
      {
        id: 8,
        realmId: 7,
        name: "Bitcoin Sage",
        description: "Completed all challenges in the final assessment",
        imageUrl: "/badges/bitcoin-sage.svg"
      }
    ]
  };
  
  return badgesMap[realmId] || [];
}

// Badge type definition
export interface BadgeType {
  id: number;
  realmId: number;
  name: string;
  description: string;
  imageUrl: string;
}