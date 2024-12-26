import React from "react";

export const TimingDisplay = ({ remainingTime, totalDuration, label }) => {
  const percentage = (remainingTime / totalDuration) * 100;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="#3b82f6"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 36}`}
            strokeDashoffset={`${2 * Math.PI * 36 * (1 - percentage / 100)}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold">{Math.ceil(remainingTime)}</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-gray-600">{label}</span>
    </div>
  );
};
