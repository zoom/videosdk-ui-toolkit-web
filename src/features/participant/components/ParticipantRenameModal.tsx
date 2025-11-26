import React, { useState } from "react";

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => void;
  initialName: string;
}

const RenameModal: React.FC<RenameModalProps> = ({ isOpen, onClose, onRename, initialName }) => {
  const [newName, setNewName] = useState(initialName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRename(newName);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-theme-surface border border-theme-border text-theme-text rounded-lg shadow-xl p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4">Rename:</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 border border-theme-border rounded-md shadow-sm text-theme-text focus:outline-none focus:ring-theme-text focus:border-theme-text text-theme-text bg-theme-background"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-theme-text bg-theme-surface border border-theme-border rounded-md hover:bg-theme-background focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-theme-text-button bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenameModal;
