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
    const radius = total === 6 ? 180 : 120;
    const x = radius * Math.cos((angle * Math.PI) / 180);
    const y = radius * Math.sin((angle * Math.PI) / 180);
    return { x, y };
  };

  return (
    <div className="w-full h-[400px] flex justify-center items-center gap-24">
      <div className="flex items-center justify-center z-10">
        <TimingDisplay
          remainingTime={remainingTime}
          totalDuration={currentDuration}
          label={emergencySignalId !== null ? "Emergency" : "Current Signal"}
        />
      </div>
      <div className="relative w-[240px] h-[240px] rounded-full bg-gray-100 flex justify-center items-center">
        {signals.map((signal, index) => {
          const pos = getSignalPosition(index, signals.length);
          return (
            <div
              key={signal.id}
              className="[&>*]:m-6"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px)`,
              }}
            >
              <Signal
                id={signal.id}
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
