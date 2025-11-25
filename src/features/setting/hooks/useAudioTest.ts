import { useState, useEffect, useCallback, useRef } from "react";
import ZoomVideo, { TestMicrophoneReturn, TestSpeakerReturn } from "@zoom/videosdk";
import { useTranslation } from "react-i18next";

export function useAudioTest(activeSpeaker: string, activeMicrophone: string) {
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [inputLevel, setInputLevel] = useState(0);
  const [outputLevel, setOutputLevel] = useState(0);
  const { t } = useTranslation();
  const testMicButtonTextDefault = t("settings.test_mic");
  const testSpeakerButtonTextDefault = t("settings.test_speaker");
  const [testMicButtonText, setTestMicButtonText] = useState<string>(testMicButtonTextDefault);
  const [testSpeakerButtonText, setTestSpeakerButtonText] = useState<string>(testSpeakerButtonTextDefault);

  const speakerTesterRef = useRef<TestSpeakerReturn>();
  const microphoneTesterRef = useRef<TestMicrophoneReturn>();

  const localAudio = ZoomVideo.createLocalAudioTrack();

  const onTestMicrophoneClick = useCallback(() => {
    if (speakerTesterRef.current) {
      speakerTesterRef.current.destroy();
      speakerTesterRef.current = undefined;
      setOutputLevel(0);
      setIsPlayingAudio(false);
      setTestSpeakerButtonText(testMicButtonText);
    }
    if (!isPlayingRecording && !isRecordingVoice) {
      microphoneTesterRef.current = localAudio.testMicrophone({
        microphoneId: activeMicrophone,
        speakerId: activeSpeaker,
        recordAndPlay: true,
        onAnalyseFrequency: (value) => {
          setInputLevel(Math.min(100, value));
        },
        onStartRecording: () => {
          setIsRecordingVoice(true);
          setTestMicButtonText(t("settings.recording"));
        },
        onStartPlayRecording: () => {
          setIsRecordingVoice(false);
          setIsPlayingRecording(true);
          setTestMicButtonText(t("settings.playing"));
        },
        onStopPlayRecording: () => {
          setIsPlayingRecording(false);
          setTestMicButtonText(testMicButtonTextDefault);
        },
      });
    } else if (isRecordingVoice) {
      microphoneTesterRef.current?.stopRecording();
      setIsRecordingVoice(false);
    } else if (isPlayingRecording) {
      microphoneTesterRef.current?.stop();
      setIsPlayingRecording(false);
      setInputLevel(0);
    }
  }, [
    activeMicrophone,
    activeSpeaker,
    isPlayingRecording,
    isRecordingVoice,
    localAudio,
    t,
    testMicButtonText,
    testMicButtonTextDefault,
  ]);

  const onTestSpeakerClick = useCallback(() => {
    if (microphoneTesterRef.current) {
      microphoneTesterRef.current.destroy();
      microphoneTesterRef.current = undefined;
      setTestMicButtonText(t("settings.test_mic"));
      setInputLevel(0);
      setIsRecordingVoice(false);
      setIsPlayingRecording(false);
    }
    if (isPlayingAudio) {
      speakerTesterRef.current?.stop();
      setIsPlayingAudio(false);
      setOutputLevel(0);
      setTestSpeakerButtonText(t("settings.test_speaker"));
    } else {
      speakerTesterRef.current = localAudio.testSpeaker({
        speakerId: activeSpeaker,
        onAnalyseFrequency: (value) => {
          setOutputLevel(Math.min(100, value));
        },
      });
      setIsPlayingAudio(true);
      setTestSpeakerButtonText(t("settings.stop"));
    }
  }, [activeSpeaker, isPlayingAudio, localAudio, t]);

  useEffect(() => {
    return () => {
      if (microphoneTesterRef.current) {
        microphoneTesterRef.current.destroy();
        microphoneTesterRef.current = undefined;
      }
      if (speakerTesterRef.current) {
        speakerTesterRef.current.destroy();
        speakerTesterRef.current = undefined;
      }
    };
  }, []);

  return {
    testSpeakerButtonText,
    testMicButtonText,
    inputLevel,
    outputLevel,
    onTestSpeakerClick,
    onTestMicrophoneClick,
  };
}
