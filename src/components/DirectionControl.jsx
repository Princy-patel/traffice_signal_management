"use client";

import React, { useState } from "react";
import { ArrowLeftRight, ArrowUpDown } from "lucide-react";

export const DirectionControl = ({ onDirectionChange, disabled }) => {
  const [activeDirection, setActiveDirection] = useState("horizontal");

  return (
    <div className="flex gap-2">
      <button
        onClick={() => {
          onDirectionChange("horizontal");
          setActiveDirection("horizontal");
        }}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2 rounded ${
          disabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gray-200 text-black"
        } ${activeDirection === "horizontal" ? "bg-blue-600 text-white" : ""}`}
      >
        <ArrowLeftRight className="w-4 h-4" />
        Horizontal
      </button>
      <button
        onClick={() => {
          onDirectionChange("vertical");
          setActiveDirection("vertical");
        }}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2 rounded ${
          disabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gray-200 text-black"
        } ${activeDirection === "vertical" ? "bg-blue-600 text-white" : ""}`}
      >
        <ArrowUpDown className="w-4 h-4" />
        Vertical
      </button>
    </div>
  );
};
