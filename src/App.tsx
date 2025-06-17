import { Switch, Route, useLocation } from "wouter";
import { Suspense, lazy, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/context/AuthContext"; 
import TrustlessSimulator from "@/pages/realm3/trustless-simulator";

// Lazy load pages
const HomePage = lazy(() => import("@/pages/HomePage"));
const MapPage = lazy(() => import("@/pages/MapPage"));
const NotFound = lazy(() => import("@/pages/not-found"));
const StoryIntroPage = lazy(() => import("@/pages/StoryIntroPage"));
const HomeIntroPage = lazy(() => import("@/pages/home-intro"));
const RealmPage = lazy(() => import("@/pages/RealmPage"));
const AuthPage = lazy(() => import("@/pages/auth-page"));
const ForgotPasswordPage = lazy(() => import("@/pages/forgot-password"));
const AfricaMapPage = lazy(() => import("@/pages/AfricaMapPage"));
const BadgesPage = lazy(() => import("@/pages/BadgesPage"));
const JourneyPage = lazy(() => import("@/pages/JourneyPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));

// Lazy load Mission wrapper component
const MissionWrapper = lazy(() => import("@/components/mission-wrapper"));

// Lazy load Realm components
const Realm1Story = lazy(() => import("@/pages/realm1/story-intro"));
const Realm1Home = lazy(() => import("@/pages/realm1/home"));
const Realm2Story = lazy(() => import("@/pages/realm2/story-intro"));
const Realm2Home = lazy(() => import("@/pages/realm2/home"));
const Realm3Story = lazy(() => import("@/pages/realm3/story-intro"));
const Realm3Home = lazy(() => import("@/pages/realm3/home"));
const Realm4Story = lazy(() => import("@/pages/realm4/story-intro"));
const Realm4Home = lazy(() => import("@/pages/realm4/home"));
const Realm5Story = lazy(() => import("@/pages/realm5/story-intro"));
const Realm5Home = lazy(() => import("@/pages/realm5/home"));
const Realm6Story = lazy(() => import("@/pages/realm6/story-intro"));
const Realm6Home = lazy(() => import("@/pages/realm6/home"));
const Realm7Story = lazy(() => import("@/pages/realm7/story-intro"));
const Realm7Home = lazy(() => import("@/pages/realm7/home"));

// Lazy load simulator components
const BarterWebChallenge = lazy(() => import("@/pages/realm1/barter-web-challenge"));
const CurrencyValueSimulator = lazy(() => import("@/pages/realm1/currency-value-simulator"));
const AfricanCurrencyEducation = lazy(() => import("@/pages/realm1/african-currency-education"));
const GameComponent = lazy(() => import("@/pages/realm1/game"));
const InflationSimulator = lazy(() => import("@/pages/realm1/inflation-simulator"));

const BitcoinTransparencyExplorer = lazy(() => import("@/pages/realm2/bitcoin-transparency-explorer"));
const CBDCSimulator = lazy(() => import("@/pages/realm2/cbdc-simulator"));
const LightningNetworkSimulator = lazy(() => import("@/pages/realm2/lightning-network-simulator"));
const PrivacyBalanceSimulator = lazy(() => import("@/pages/realm2/privacy-balance-simulator"));
const SelfCustodySimulator = lazy(() => import("@/pages/realm2/self-custody-simulator"));
const SurveillanceSimulator = lazy(() => import("@/pages/realm2/surveillance-simulator"));

const ConsensusSimulator3 = lazy(() => import("@/pages/realm3/consensus-simulator"));
const CryptographySimulator = lazy(() => import("@/pages/realm3/cryptography-simulator"));
const HashingSimulator = lazy(() => import("@/pages/realm3/hashing-simulator"));
const MerkleTreeSimulator = lazy(() => import("@/pages/realm3/merkle-tree-simulator"));
const LightningBitcoinSimulator = lazy(() => import("@/pages/realm3/lightning-bitcoin-simulator"));
const LightningSimulator = lazy(() => import("@/pages/realm3/lightning-simulator"));
const ForksSimulator = lazy(() => import("@/pages/realm3/forks-simulator"));
const KeysSimulator = lazy(() => import("@/pages/realm3/keys-simulator"));
const MempoolSimulator = lazy(() => import("@/pages/realm3/mempool-simulator"));
const NodeSimulator = lazy(() => import("@/pages/realm3/node-simulator"));
const ScalingSimulator = lazy(() => import("@/pages/realm3/scaling-simulator"));
const ScriptSimulator = lazy(() => import("@/pages/realm3/script-simulator"));
const TransactionSimulator = lazy(() => import("@/pages/realm3/transaction-simulator"));
const WalletSimulator = lazy(() => import("@/pages/realm3/wallet-simulator"));
const TrustLessSimulator = lazy(() => import("@/pages/realm3/trustless-simulator"));

const HalvingSimulator = lazy(() => import("@/pages/realm4/halving-simulator"));
const EnergySimulator = lazy(() => import("@/pages/realm4/energy-simulator"));
const KnowledgeSimulator = lazy(() => import("@/pages/realm4/knowledge-simulator"));
const AfricaSimulator = lazy(() => import("@/pages/realm4/africa-simulator"));
const ConsensusSimulator4 = lazy(() => import("@/pages/realm4/consensus-simulator"));
const MiningSimulator = lazy(() => import("@/pages/realm4/mining-simulator"));

// const KnowledgeSimulator = lazy(() => import("@/pages/realm5/knowledge-simulator"));
const BipSimulator = lazy(() => import("@/pages/realm5/bip-simulator"));
const FailedForksSimulator = lazy(() => import("@/pages/realm5/failed-forks-simulator"));
const ForkSimulator = lazy(() => import("@/pages/realm5/fork-simulator"));
const GovernanceSimulator = lazy(() => import("@/pages/realm5/governance-simulator"));
const HistoricalForksSimulator = lazy(() => import("@/pages/realm5/historical-forks-simulator"));

const PracticalChallenges = lazy(() => import("@/pages/realm7/components/PracticalChallenges"));
const TechnicalMastery = lazy(() => import("@/pages/realm7/components/TechnicalMastery"));
const Certification = lazy(() => import("@/pages/realm7/components/Certification"));

// Router wrapper to handle navigation
function RouterListener() {
  const [location] = useLocation();
  useEffect(() => {
    console.log("Current location:", location);
  }, [location]);
  return null;
}

// Root route redirect component  
function RedirectToHome() {
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    // Add additional console logs to debug
    console.log('Current location:', location);
    console.log('RedirectToHome component mounted');
    
    // Redirect everyone to the home intro page first
    console.log('Redirecting to home intro page at:', '/home-intro');
    setLocation('/home-intro');
  }, [location, setLocation]);
  
  return <LoadingSpinner />;
}

// Loading spinner component for Suspense fallback
const LoadingSpinner = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
    <p className="text-lg text-muted-foreground">Loading content...</p>
  </div>
);

