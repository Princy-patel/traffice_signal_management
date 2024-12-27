"use client";

import React, { useState, useCallback, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { ConfigPanel } from "@/components/ConfigPanel";
import { Intersection } from "@/components/Intersection";
import { DirectionControl } from "@/components/DirectionControl";

function Home() {
  const [intersectionType, setIntersectionType] = useState(4);
  const [cycleMode, setCycleMode] = useState("clockwise");
  const [timerConfig, setTimerConfig] = useState({
    greenDuration: 30,
    yellowDuration: 5,
    emergencyDuration: 60,
  });
  const [isRunning, setIsRunning] = useState(true);
  const [emergencySignalId, setEmergencySignalId] = useState(null);
  const [signals, setSignals] = useState([]);
  const [activeSignalIndex, setActiveSignalIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(timerConfig.greenDuration);

  const getPositions = (type) => {
    const positions = {
      3: ["North", "South East", "South West"],
      4: ["North", "East", "South", "West"],
      5: ["North", "North East", "South East", "South West", "North West"],
    };
    return positions[type];
  };

  const updateSignals = useCallback(() => {
    const positions = getPositions(intersectionType);

    const newSignals = Array.from({ length: intersectionType }, (_, i) => ({
      id: i,
      state:
        emergencySignalId !== null
          ? i === emergencySignalId
            ? "green"
            : "red"
          : i === activeSignalIndex
          ? "green"
          : "red",
      position: positions[i],
    }));

    setSignals(newSignals);
  }, [intersectionType, activeSignalIndex, emergencySignalId]);

  useEffect(() => {
    updateSignals();
  }, [intersectionType, updateSignals]);

  const cycleSignals = useCallback(
    (mode) => {
      if (mode === "manual") return;

      setActiveSignalIndex((prev) => {
        // debugger;
        const newIndex =
          mode === "clockwise"
            ? (prev + 1) % intersectionType
            : (prev - 1 + intersectionType) % intersectionType;
        return newIndex;
      });
    },
    [intersectionType]
  );

  const onTimerComplete = useCallback(() => {
    if (emergencySignalId === null) {
      cycleSignals(cycleMode);
    }
  }, [emergencySignalId, cycleSignals, cycleMode]);

  useEffect(() => {
    if (!isRunning || (cycleMode === "manual" && !isRunning)) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 0) {
          onTimerComplete();
          return timerConfig.greenDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timerConfig.greenDuration, onTimerComplete, cycleMode]);

  useEffect(() => {
    setRemainingTime(timerConfig.greenDuration);
  }, [timerConfig.greenDuration]);

  // const setEmergencySignal = useCallback((id) => {
  //   setSignals((prev) =>
  //     prev.map((signal) => ({
  //       ...signal,
  //       state: signal.id === id ? "green" : "red",
  //     }))
  //   );
  // }, []);

  const handleSignalClick = useCallback(
    (id) => {
      if (emergencySignalId !== null) return;

      setEmergencySignalId(id);
      setRemainingTime(timerConfig.emergencyDuration);
      setSignals((prev) =>
        prev.map((signal) => ({
          ...signal,
          state: signal.id === id ? "green" : "red",
        }))
      );

      const timeout = setTimeout(() => {
        setEmergencySignalId(null);
        updateSignals();
      }, timerConfig.emergencyDuration * 1000);

      return () => clearTimeout(timeout);
    },
    [emergencySignalId, timerConfig.emergencyDuration, updateSignals]
  );

  const setFlowDirection = useCallback(
    (direction) => {
      const positions = getPositions(intersectionType);

      const newSignals = positions.map((position, i) => ({
        id: i,
        state: "red",
        position,
      }));

      if (direction === "horizontal") {
        const eastIndex = positions.findIndex((p) => p.includes("East"));

        const westIndex = positions.findIndex((p) => p.includes("West"));
        if (eastIndex !== -1) newSignals[eastIndex].state = "green";
        if (westIndex !== -1) newSignals[westIndex].state = "green";
      } else {
        const northIndex = positions.findIndex((p) => p.includes("North"));
        const southIndex = positions.findIndex((p) => p.includes("South"));
        if (northIndex !== -1) newSignals[northIndex].state = "green";
        if (southIndex !== -1) newSignals[southIndex].state = "green";
      }

      setSignals(newSignals);
    },
    [intersectionType]
  );

  const handleDirectionChange = useCallback(
    (direction) => {
      setFlowDirection(direction);
      setRemainingTime(timerConfig.greenDuration);
    },
    [setFlowDirection, timerConfig.greenDuration]
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-black">
          Traffic Signal Management
        </h1>

        <ConfigPanel
          intersectionType={intersectionType}
          cycleMode={cycleMode}
          timerConfig={timerConfig}
          onIntersectionTypeChange={setIntersectionType}
          onCycleModeChange={setCycleMode}
          onTimerConfigChange={setTimerConfig}
        />

        {cycleMode === "manual" && (
          <div className="flex justify-center">
            <DirectionControl
              onDirectionChange={handleDirectionChange}
              disabled={emergencySignalId !== null}
            />
          </div>
        )}

        {emergencySignalId !== null ? (
          <div className="flex items-center gap-2 bg-red-100 text-red-700 p-4 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
            <span>
              Emergency override active! Normal operation will resume in{" "}
              {Math.ceil(remainingTime)} seconds.
            </span>
          </div>
        ) : (
          <p>
            Click on any signal to trigger the emergency override and stop
            normal operation.
          </p>
        )}

        <div className="flex justify-center mt-52">
          <Intersection
            signals={signals}
            onSignalClick={handleSignalClick}
            emergencySignalId={emergencySignalId}
            remainingTime={remainingTime}
            currentDuration={
              emergencySignalId !== null
                ? timerConfig.emergencyDuration
                : timerConfig.greenDuration
            }
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-3 rounded-lg font-medium ${
              isRunning
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isRunning ? "Stop Signals" : "Start Signals"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
