import React from "react";
import { Settings, RotateCw, RotateCcw, AlertTriangle } from "lucide-react";

export const ConfigPanel = ({
  intersectionType,
  cycleMode,
  timerConfig,
  onIntersectionTypeChange,
  onCycleModeChange,
  onTimerConfigChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Intersection Type
          </label>
          <div className="flex gap-2">
            {[3, 4, 5].map((type) => (
              <button
                key={type}
                onClick={() => onIntersectionTypeChange(type)}
                className={`px-4 py-2 rounded ${
                  intersectionType === type
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {type}-way
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cycle Mode</label>
          <div className="flex gap-2">
            <button
              onClick={() => onCycleModeChange("clockwise")}
              className={`flex items-center gap-2 px-4 py-2 rounded cursor-pointer ${
                cycleMode === "clockwise"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <RotateCw className="w-4 h-4" /> Clockwise
            </button>
            <button
              onClick={() => onCycleModeChange("anticlockwise")}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                cycleMode === "anticlockwise"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <RotateCcw className="w-4 h-4" /> Anti-clockwise
            </button>
            <button
              onClick={() => onCycleModeChange("manual")}
              className={`px-4 py-2 rounded ${
                cycleMode === "manual"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Manual
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Green Duration (s)
            </label>
            <input
              type="number"
              min="1"
              value={timerConfig.greenDuration}
              onChange={(e) =>
                onTimerConfigChange({
                  ...timerConfig,
                  greenDuration: Math.max(1, parseInt(e.target.value) || 0),
                })
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Yellow Duration (s)
            </label>
            <input
              type="number"
              min="1"
              value={timerConfig.yellowDuration}
              onChange={(e) =>
                onTimerConfigChange({
                  ...timerConfig,
                  yellowDuration: Math.max(1, parseInt(e.target.value) || 0),
                })
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Emergency Duration (s)
            </label>
            <input
              type="number"
              min="1"
              value={timerConfig.emergencyDuration}
              onChange={(e) =>
                onTimerConfigChange({
                  ...timerConfig,
                  emergencyDuration: Math.max(1, parseInt(e.target.value) || 0),
                })
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
