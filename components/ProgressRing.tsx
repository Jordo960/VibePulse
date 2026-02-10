
import React from 'react';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  children?: React.ReactNode;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ 
  percentage, 
  size = 256, 
  strokeWidth = 12, 
  color = "#a855f7",
  children 
}) => {
  const radius = (size / 2) - (strokeWidth / 2);
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Background Ring */}
        <circle
          className="stroke-white/5"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
          stroke={color}
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            filter: `drop-shadow(0 0 8px ${color})`,
            transition: 'stroke-dashoffset 0.5s ease-out'
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default ProgressRing;
