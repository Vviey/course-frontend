import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface HalvingSimulatorProps {
  onComplete: () => void;
}

export function HalvingSimulator({ onComplete }: HalvingSimulatorProps) {
  const [currentEra, setCurrentEra] = useState(0);
  const [blocksProcessed, setBlocksProcessed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const eras = [
    { reward: 50, blocks: 210000, year: "2009-2012" },
    { reward: 25, blocks: 210000, year: "2012-2016" },
    { reward: 12.5, blocks: 210000, year: "2016-2020" },
    { reward: 6.25, blocks: 210000, year: "2020-2024" },
    { reward: 3.125, blocks: 210000, year: "2024-2028" }
  ];

  const handleSimulate = () => {
    setIsRunning(true);
    const interval = setInterval(() => {
      setBlocksProcessed(prev => {
        if (prev >= 210000) {
          if (currentEra < eras.length - 1) {
            setCurrentEra(currentEra + 1);
            return 0;
          } else {
            clearInterval(interval);
            setIsRunning(false);
            setTimeout(() => onComplete(), 1000);
            return prev;
          }
        }
        return prev + 1000;
      });
    }, 100);
  };

  return (
    <div className="bg-orange-900/20 border border-orange-800/30 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-orange-400">Bitcoin Halving Simulator</h3>
      
      <div className="space-y-4 mb-6">
        <div className="text-center">
          <h4 className="text-lg font-medium text-orange-300">
            Era {currentEra + 1}: {eras[currentEra].year}
          </h4>
          <p className="text-2xl font-bold text-orange-400">
            {eras[currentEra].reward} BTC per block
          </p>
        </div>
        
        <div className="w-full bg-orange-950 rounded-full h-4">
          <div
            className="bg-orange-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${(blocksProcessed / 210000) * 100}%` }}
          />
        </div>
        
        <p className="text-center text-orange-300">
          {blocksProcessed.toLocaleString()} / 210,000 blocks
        </p>
      </div>

      <Button
        onClick={handleSimulate}
        disabled={isRunning}
        className="w-full bg-orange-600 hover:bg-orange-700"
      >
        {isRunning ? 'Simulating...' : 'Start Halving Simulation'}
      </Button>
    </div>
  );
}