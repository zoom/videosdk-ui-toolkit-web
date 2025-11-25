import React, { useRef, useState } from "react";
import Select, { MultiValue } from "react-select";
import { Button } from "@/components/widget/CommonButton";
import { SelectOption } from "../subsession-constants";
import { useClickOutside } from "@/hooks/useClickOutside";
import { CommonSelectStyle } from "@/components/widget/CommonSelectStyle";

interface CommonAssignModalProps {
  title: string;
  onClose: () => void;
  options: SelectOption[];
  onAssign: (selected: SelectOption | MultiValue<SelectOption>) => void;
  isMulti?: boolean;
  placeholder?: string;
  noOptionsMessage?: string;
  id?: string;
  themeName?: string;
}

export const CommonAssignModal: React.FC<CommonAssignModalProps> = ({
  id,
  title,
  onClose,
  options,
  onAssign,
  isMulti = false,
  placeholder = "Select an option",
  noOptionsMessage = "No options available",
  themeName = "light",
}) => {
  const [selected, setSelected] = useState<SelectOption | MultiValue<SelectOption> | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const excludeRef = useRef<HTMLDivElement>(null);
  const dialogRef = useClickOutside({
    callback: () => {
      // onClose(); // TODO: fix this
    },
    excludeRefs: [ref, excludeRef],
  });

  const handleAssign = () => {
    if (selected) {
      onAssign(selected);
      onClose();
    }
  };

  return (
    <div
      ref={dialogRef as React.RefObject<HTMLDivElement>}
      className="fixed m-0 w-full h-full rounded-lg inset-0 backdrop-blur-sm flex items-center justify-center z-50 border-solid border border-theme-border "
      style={{ marginLeft: 0 }}
    >
      <div className="bg-theme-surface p-6 rounded-2xl shadow-lg w-96 max-w-[90%] border-solid border border-theme-border">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>

        <Select
          ref={excludeRef as any}
          isMulti={isMulti}
          isClearable={true}
          name="assign-select"
          className="basic-multi-select mb-4"
          classNamePrefix="uikit-custom-scrollbar"
          onChange={(selectedOptions: SelectOption | MultiValue<SelectOption>) => {
            if (Array.isArray(selectedOptions)) {
              setSelected(selectedOptions);
            } else if (selectedOptions) {
              setSelected(selectedOptions);
            } else {
              setSelected(null);
            }
          }}
          id={id}
          options={options}
          placeholder={placeholder}
          noOptionsMessage={() => noOptionsMessage}
          styles={CommonSelectStyle({ themeName })}
        />
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" size="sm" onClick={onClose} id={`${id}-cancel-button`}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleAssign} disabled={!selected} id={`${id}-assign-button`}>
            Assign
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommonAssignModal;
