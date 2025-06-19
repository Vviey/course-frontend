import { useEffect, useState,  lazy } from 'react';
import { useParams, useLocation } from 'wouter';
import Mission from './mission';
import MissionsComponent from './missions';


// Import all the specific mission components
const ConsensusSimulator = lazy(() => import('./consensus-simulator'));
const CryptographySimulator = lazy(() => import('./cryptography-simulator'));
const HashingSimulator = lazy(() => import('./hashing-simulator'));
const MerkleTreeSimulator = lazy(() => import('./merkle-tree-simulator'));
const LightningBitcoinSimulator = lazy(() => import('./lightning-bitcoin-simulator'));
const LightningSimulator = lazy(() => import('./lightning-simulator'));
const ForksSimulator = lazy(() => import('./forks-simulator'));
const KeysSimulator = lazy(() => import('./keys-simulator'));
const MempoolSimulator = lazy(() => import('./mempool-simulator'));
const NodeSimulator = lazy(() => import('./node-simulator'));
const ScalingSimulator = lazy(() => import('./scaling-simulator'));
const ScriptSimulator = lazy(() => import('./script-simulator'));
const TransactionSimulator = lazy(() => import('./transaction-simulator'));
const WalletSimulator = lazy(() => import('./wallet-simulator'));
const TrustlessSimulator = lazy(() => import('./trustless-simulator'));

/**
 * This component serves as a compatibility layer to handle mission loading
 * in realm3, resolving conflicts between mission.tsx and missions.tsx
 */
export default function Realm3MissionWrapper() {
  const { missionId } = useParams<{ missionId: string }>();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log('Realm3MissionWrapper: Initializing with missionId:', missionId);
    setLoading(false);
  }, [missionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Handle specific mission routing
  const renderMissionComponent = () => {
    if (!missionId) {
      return <Mission />;
    }

    // Map mission IDs to their respective components
    switch (missionId.toLowerCase()) {
      case 'consensus-simulator':
      case 'consensus':
        return <ConsensusSimulator onComplete={() => {}} />;
      
      case 'cryptography-simulator':
      case 'cryptography':
        return <CryptographySimulator onComplete={() => {}} />;
      
      case 'hashing-simulator':
      case 'hashing':
        return <HashingSimulator onComplete={() => {}} />;
      
      case 'merkle-tree-simulator':
      case 'merkle-tree':
        return <MerkleTreeSimulator onComplete={() => {}} />;
      
      case 'lightning-bitcoin-simulator':
      case 'lightning-bitcoin':
        return <LightningBitcoinSimulator onComplete={() => {}} />;
      
      case 'lightning-simulator':
      case 'lightning':
        return <LightningSimulator onComplete={() => {}} />;
      
      case 'forks-simulator':
      case 'forks':
        return <ForksSimulator onComplete={() => {}} />;
      
      case 'keys-simulator':
      case 'keys':
        return <KeysSimulator onComplete={() => {}} />;
      
      case 'mempool-simulator':
      case 'mempool':
        return <MempoolSimulator onComplete={() => {}} />;
      
      case 'node-simulator':
      case 'node':
        return <NodeSimulator onComplete={() => {}} />;
      
      case 'scaling-simulator':
      case 'scaling':
        return <ScalingSimulator onComplete={() => {}} />;
      
      case 'script-simulator':
      case 'script':
        return <ScriptSimulator onComplete={() => {}} />;
      
      case 'transaction-simulator':
      case 'transaction':
        return <TransactionSimulator onComplete={() => {}} />;
      
      case 'wallet-simulator':
      case 'wallet':
        return <WalletSimulator onComplete={() => {}} />;
      
      case 'trustless-simulator':
      case 'trustless':
        return <TrustlessSimulator onComplete={() => {}} />;
      
      case 'missions':
        return <MissionsComponent />;
      
      default:
        console.warn(`Unknown mission ID: ${missionId}`);
        // Fallback to the default Mission component or show an error
        return <Mission />;
    }
  };

  return (
    <div className="realm3-mission-wrapper">
      {renderMissionComponent()}
    </div>
  );
}
