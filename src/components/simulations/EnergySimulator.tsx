import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface EnergySimulatorProps {
  onComplete: () => void;
}

export function EnergySimulator({ onComplete }: EnergySimulatorProps) {
  const [energySource, setEnergySource] = useState('solar');
  const [efficiency, setEfficiency] = useState(85);
  const [completed, setCompleted] = useState(false);

  const handleSimulate = () => {
    setCompleted(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="bg-orange-900/20 border border-orange-800/30 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-orange-400">Energy Source Simulator</h3>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Energy Source</label>
          <select
            value={energySource}
            onChange={(e) => setEnergySource(e.target.value)}
            className="w-full p-2 bg-orange-950 border border-orange-800 rounded"
          >
            <option value="solar">Solar Power</option>
            <option value="wind">Wind Power</option>
            <option value="hydro">Hydroelectric</option>
            <option value="geothermal">Geothermal</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Efficiency (%)</label>
          <input
            type="range"
            min="50"
            max="95"
            value={efficiency}
            onChange={(e) => setEfficiency(parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-orange-300">{efficiency}%</span>
        </div>
      </div>

      <Button
        onClick={handleSimulate}
        disabled={completed}
        className="bg-orange-600 hover:bg-orange-700"
      >
        {completed ? 'Simulation Complete' : 'Run Simulation'}
      </Button>
    </div>
  );
}