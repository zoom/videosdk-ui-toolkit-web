import { useCallback, useEffect } from "react";
import { Mic, ChevronDown } from "lucide-react";
import Button from "@/components/widget/CommonButton";
import { useProbe } from "@/features/setting/context/probe-context";
import { useMediaTab } from "../../context/media-tab-context";
import { THEME_COLOR_CLASS } from "@/constant";
import { enqueueSnackbar } from "notistack";

const MediaTab = () => {
  const { prober } = useProbe();

  const {
    selectedCamera,
    setSelectedCamera,
    selectedMic,
    setSelectedMic,
    selectedSpeaker,
    setSelectedSpeaker,

    cameras,
    setCameras,
    microphones,
    setMicrophones,
    speakers,
    setSpeakers,

    isAudioTestRecording,
    setIsAudioTestRecording,

    isPlayingBackForAudioTest,
    setIsPlayingBackForAudioTest,

    renderer,
    setRenderer,
    videoElementRef,
    canvasElementRef,

    isPermissionsError,
    setIsPermissionsError,
  } = useMediaTab();

  const audioTestDuration = 2000;

  const isWebKit = useCallback(() => {
    const ua = navigator.userAgent;
    return (/AppleWebKit/.test(ua) && !/Chrome/.test(ua)) || /\b(iPad|iPhone|iPod)\b/.test(ua);
  }, []);

  const requestMediaDevices = useCallback(() => {
    prober.requestMediaDevices().then((result: any) => {
      const cameraList = result.devices.filter((el: { kind: string }) => el.kind === "videoinput");
      const micList = result.devices.filter((el: { kind: string }) => el.kind === "audioinput");
      const speakerList = result.devices.filter((el: { kind: string }) => el.kind === "audiooutput");

      setCameras(cameraList);
      setMicrophones(micList);
      setSpeakers(speakerList);

      if (selectedCamera === "") {
        setSelectedCamera(cameraList[0].deviceId);
      }

      if (selectedMic === "") {
        setSelectedMic(micList[0].deviceId);
      }

      if (selectedSpeaker === "") {
        setSelectedSpeaker(speakerList[0].deviceId);
      }
    });
  }, [
    prober,
    setCameras,
    setMicrophones,
    setSpeakers,
    selectedCamera,
    selectedMic,
    selectedSpeaker,
    setSelectedCamera,
    setSelectedMic,
    setSelectedSpeaker,
  ]);

  const getMediaPermission = useCallback(() => {
    prober.requestMediaDevicePermission({ audio: true, video: true }).then((result) => {
      if (result.error) {
        setIsPermissionsError(true);
      } else {
        setIsPermissionsError(false);
        requestMediaDevices();
      }
    });
  }, [prober, requestMediaDevices, setIsPermissionsError]);

  useEffect(() => {
    getMediaPermission();
  }, [getMediaPermission]);

  const runAudioTest = () => {
    const audioInputConstraint = {
      audio: { deviceId: selectedMic },
      video: false,
    };
    const audioOutputConstraint = {
      audio: { deviceId: selectedSpeaker },
      video: false,
    };

    setIsAudioTestRecording(true);
    setTimeout(() => {
      setIsAudioTestRecording(false);
      setIsPlayingBackForAudioTest(true);
      setTimeout(() => {
        setIsPlayingBackForAudioTest(false);
      }, audioTestDuration);
    }, audioTestDuration);

    prober.diagnoseAudio(audioInputConstraint, audioOutputConstraint, audioTestDuration);
  };

  useEffect(() => {
    let currentStream = null;
    const options = {
      rendererType: renderer,
      target: renderer === 1 ? videoElementRef.current : canvasElementRef.current,
    };
    const constraint = {
      video: {
        deviceId: selectedCamera,
      },
    };

    const startDiagnostic = async () => {
      try {
        const diagnostic = await prober.diagnoseVideo(constraint, options);

        if (diagnostic.code !== 0) {
          enqueueSnackbar({
            message: `Failed to diagnose video: ${diagnostic.message}`,
            variant: "error",
          });
          return;
        }

        currentStream = diagnostic.stream;
      } catch (error) {
        enqueueSnackbar({
          message: `Diagnose Video Threw an Error: ${error.message}`,
          variant: "error",
        });
      }
    };

    startDiagnostic();

    return () => {
      prober.stopToDiagnoseVideo(currentStream);
    };
  }, [canvasElementRef, prober, renderer, selectedCamera, videoElementRef]);

  const selectClass = `${THEME_COLOR_CLASS} w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none`;

  if (isPermissionsError) {
    return (
      <div className="flex-grow p-6 overflow-auto">
        <h2 className="text-2xl font-bold mb-6">Permissions Error</h2>
        <p className="">Please enable microphone and camera access in your browser settings.</p>
        <Button onClick={getMediaPermission} variant="primary" size="sm" className="px-4">
          Retry Permissions
        </Button>
      </div>
    );
  } else {
    return (
      <div className="flex-grow p-6 overflow-auto">
        <div id="video-section" className="mb-6 space-y-3">
          <div id="video-preview" className="w-full h-full flex justify-center items-center">
            <video
              autoPlay
              playsInline
              ref={videoElementRef}
              id="local_preview_video"
              style={{ width: "100%", aspectRatio: "16/9" }}
              hidden={renderer !== 1}
            />
            <canvas
              key={renderer}
              ref={canvasElementRef}
              id="local_preview_canvas"
              style={{ width: "100%", aspectRatio: "16/9", objectFit: "contain" }}
              hidden={renderer === 1}
            ></canvas>
          </div>
          <div id="camera-select" className="relative">
            <div className="flex items-center">
              <label htmlFor="video-input-select" className="w-1/4 text-sm font-medium ">
                Camera:
              </label>
              <div className="w-3/4 relative">
                <select
                  id="video-input-select"
                  className={selectClass}
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                >
                  {cameras.map(({ label, deviceId }) => (
                    <option key={deviceId} value={deviceId}>
                      {label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>
          <div id="renderer-select" className="relative">
            <div className="flex items-center">
              <label htmlFor="video-renderer-select" className="w-1/4 text-sm font-medium ">
                Renderer:
              </label>
              <div className="w-3/4 relative">
                <select
                  id="video-renderer-select"
                  className={selectClass}
                  value={renderer}
                  onChange={(e) => setRenderer(parseInt(e.target.value))}
                >
                  <option value={1}>Video Tag</option>
                  <option value={2}>WebGL</option>
                  <option value={3}>WebGL2</option>
                  <option value={4}>WebGPU</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="audio-section" className="mb-6 space-y-3">
          <div id="start-audio-test" className="flex items-center justify-between">
            <Button
              variant={isAudioTestRecording ? "danger" : "primary"}
              disabled={isAudioTestRecording || isPlayingBackForAudioTest}
              size="md"
              className="px-4"
              onClick={runAudioTest}
            >
              {isAudioTestRecording ? (
                "Recording..."
              ) : isPlayingBackForAudioTest ? (
                "Playing..."
              ) : (
                <div className="flex space-x-2">
                  <Mic className="h-5 w-5" />
                  <p>Test audio</p>
                </div>
              )}
            </Button>
          </div>
          <div id="microphone-select" className="relative">
            <div className="flex items-center">
              <label htmlFor="audio-input-select" className="w-1/4 text-sm font-medium ">
                Microphone:
              </label>
              <div className="w-3/4 relative">
                <select
                  id="audio-input-select"
                  className={selectClass}
                  value={selectedMic}
                  onChange={(e) => setSelectedMic(e.target.value)}
                >
                  {microphones.map(({ label, deviceId }) => (
                    <option key={deviceId} value={deviceId}>
                      {label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>
          <div id="speaker-select" className="relative">
            <div className="flex items-center">
              <label htmlFor="audio-output-select" className="w-1/4 text-sm font-medium ">
                Speaker:
              </label>
              <div className="w-3/4 relative">
                {speakers.length === 0 && isWebKit() ? (
                  <p className="mt-1 text-sm text-gray-600">
                    Speakers may not be selectable in Apple browsers. Switch speakers in your device settings.
                  </p>
                ) : (
                  <>
                    <select
                      id="audio-output-select"
                      className={selectClass}
                      value={selectedSpeaker}
                      onChange={(e) => setSelectedSpeaker(e.target.value)}
                    >
                      {speakers.map(({ label, deviceId }) => (
                        <option key={deviceId} value={deviceId}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                      <ChevronDown size={16} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default MediaTab;
