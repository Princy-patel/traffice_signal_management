import React from "react";

export const Signal = ({ id, state, position, onClick, isEmergency }) => {
  return (
    <div
      className={`relative p-2 rounded-full shadow-lg cursor-pointer
        ${isEmergency ? "animate-pulse border-2 border-red-500" : ""}
        flex flex-col justify-center items-center`}
      onClick={onClick}
    >
      <div className="flex flex-col gap-2">
        <div
          className={`w-8 h-8 rounded-full ${
            state === "red" ? "bg-red-500" : "bg-red-200"
          }`}
        />
        <div
          className={`w-8 h-8 rounded-full ${
            state === "yellow" ? "bg-yellow-500" : "bg-yellow-200"
          }`}
        />
        <div
          className={`w-8 h-8 rounded-full ${
            state === "green" ? "bg-green-500" : "bg-green-200"
          }`}
        />
      </div>
      <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm font-medium">
        {position}
      </span>
    </div>
  );
};
