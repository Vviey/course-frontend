import { useState } from 'react';
import { useLocation } from 'wouter';

export interface MissionCardProps {
  id?: number;
  title: string;
  description: string;
  duration?: number;
  points?: number;
  isCompleted?: boolean;
  isRecommended?: boolean;
  isLocked?: boolean;
  realmId?: number;
  onClick?: () => void;
}

export function MissionCard({
  id,
  title,
  description,
  duration = 15,
  points = 10,
  isCompleted = false,
  isRecommended = false,
  isLocked = false,
  realmId,
  onClick
}: MissionCardProps) {
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!isLocked) {
      if (onClick) {
        onClick();
      } else if (id && realmId) {
        setLocation(`/realms/${realmId}/missions/${id}`);
      }
    }
  };

  return (
    <div 
      className={`rounded-xl p-4 cursor-pointer transition-all duration-300 ${
        isLocked ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'
      } ${isCompleted ? 'origins-complete-animation' : ''}`}
      style={{ 
        backgroundColor: "rgb(255, 147, 5)", // Orange background
        color: "white", // White text for contrast
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Mission Title */}
      <h3 className="text-lg font-semibold mb-2 font-lora">
        {title}
      </h3>

      {/* Mission Description */}
      <p className="text-white text-sm mb-4 line-clamp-2">
        {description}
      </p>

      {/* Mission Details (Time & Points) */}
      <div className="flex justify-between items-center text-xs text-white">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>{duration} min</span>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          <span>{points} points</span>
        </div>
      </div>
    </div>
  );
}