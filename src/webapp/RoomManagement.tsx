import React, { useState } from "react";
import { Plus, Trash2, Link, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface Room {
  id: string;
  name: string;
  capacity: number;
  created: string;
  role: "host" | "attendee";
  webrtcAudio: boolean;
  webrtcVideo: boolean;
}

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: uuidv4(),
      name: "Main Hall",
      capacity: 100,
      created: "2024-03-15",
      role: "host",
      webrtcAudio: true,
      webrtcVideo: true,
    },
    {
      id: uuidv4(),
      name: "Conference Room A",
      capacity: 50,
      created: "2024-03-14",
      role: "host",
      webrtcAudio: true,
      webrtcVideo: true,
    },
  ]);

  const [newRoom, setNewRoom] = useState({
    name: "",
    capacity: "",
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState({
    role: "host" as const,
    webrtcAudio: true,
    webrtcVideo: true,
  });

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.name || !newRoom.capacity) return;

    const room: Room = {
      id: uuidv4(),
      name: newRoom.name,
      capacity: parseInt(newRoom.capacity),
      created: new Date().toISOString().split("T")[0],
      role: advancedSettings.role,
      webrtcAudio: advancedSettings.webrtcAudio,
      webrtcVideo: advancedSettings.webrtcVideo,
    };

    setRooms([...rooms, room]);
    setNewRoom({ name: "", capacity: "" });
  };

  const handleDeleteRoom = (id: string) => {
    setRooms(rooms.filter((room) => room.id !== id));
  };

  const copyRoomLink = async (room: Room) => {
    const roomLink = `${window.location.origin}/room/${room.id}`;
    await navigator.clipboard.writeText(roomLink);
    setCopiedId(room.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-w-[400px] max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Room Management</h2>
        <p className="text-gray-600">Create and manage virtual rooms for your application.</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Room</h3>
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="room-name" className="block text-sm font-medium text-gray-700 mb-1">
                Room Name
              </label>
              <input
                type="text"
                id="room-name"
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#007AFF] focus:border-[#007AFF] text-gray-900"
                placeholder="Enter room name"
              />
            </div>
            <div>
              <label htmlFor="room-capacity" className="block text-sm font-medium text-gray-700 mb-1">
                Capacity
              </label>
              <input
                type="number"
                id="room-capacity"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#007AFF] focus:border-[#007AFF] text-gray-900"
                placeholder="Enter capacity"
                min="1"
              />
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007AFF]"
            >
              <Settings className="w-4 h-4 mr-2" />
              Advanced Settings
              {showAdvanced ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </button>

            {showAdvanced && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-200">
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <label htmlFor="room-role" className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      id="room-role"
                      value={advancedSettings.role}
                      onChange={(e) => setAdvancedSettings({ ...advancedSettings, role: e.target.value as any })}
                      className="text-sm text-gray-700 border-0 bg-transparent focus:ring-0 focus:outline-none cursor-pointer pl-2 pr-8 py-0"
                    >
                      <option value="host">Host</option>
                      <option value="attendee">Attendee</option>
                    </select>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <label htmlFor="webrtcAudio" className="block text-sm font-medium text-gray-700">
                        WebRTC Audio
                      </label>
                      <p className="text-xs text-gray-500 mt-0.5">Enable audio streaming via WebRTC</p>
                    </div>
                    <div className="relative inline-block">
                      <input
                        type="checkbox"
                        id="webrtcAudio"
                        checked={advancedSettings.webrtcAudio}
                        onChange={(e) => setAdvancedSettings({ ...advancedSettings, webrtcAudio: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#007AFF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007AFF]"></div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <label htmlFor="webrtcVideo" className="block text-sm font-medium text-gray-700">
                        WebRTC Video
                      </label>
                      <p className="text-xs text-gray-500 mt-0.5">Enable video streaming via WebRTC</p>
                    </div>
                    <div className="relative inline-block">
                      <input
                        type="checkbox"
                        id="webrtcVideo"
                        checked={advancedSettings.webrtcVideo}
                        onChange={(e) => setAdvancedSettings({ ...advancedSettings, webrtcVideo: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#007AFF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007AFF]"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-[#007AFF] hover:bg-[#0066CC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007AFF]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Room
          </button>
        </form>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room ID
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Name
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50/50">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-sm font-mono text-gray-500 truncate max-w-[100px] sm:max-w-[150px]"
                      title={room.id}
                    >
                      {room.id}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-sm font-medium text-gray-900 truncate max-w-[100px] sm:max-w-[200px]"
                      title={room.name}
                    >
                      {room.name}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.capacity}</td>
                  <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {room.created}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => copyRoomLink(room)}
                        className="text-[#007AFF] hover:text-[#0066CC] relative group p-1"
                        title="Copy room link"
                      >
                        <Link className="w-5 h-5" />
                        {copiedId === room.id && (
                          <span className="absolute -top-8 -left-6 px-2 py-1 text-xs text-white bg-gray-800 rounded-md">
                            Copied!
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Delete room"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
