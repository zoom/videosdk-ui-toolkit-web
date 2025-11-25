import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useProbe } from "./probe-context";

interface MediaTabContextType {
  isPermissionsError: boolean;
  setIsPermissionsError: React.Dispatch<React.SetStateAction<boolean>>;

  isAudioTestRecording: boolean;
  setIsAudioTestRecording: React.Dispatch<React.SetStateAction<boolean>>;
  isPlayingBackForAudioTest: boolean;
  setIsPlayingBackForAudioTest: React.Dispatch<React.SetStateAction<boolean>>;

  videoElementRef: React.RefObject<HTMLVideoElement>;
  canvasElementRef: React.RefObject<HTMLCanvasElement>;

  setSelectedMic: React.Dispatch<React.SetStateAction<string>>;
  setSelectedSpeaker: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCamera: React.Dispatch<React.SetStateAction<string>>;
  setRenderer: React.Dispatch<React.SetStateAction<number>>;

  microphones: { deviceId: string; kind: string; label: string }[];
  speakers: { deviceId: string; kind: string; label: string }[];
  cameras: { deviceId: string; label: string; kind: string }[];

  setMicrophones: React.Dispatch<React.SetStateAction<{ deviceId: string; kind: string; label: string }[]>>;
  setSpeakers: React.Dispatch<React.SetStateAction<{ deviceId: string; kind: string; label: string }[]>>;
  setCameras: React.Dispatch<React.SetStateAction<{ deviceId: string; label: string; kind: string }[]>>;

  selectedMic: string;
  selectedSpeaker: string;
  selectedCamera: string;
  renderer: number;
}

// Default context value can be initialized as null if you will check for the existence of the context in your components
const MediaTabContext = React.createContext<MediaTabContextType | null>(null);

export const MediaTabProvider = ({ children }) => {
  const { prober } = useProbe();

  const [selectedCamera, setSelectedCamera] = useState("");
  const [selectedMic, setSelectedMic] = useState("");
  const [selectedSpeaker, setSelectedSpeaker] = useState("");

  const [cameras, setCameras] = useState([]);
  const [microphones, setMicrophones] = useState([]);
  const [speakers, setSpeakers] = useState([]);

  const [isAudioTestRecording, setIsAudioTestRecording] = useState(false);
  const [isPlayingBackForAudioTest, setIsPlayingBackForAudioTest] = useState(false);

  const [renderer, setRenderer] = useState(1);
  const videoElementRef = useRef(null);
  const canvasElementRef = useRef(null);

  const [isPermissionsError, setIsPermissionsError] = useState(false);

  return (
    <MediaTabContext.Provider
      value={{
        isPermissionsError,
        videoElementRef,
        canvasElementRef,
        renderer,
        setRenderer,
        selectedCamera,
        setSelectedCamera,
        cameras,
        isAudioTestRecording,
        isPlayingBackForAudioTest,
        selectedMic,
        setSelectedMic,
        microphones,
        selectedSpeaker,
        setSelectedSpeaker,
        speakers,
        setMicrophones,
        setSpeakers,
        setCameras,
        setIsPermissionsError,
        setIsAudioTestRecording,
        setIsPlayingBackForAudioTest,
      }}
    >
      {children}
    </MediaTabContext.Provider>
  );
};

export const useMediaTab = () => {
  return useContext(MediaTabContext);
};
