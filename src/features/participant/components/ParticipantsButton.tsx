import React, { useState } from "react";
import { Users } from "lucide-react";

interface ParticipantsButtonProps {
  participantSize: number;
  isActive: boolean;
  onClick: () => void;
}

export const ParticipantsButton: React.FC<ParticipantsButtonProps> = ({ participantSize, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const displayCount = participantSize > 99 ? "99+" : participantSize;

  return (
    <button
      className={`flex items-center space-x-1 px-3 py-2 rounded-full transition-all duration-300 
        ${isActive ? "bg-blue-500 text-white" : isHovered ? "bg-gray-200" : "bg-gray-100"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <Users size={20} />
      <span className="text-sm font-medium">{displayCount}</span>
    </button>
  );
};
