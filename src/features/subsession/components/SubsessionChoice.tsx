import React, { useState } from "react";
import { Button } from "@/components/widget/CommonButton";
import { SubsessionAllocationPattern } from "../subsession-constants";

const SubsessionChoice = ({
  isOpen,
  onClose,
  initialRoomCount,
  onSubmit,
  subsessionType,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialRoomCount: number;
  onSubmit: (initialRoomCount: number, subsessionType: SubsessionAllocationPattern) => void;
  subsessionType: SubsessionAllocationPattern;
}) => {
  const [roomCount, setRoomCount] = useState(initialRoomCount);
  const [assignmentOption, setAssignmentOption] = useState(subsessionType);

  if (!isOpen) return null;
  const handleCreate = () => {
    // Handle room creation logic here
    onSubmit(roomCount, assignmentOption);
  };

  return (
    <>
      <div className="p-6 space-y-6 text-lg">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-semibold">Create</span>
          <input
            type="number"
            min="1"
            max="100"
            value={roomCount}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              // Ensure value is between 1 and 100
              setRoomCount(Math.min(Math.max(value, 1), 100));
            }}
            className="w-16 px-2 py-1 border border-gray-300 rounded bg-theme-background"
            id={`uikit-subsession-choice-room-count-input`}
          />
          <span className="text-xl font-semibold">subsession rooms</span>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="assignment"
              value={SubsessionAllocationPattern.Automatically}
              checked={assignmentOption === SubsessionAllocationPattern.Automatically}
              onChange={() => setAssignmentOption(SubsessionAllocationPattern.Automatically)}
              id={`uikit-subsession-choice-automatically-radio`}
            />
            <span>Assign automatically</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="assignment"
              value={SubsessionAllocationPattern.Manually}
              checked={assignmentOption === SubsessionAllocationPattern.Manually}
              onChange={() => setAssignmentOption(SubsessionAllocationPattern.Manually)}
              id={`uikit-subsession-choice-manually-radio`}
            />
            <span>Assign manually</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="assignment"
              value={SubsessionAllocationPattern.SelfSelect}
              checked={assignmentOption === SubsessionAllocationPattern.SelfSelect}
              onChange={() => setAssignmentOption(SubsessionAllocationPattern.SelfSelect)}
              id={`uikit-subsession-choice-self-select-radio`}
            />
            <span>Let participants choose subsession room</span>
          </label>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 space-x-2">
        <Button variant="secondary" onClick={onClose} id={`uikit-subsession-choice-cancel-button`}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleCreate} id={`uikit-subsession-choice-create-button`}>
          Create
        </Button>
      </div>
    </>
  );
};

export default SubsessionChoice;
