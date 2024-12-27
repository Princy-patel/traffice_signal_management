import React from "react";
import { Signal } from "./Signal";
import { TimingDisplay } from "./TimingDisplay";

export const Intersection = ({
  signals,
  onSignalClick,
  emergencySignalId,
  remainingTime,
  currentDuration,
}) => {
  const getSignalPosition = (index, total) => {
    const angle = (360 / total) * index - 90;
    const radius = 120;
    const x = radius * Math.cos((angle * Math.PI) / 180);
    const y = radius * Math.sin((angle * Math.PI) / 180);
    return { x, y };
  };

  return (
    <div className="relative w-[400px] h-[400px]">
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <TimingDisplay
          remainingTime={remainingTime}
          totalDuration={currentDuration}
          label={emergencySignalId !== null ? "Emergency" : "Current Signal"}
        />
      </div>
      <div className="absolute inset-0 bg-gray-100 rounded-full">
        {signals.map((signal, index) => {
          const pos = getSignalPosition(index, signals.length);
          return (
            <div
              key={signal.id}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(${pos.x}px, ${pos.y}px)`,
              }}
            >
              <Signal
                state={signal.state}
                position={signal.position}
                onClick={() => onSignalClick(signal.id)}
                isEmergency={emergencySignalId === signal.id}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
