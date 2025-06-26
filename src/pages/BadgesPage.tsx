import React, { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { ThemeContainer, ThemeHeading, GradientButton, OutlineButton } from '@/components/ui/theme';
import { ShareButton } from '@/components/ui/share-button';
import { NavBar } from '@/components/ui/nav-bar';
import { INITIAL_REALMS } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import { Download } from 'lucide-react';

// Badge definitions mapped to actual mission/realm completion
interface Badge {
  id: number;
  name: string;
  description: string;
  realmId: number;
  imageUrl: string;
  dateEarned?: string; // Added dateEarned property
  requirement: {
    type: 'mission' | 'realm' | 'missions_count' | 'realms' | 'all_realms';
    missionId?: number;
    realmId?: number;
    count?: number;
    realmIds?: number[];
  };
}

// Certificate definitions mapped to realm completion
interface Certificate {
  dateEarned: string | number | Date;
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  requirement: {
    type: 'realm' | 'realms' | 'all_realms';
    realmId?: number;
    realmIds?: number[];
  };
}

// Define badges based on actual game progression
const badgeDefinitions: Badge[] = [
  {
    id: 1,
    name: "Money Historian",
    description: "Completed all missions in the Realm of Origins",
    dateEarned: "",
    realmId: 1,
    imageUrl: "https://bitcoiners.africa/wp-content/uploads/2025/06/Money-Historian.png",
    requirement: { type: 'realm', realmId: 1 }
  },
  {
    id: 2,
    name: "Crypto Defender",
    description: "Completed all missions in The Central Citadel",
    dateEarned: "",
    realmId: 2,
    imageUrl: "https://bitcoiners.africa/wp-content/uploads/2025/06/Crypto-Defender.png",
    requirement: { type: 'realm', realmId: 2 }
  },
  {
    id: 3,
    name: "Bitcoin Beginner",
    description: "Completed your first 3 missions across any realm",
    realmId: 1,
    dateEarned: "",
    imageUrl: "https://bitcoiners.africa/wp-content/uploads/2025/06/Bitcoin-Beginner.png",
    requirement: { type: 'missions_count', count: 3 }
  },
  {
    id: 4,
    name: "Wallet Wizard",
    description: "Completed Realm 3: Forest of Sparks",
    realmId: 3,
    dateEarned: "",
    imageUrl: "https://bitcoiners.africa/wp-content/uploads/2025/06/Wallet-Wizard.png",
    requirement: { type: 'realm', realmId: 3 }
  },
  {
    id: 5,
    name: "Transaction Expert",
    description: "Completed Realm 4: Council of Forks",
    realmId: 4,
    dateEarned: "",
    imageUrl: "https://bitcoiners.africa/wp-content/uploads/2025/06/Transaction-Expert.png",
    requirement: { type: 'realm', realmId: 4 }
  },
  {
    id: 6,
    name: "Network Guardian",
    description: "Completed Realm 5: Ubuntu Village",
    realmId: 5,
    dateEarned: "",
    imageUrl: "https://bitcoiners.africa/wp-content/uploads/2025/06/Network-Guardian.png",
    requirement: { type: 'realm', realmId: 5 }
  },
  {
    id: 7,
    name: "Sustainable Miner",
    description: "Completed Realm 6: Asha's Sanctuary",
    realmId: 6,
    dateEarned: "",
    imageUrl: "https://bitcoiners.africa/wp-content/uploads/2025/06/Sustainable-Miner.png",
    requirement: { type: 'realm', realmId: 6 }
  },
  {
    id: 8,
    name: "Lightning Master",
    description: "Completed Realm 7: The Nexus",
    realmId: 7,
    dateEarned: "",
    imageUrl: "https://bitcoiners.africa/wp-content/uploads/2025/06/Lightning-Master.png",
    requirement: { type: 'realm', realmId: 7 }
  },
  {
    id: 9,
    name: "Bitcoin Guardian",
    description: "Completed any 10 missions across all realms",
    realmId: 1,
    dateEarned: "",
    imageUrl: "https://bitcoiners.africa/wp-content/uploads/2025/06/Bitcoin-Guardian.png",
    requirement: { type: 'missions_count', count: 10 }
  },
  {
    id: 10,
    name: "Decentralization Defender",
    description: "Completed the first 3 realms",
    realmId: 1,
    dateEarned: "",
    imageUrl: "https://bitcoiners.africa/wp-content/uploads/2025/06/Decentralization-Defender.png",
    requirement: { type: 'realms', realmIds: [1, 2, 3] }
  },
  {
    id: 11,
    name: "Bitcoin Ambassador",
    description: "Completed all available realms",
    dateEarned: "",
    realmId: 1,
    imageUrl: "https://bitcoiners.africa/wp-content/uploads/2025/06/Bitcoin-Ambassador.png",
    requirement: { type: 'all_realms' }
  }
];

const certificateDefinitions: Certificate[] = [
  {
    id: 1,
    name: "Bitcoin Fundamentals Certificate",
    description: "Completed Realms 1 & 2: Origins and The Central Citadel",
    imageUrl: "https://bitcoiners.africa/wp-content/uploads/2025/06/Bitcoin-Fundamentals-Certificate.png",
    requirement: { type: 'realms', realmIds: [1, 2] },
    dateEarned: ''
  },
  {
    id: 2,
    name: "Bitcoin Security & Sovereignty Certificate",
    description: "Completed Realm 3: Forest of Sparks",
    imageUrl: "https://bitcoiners.africa/wp-content/uploads/2025/06/Bitcoin-Security-Certificate.png",
    requirement: { type: 'realm', realmId: 3 },
    dateEarned: ''
  },
  {
    id: 3,
    name: "Bitcoin Governance Certificate",
    description: "Completed Realm 4: Council of Forks",
    imageUrl: "https://bitcoiners.africa/wp-content/uploads/2025/06/Bitcoin-Governance-Certificate.png",
    requirement: { type: 'realm', realmId: 4 },
    dateEarned: ''
  },
  {
    id: 4,
    name: "Bitcoin in Africa Certificate",
    description: "Completed Realm 5: Ubuntu Village",
    imageUrl: "https://bitcoiners.africa/wp-content/uploads/2025/06/Bitcoin-Africa-Certificate.png",
    requirement: { type: 'realm', realmId: 5 },
    dateEarned: ''
  },
  {
    id: 5,
    name: "Bitcoin Quest Master Certificate",
    description: "Completed all realms in Asha's Journey",
    imageUrl: "https://bitcoiners.africa/wp-content/uploads/2025/06/Bitcoin-Quest-Master-Certificate.png",
    requirement: { type: 'all_realms' },
    dateEarned: ''
  }
];

export default function BadgesPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'badges' | 'certificates'>('badges');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  
  const { 
    completedMissions, 
    completedRealms, 
    username,
    userProfile 
  } = useAuth();
  
  // Function to check if a requirement is met
  const isRequirementMet = (requirement: Badge['requirement'] | Certificate['requirement']): boolean => {
    switch (requirement.type) {
      case 'mission':
        return requirement.missionId ? completedMissions.includes(requirement.missionId) : false;
      
      case 'realm':
        return requirement.realmId ? completedRealms.includes(requirement.realmId) : false;
      
      case 'realms':
        return requirement.realmIds ? 
          requirement.realmIds.every(realmId => completedRealms.includes(realmId)) : false;
      
      case 'missions_count':
        return requirement.count ? completedMissions.length >= requirement.count : false;
      
      case 'all_realms':
        // Assuming there are 7 realms total
        return completedRealms.length >= 7;
      
      default:
        return false;
    }
  };
  
  // Function to get badge date earned (mock implementation - you might want to track this in your auth context)
  const getBadgeEarnedDate = (badgeId: number): string => {
    // For now, return current date if earned. In a real app, you'd track when each badge was earned
    return new Date().toISOString().split('T')[0];
  };
  
  // Calculate badge and certificate data
  const userBadges = useMemo(() => {
    return badgeDefinitions.map(badge => ({
      ...badge,
      isEarned: isRequirementMet(badge.requirement),
      dateEarned: isRequirementMet(badge.requirement) ? getBadgeEarnedDate(badge.id) : ''
    }));
  }, [completedMissions, completedRealms]);
  
  const certificates = useMemo(() => {
    return certificateDefinitions.map(cert => ({
      ...cert,
      isEarned: isRequirementMet(cert.requirement),
      dateEarned: isRequirementMet(cert.requirement) ? getBadgeEarnedDate(cert.id) : ''
    }));
  }, [completedRealms]);
  
  // Get badge counts
  const earnedBadges = userBadges.filter(badge => badge.isEarned);
  const totalBadges = userBadges.length;
  const badgePercentage = Math.round((earnedBadges.length / totalBadges) * 100);
  
  const earnedCertificates = certificates.filter(cert => cert.isEarned);
  
  const handleViewCertificate = (certificate: Certificate & { isEarned: boolean; dateEarned: string }) => {
    if (certificate.isEarned) {
      setSelectedCertificate(certificate);
    }
  };
  
  const handleCloseCertificate = () => {
    setSelectedCertificate(null);
  };
  
  // Generate certificate PDF download
  const handleDownloadCertificate = (certificate: Certificate & { isEarned: boolean; dateEarned: string }) => {
    if (!certificate.isEarned) return;
    
    // Create a simple HTML certificate for PDF generation
    const certificateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${certificate.name}</title>
        <style>
          body {
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            color: white;
            margin: 0;
            padding: 40px;
            text-align: center;
          }
          .certificate {
            max-width: 800px;
            margin: 0 auto;
            border: 3px solid #ff6b35;
            padding: 60px 40px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
          }
          .title {
            font-size: 36px;
            color: #ff6b35;
            margin-bottom: 20px;
            font-weight: bold;
          }
          .subtitle {
            font-size: 24px;
            margin-bottom: 40px;
          }
          .recipient {
            font-size: 32px;
            color: #fff;
            margin: 30px 0;
            font-style: italic;
          }
          .description {
            font-size: 18px;
            margin: 30px 0;
            line-height: 1.6;
          }
          .date {
            font-size: 16px;
            color: #ff6b35;
            margin-top: 40px;
          }
          .signature {
            margin-top: 60px;
            font-size: 14px;
            color: #ccc;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="title">Certificate of Achievement</div>
          <div class="subtitle">${certificate.name}</div>
          <div>This certifies that</div>
          <div class="recipient">${username || userProfile?.username || 'Bitcoin Learner'}</div>
          <div>has successfully completed</div>
          <div class="description">${certificate.description}</div>
          <div class="date">Earned on ${new Date(certificate.dateEarned).toLocaleDateString()}</div>
          <div class="signature">
            <br><br>
            Asha's Journey - Bitcoin Quest<br>
            Bitcoiners Africa
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Create blob and download
    const blob = new Blob([certificateHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${certificate.name.replace(/\s+/g, '_')}_${username || 'Certificate'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  return (
    <ThemeContainer className="bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen">
      <NavBar />
      
      {/* Header with back button */}
      <header className="container mx-auto px-4 py-4">
        <button 
          onClick={() => setLocation('/')} 
          className="flex items-center text-secondary hover:text-primary"
        >
          <span className="mr-1">←</span> Back to Journey
        </button>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <ThemeHeading className="mb-2 text-center">Your Achievements</ThemeHeading>
        <p className="text-lightText/80 max-w-2xl mx-auto text-center mb-8">
          Track your progress through Asha's journey with these badges and certificates.
          Each represents knowledge and skills gained along the way.
        </p>
        
        {/* Progress Summary */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-darkBg/50 border border-secondary/20 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-darkBg/70 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{earnedBadges.length}</div>
                <div className="text-sm text-lightText/70">Badges Earned</div>
              </div>
              <div className="bg-darkBg/70 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{totalBadges - earnedBadges.length}</div>
                <div className="text-sm text-lightText/70">Badges to Earn</div>
              </div>
              <div className="bg-darkBg/70 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{earnedCertificates.length}</div>
                <div className="text-sm text-lightText/70">Certificates Earned</div>
              </div>
            </div>
            
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-lightText/70">Overall Progress</span>
              <span className="text-primary font-medium">{badgePercentage}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${badgePercentage}%` }}
              ></div>
            </div>
            
            {/* Progress details */}
            <div className="mt-4 text-sm text-lightText/60">
              <p>Missions completed: {completedMissions.length}</p>
              <p>Realms completed: {completedRealms.length}</p>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex border-b border-secondary/20">
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'badges' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-lightText/60 hover:text-lightText/90'
              }`}
            >
              Badges ({earnedBadges.length}/{totalBadges})
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'certificates' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-lightText/60 hover:text-lightText/90'
              }`}
            >
              Certificates ({earnedCertificates.length}/{certificates.length})
            </button>
          </div>
        </div>
        
        {/* Badge Grid */}
        {activeTab === 'badges' && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
              {userBadges.map(badge => {
                const realm = INITIAL_REALMS.find(r => r.id === badge.realmId);
                
                return (
                  <div 
                    key={badge.id}
                    className={`bg-darkBg/50 border rounded-lg p-4 text-center transition-all duration-300 ${
                      badge.isEarned 
                        ? 'border-primary/50 shadow-lg shadow-primary/20' 
                        : 'border-secondary/20 opacity-50 grayscale'
                    }`}
                  >
                    <div className="w-20 h-20 mx-auto mb-3 relative">
                      <img 
                        src={badge.imageUrl} 
                        alt={badge.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-badge.svg';
                        }}
                      />
                      {badge.isEarned && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                          ✓
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lightText mb-1 text-sm">{badge.name}</h3>
                    <p className="text-xs text-lightText/60 mb-2 line-clamp-2" title={badge.description}>
                      {badge.description}
                    </p>
                    <div className="text-xs text-primary">
                      {realm?.name}
                    </div>
                    {badge.isEarned && (
                      <>
                        <div className="mt-2 text-xs text-green-400">
                          Earned on {new Date(badge.dateEarned).toLocaleDateString()}
                        </div>
                        <div className="mt-3">
                          <ShareButton 
                            title={`I earned the ${badge.name} badge!`}
                            message={`I'm learning Bitcoin with Asha's Journey and just earned the ${badge.name} badge! 🎉 Join me on this Bitcoin education quest.`}
                            hashtags={['AshasJourney', 'BitcoinEducation', 'LearnBitcoin', 'BitcoinersAfrica']}
                            variant="icon-only"
                            size="sm"
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Certificates Grid */}
        {activeTab === 'certificates' && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {certificates.map(certificate => (
                <div 
                  key={certificate.id}
                  className={`bg-darkBg/50 border rounded-lg overflow-hidden transition-all duration-300 ${
                    certificate.isEarned 
                      ? 'border-primary/50 shadow-lg shadow-primary/20' 
                      : 'border-secondary/20 opacity-50 grayscale'
                  }`}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                    <img 
                      src={certificate.imageUrl} 
                      alt={certificate.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-certificate.svg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lightText text-lg mb-2">{certificate.name}</h3>
                    <p className="text-sm text-lightText/70 mb-3">
                      {certificate.description}
                    </p>
                    
                    {certificate.isEarned ? (
                      <>
                        <div className="text-xs text-green-400 mb-3">
                          Earned on {new Date(certificate.dateEarned).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <GradientButton 
                            onClick={() => handleViewCertificate(certificate)}
                            className="flex-1"
                          >
                            View Certificate
                          </GradientButton>
                        </div>
                      </>
                    ) : (
                      <OutlineButton 
                        className="w-full opacity-70 cursor-not-allowed"
                        disabled
                      >
                        Not Yet Earned
                      </OutlineButton>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Certificate Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-darkBg border border-secondary/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-lightText">{selectedCertificate.name}</h2>
                <button 
                  onClick={handleCloseCertificate}
                  className="text-lightText/50 hover:text-lightText p-1"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-6">
                <div className="border border-primary/30 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                  <img 
                    src={selectedCertificate.imageUrl} 
                    alt={selectedCertificate.name}
                    className="w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-certificate.svg';
                    }}
                  />
                </div>
              </div>
              
              <div className="mb-6 text-center">
                <p className="text-sm text-lightText/70 mb-2">
                  {selectedCertificate.description}
                </p>
                <p className="text-xs text-green-400">
                  Earned on {new Date(selectedCertificate.dateEarned).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex flex-wrap justify-between gap-3">
                <ShareButton 
                  title={`I earned the ${selectedCertificate.name}!`}
                  text={`I just completed Bitcoin training with Asha's Journey and earned the ${selectedCertificate.name}! 🎓 Join me on this Bitcoin education adventure.`}
                  hashtags={['AshasJourney', 'BitcoinCertificate', 'BitcoinEducation', 'BitcoinersAfrica']}
                />
                
                <div className="flex gap-3">
                  <OutlineButton onClick={handleCloseCertificate}>
                    Close
                  </OutlineButton>
                  <GradientButton 
                    onClick={() => handleDownloadCertificate(selectedCertificate as Certificate & { isEarned: boolean; dateEarned: string })}
                    className="flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download Certificate
                  </GradientButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ThemeContainer>
  );
}