// Wrapper components for simulators that need specific props
const BarterWebChallengeWrapper = () => <BarterWebChallenge onComplete={() => {}} />;
const InflationSimulatorWrapper = () => <InflationSimulator onComplete={() => {}} />;
const CBDCSimulatorWrapper = () => <CBDCSimulator onComplete={() => {}} />;
const LightningNetworkSimulatorWrapper = () => <LightningNetworkSimulator onComplete={() => {}} />;
const PrivacyBalanceSimulatorWrapper = () => <PrivacyBalanceSimulator onComplete={() => {}} />;
const SelfCustodySimulatorWrapper = () => <SelfCustodySimulator onComplete={() => {}} />;
const SurveillanceSimulatorWrapper = () => <SurveillanceSimulator onComplete={() => {}} />;
const ConsensusSimulator3Wrapper = () => <ConsensusSimulator3 onComplete={() => {}} />;
const CryptographySimulatorWrapper = () => <CryptographySimulator onComplete={() => {}} />;
const HashingSimulatorWrapper = () => <HashingSimulator onComplete={() => {}} />;
const MerkleTreeSimulatorWrapper = () => <MerkleTreeSimulator onComplete={() => {}} />;
const LightningSimulatorWrapper = () => <LightningSimulator onComplete={() => {}} />;
const LightningBitcoinSimulatorWrapper = () => <LightningBitcoinSimulator onComplete={() => {}} />;
const ForksWrapper = () => <ForksSimulator onComplete={() => {}} />;
const KeysSimulatorWrapper = () => <KeysSimulator onComplete={() => {}} />;
const MempoolSimulatorWrapper = () => <MempoolSimulator onComplete={() => {}} />;
const NodeSimulatorWrapper = () => <NodeSimulator onComplete={() => {}} />;
const ScalingSimulatorWrapper = () => <ScalingSimulator onComplete={() => {}} />;
const ScriptSimulatorWrapper = () => <ScriptSimulator onComplete={() => {}} />;
const TransactionSimulatorWrapper = () => <TransactionSimulator onComplete={() => {}} />;
const WalletSimulatorWrapper = () => <WalletSimulator onComplete={() => {}} />;
const TrustlessimulatorWrapper = () => <TrustlessSimulator onComplete={() => {}} />;
const HalvingSimulatorWrapper = () => <HalvingSimulator onComplete={() => {}} />;
const EnergySimulatorWrapper = () => <EnergySimulator onComplete={() => {}} />;
const AfricaSimulatorWrapper = () => <AfricaSimulator onComplete={() => {}} />;
const ConsensusSimulator4Wrapper = () => <ConsensusSimulator4 onComplete={() => {}} />;
const MiningSimulatorWrapper = () => <MiningSimulator onComplete={() => {}} />;
const KnowledgeSimulatorWrapper = () => <KnowledgeSimulator onComplete={() => {}} />;
const BipSimulatorWrapper = () => <BipSimulator onComplete={() => {}} />;
const FailedForksSimulatorWrapper = () => <FailedForksSimulator onComplete={() => {}} />;
const ForkSimulatorWrapper = () => <ForkSimulator onComplete={() => {}} />;
const GovernanceSimulatorWrapper = () => <GovernanceSimulator onComplete={() => {}} />;
const HistoricalForksSimulatorWrapper = () => <HistoricalForksSimulator onComplete={() => {}} />;
const PracticalChallengesWrapper = () => <PracticalChallenges onComplete={() => {}} />;
const TechnicalMasteryWrapper = () => <TechnicalMastery onComplete={() => {}} />;
const CertificationWrapper = () => <Certification onComplete={() => {}} />;

