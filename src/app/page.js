"use client";

import React, { useState, useCallback, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { ConfigPanel } from "@/components/ConfigPanel";
import { Intersection } from "@/components/Intersection";

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
        console.log("prev value", prev);
        console.log("inter", intersectionType);
        // debugger;
        const newIndex =
          mode === "clockwise"
            ? (prev + 1) % intersectionType
            : (prev - 1 + intersectionType) % intersectionType;
        console.log("Cycling signals to index:", newIndex);
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
    if (!isRunning) return;

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
  }, [isRunning, timerConfig.greenDuration, onTimerComplete]);

  useEffect(() => {
    setRemainingTime(timerConfig.greenDuration);
  }, [timerConfig.greenDuration]);

  const setEmergencySignal = useCallback((id) => {
    setSignals((prev) =>
      prev.map((signal) => ({
        ...signal,
        state: signal.id === id ? "green" : "red",
      }))
    );
  }, []);

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
