import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MiningSimulatorProps {
  onComplete: () => void;
}

export function MiningSimulator({ onComplete }: MiningSimulatorProps) {
  const [hashRate, setHashRate] = useState(1000);
  const [difficulty, setDifficulty] = useState(1000000);
  const [isRunning, setIsRunning] = useState(false);

  const handleStart = () => {
    setIsRunning(true);
    // Simulate mining completion after 3 seconds
    setTimeout(() => {
      setIsRunning(false);
      onComplete();
    }, 3000);
  };

  return (
    <div className="bg-orange-900/20 border border-orange-800/30 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-orange-400">Bitcoin Mining Simulator</h3>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Hash Rate (H/s)</label>
          <input
            type="range"
            min="100"
            max="10000"
            value={hashRate}
            onChange={(e) => setHashRate(parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-orange-300">{hashRate.toLocaleString()} H/s</span>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Network Difficulty</label>
          <input
            type="range"
            min="100000"
            max="5000000"
            value={difficulty}
            onChange={(e) => setDifficulty(parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-orange-300">{difficulty.toLocaleString()}</span>
        </div>
      </div>

      <Button
        onClick={handleStart}
        disabled={isRunning}
        className="bg-orange-600 hover:bg-orange-700"
      >
        {isRunning ? 'Mining...' : 'Start Mining'}
      </Button>
    </div>
  );
}