function App() {
  return (
    <AuthProvider>
      <RouterListener />
      <Suspense fallback={<LoadingSpinner />}>
        <Switch>
          {/* Root route is story intro first */}
          <Route path="/" component={StoryIntroPage} />
          
          {/* Alternative path for home-intro */}
          <Route path="/home-intro" component={HomeIntroPage} />
          
          {/* Auth page comes next */}
          <Route path="/auth" component={AuthPage} />
          <Route path="/forgot-password" component={ForgotPasswordPage} />
          
          {/* Story intro for users post-authentication */}
          <Route path="/intro" component={StoryIntroPage} />
          
          {/* Main navigation routes */}
          <Route path="/home" component={HomePage} />
          <Route path="/map" component={MapPage} />
          <Route path="/map/africa" component={AfricaMapPage} />
          <Route path="/badges" component={BadgesPage} />
          <Route path="/journey" component={JourneyPage} />
          <Route path="/profile" component={ProfilePage} />
          
          {/* Realm 1 specific routes */}
          <Route path="/realm/1/story" component={Realm1Story} />
          <Route path="/realm/1/home" component={Realm1Home} />
          <Route path="/realm/1" component={Realm1Home} />
          <Route path="/realm1" component={Realm1Home} />
          
          {/* Realm 2 home */}
          <Route path="/realm/2/story" component={Realm2Story} />
          <Route path="/realm/2/home" component={Realm2Home} />
          <Route path="/realm/2" component={Realm2Home} />
          <Route path="/realm2" component={Realm2Home} />
          
          {/* Realm 3 home */}
          <Route path="/realm/3/story" component={Realm3Story} />
          <Route path="/realm/3/home" component={Realm3Home} />
          <Route path="/realm/3" component={Realm3Home} />
          <Route path="/realm3" component={Realm3Home} />
          
          {/* Realm 4 home */}
          <Route path="/realm/4/story" component={Realm4Story} />
          <Route path="/realm/4/home" component={Realm4Home} />
          <Route path="/realm/4" component={Realm4Home} />
          <Route path="/realm4" component={Realm4Home} />
          
          {/* Realm 5 home */}
          <Route path="/realm/5/story" component={Realm5Story} />
          <Route path="/realm/5/home" component={Realm5Home} />
          <Route path="/realm/5" component={Realm5Home} />
          <Route path="/realm5" component={Realm5Home} />
          
          {/* Realm 6 home */}
          <Route path="/realm/6/story" component={Realm6Story} />
          <Route path="/realm/6/home" component={Realm6Home} />
          <Route path="/realm/6" component={Realm6Home} />
          <Route path="/realm6" component={Realm6Home} />
          
          {/* Realm 7 home */}
          <Route path="/realm/7/story" component={Realm7Story} />
          <Route path="/realm/7/home" component={Realm7Home} />
          <Route path="/realm/7" component={Realm7Home} />
          <Route path="/realm7" component={Realm7Home} />
          
          {/* Universal realm routes */}
          <Route path="/realm/:id" component={RealmPage} />
          
          {/* Universal mission routes - these will use our dynamic mission wrapper */}
          <Route path="/realm/:realmId/mission/:missionId" component={MissionWrapper} />
          <Route path="/realm/:realmId/missions/:missionId" component={MissionWrapper} />
          
          {/*Special case for Realm 3 with numbered format*/}
          <Route path="/realm/3/mission/:missionId" component={lazy(() => import("@/pages/realm3/mission-wrapper"))} />
          
          {/* Special case for Realm 7 with numbered format */}
          <Route path="/realm/7/mission/:missionId" component={lazy(() => import("@/pages/realm7/mission-wrapper"))} />
          
          {/* Alternative mission route patterns for backwards compatibility */}
          <Route path="/realm1/mission/:missionId" component={MissionWrapper} />
          <Route path="/realm2/mission/:missionId" component={MissionWrapper} />
          {/* <Route path="/realm3/mission/:missionId" component={MissionWrapper} /> */}
          {/* Use custom wrapper for Realm 3 to fix loading issues*/}
          <Route path="/realm3/mission/:missionId" component={lazy(() => import("@/pages/realm3/mission-wrapper"))} />
          {/* Use custom wrapper for Realm 4 because it has conflicting mission file structure */}
          <Route path="/realm4/mission/:missionId" component={lazy(() => import("@/pages/realm4/mission-wrapper"))} />
          <Route path="/realm5/mission/:missionId" component={MissionWrapper} />
          <Route path="/realm6/mission/:missionId" component={MissionWrapper} />
          {/* Use custom wrapper for Realm 7 because it has similar conflicting file structure */}
          <Route path="/realm7/mission/:missionId" component={lazy(() => import("@/pages/realm7/mission-wrapper"))} />
          
          {/* Missions index pages */}
          <Route path="/realm1/missions" component={lazy(() => import("@/pages/realm1/missions"))} />
          <Route path="/realm2/missions" component={lazy(() => import("@/pages/realm2/missions"))} />
          <Route path="/realm3/missions" component={lazy(() => import("@/pages/realm3/missions"))} />
          <Route path="/realm4/missions" component={lazy(() => import("@/pages/realm4/missions"))} />
          <Route path="/realm5/missions" component={lazy(() => import("@/pages/realm5/missions"))} />
          <Route path="/realm6/missions" component={lazy(() => import("@/pages/realm6/missions"))} />
          <Route path="/realm7/missions" component={lazy(() => import("@/pages/realm7/missions"))} />

          {/* Simulations - Using wrapper components for those that need specific props */}
          
         {/* Realm 1 Routes */}
          <Route path="/realm1/barter-web-challenge" component={BarterWebChallengeWrapper} />
          <Route path="/realm1/currency-value-simulator" component={CurrencyValueSimulator} />
          {/* <Route path="/realm1/african-currency-education" component={AfricanCurrencyEducation} /> */}
          <Route path="/realm1/game" component={GameComponent} />
          <Route path="/realm1/inflation-simulator" component={InflationSimulatorWrapper} />

          {/* Realm 2 Routes */}
          <Route path="/realm2/bitcoin-transparency-explorer" component={BitcoinTransparencyExplorer} />
          <Route path="/realm2/cbdc-simulator" component={CBDCSimulatorWrapper} />
          <Route path="/realm2/lightning-network-simulator" component={LightningNetworkSimulatorWrapper} />
          <Route path="/realm2/privacy-balance-simulator" component={PrivacyBalanceSimulatorWrapper} />
          <Route path="/realm2/self-custody-simulator" component={SelfCustodySimulatorWrapper} />
          <Route path="/realm2/surveillance-simulator" component={SurveillanceSimulatorWrapper} />

          {/* Realm 3 Routes */}
          <Route path="/realm3/consensus-simulator" component={ConsensusSimulator3Wrapper} />
          <Route path="/realm3/cryptography-simulator" component={CryptographySimulatorWrapper} />
          <Route path="/realm3/hashing-simulator" component={HashingSimulatorWrapper} />
          <Route path="/realm3/merkle-tree-simulator" component={MerkleTreeSimulatorWrapper} />
          <Route path="/realm3/lightning-bitcoin-simulator" component={LightningBitcoinSimulatorWrapper} />
          <Route path="/realm3/lightning-simulator" component={LightningSimulatorWrapper} />
          <Route path="/realm3/forks-simulator" component={ForkSimulatorWrapper} />
          <Route path="/realm3/keys-simulator" component={KeysSimulatorWrapper} />
          <Route path="/realm3/mempool-simulator" component={MempoolSimulatorWrapper} />
          <Route path="/realm3/node-simulator" component={NodeSimulatorWrapper} />
          <Route path="/realm3/scaling-simulator" component={ScalingSimulatorWrapper} />
          <Route path="/realm3/script-simulator" component={ScriptSimulatorWrapper} />
          <Route path="/realm3/transaction-simulator" component={TransactionSimulatorWrapper} />
          <Route path="/realm3/wallet-simulator" component={WalletSimulatorWrapper} />
          <Route path="/realm3/trustless-simulator" component={TrustlessimulatorWrapper} />

          {/* Realm 4 Routes */}
          <Route path="/realm4/halving-simulator" component={HalvingSimulatorWrapper} />
          <Route path="/realm4/energy-simulator" component={EnergySimulatorWrapper} />
          <Route path="/realm4/africa-simulator" component={AfricaSimulatorWrapper} />
          <Route path="/realm4/consensus-simulator" component={ConsensusSimulator4Wrapper} />
          <Route path="/realm4/mining-simulator" component={MiningSimulatorWrapper} />
          <Route path="/realm4/knowledge-simulator" component={KnowledgeSimulatorWrapper} />

          {/* Realm 5 Routes */}
          <Route path="/realm5/knowledge-simulator" component={KnowledgeSimulatorWrapper} />
          <Route path="/realm5/bip-simulator" component={BipSimulatorWrapper} />
          <Route path="/realm5/failed-forks-simulator" component={FailedForksSimulatorWrapper} />
          <Route path="/realm5/fork-simulator" component={ForkSimulatorWrapper} />
          <Route path="/realm5/governance-simulator" component={GovernanceSimulatorWrapper} />
          <Route path="/realm5/historical-forks-simulator" component={HistoricalForksSimulatorWrapper} />

          {/* Realm 7 Routes */}
          <Route path="/realm7/practical-challenges" component={PracticalChallengesWrapper} />
          <Route path="/realm7/technical-mastery" component={TechnicalMasteryWrapper} />
          <Route path="/realm7/certification" component={CertificationWrapper} />
                
          {/* Fall back to NotFound for any other route */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      <Toaster />
    </AuthProvider>
  );
}

export default App;