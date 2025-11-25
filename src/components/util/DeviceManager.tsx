import ZoomVideo from "@zoom/videosdk";
import { isEmpty } from "lodash";
import emitter from "mitt";

import { MediaStream } from "@/types";
export function isMicDeviceValid(deviceId, deviceLabel) {
  const preCondiditon = deviceId !== "communications";

  return (
    preCondiditon &&
    !/ZoomAudioDevice/i.test(deviceLabel) &&
    !/Zoom-\S*/.test(deviceLabel) &&
    !/CubebAggregateDevice\S*/.test(deviceLabel) &&
    !/Microsoft Teams Audio Device/i.test(deviceLabel)
  );
}

export function isSpeakerDeviceValid(deviceId, deviceLabel) {
  const preCondiditon = deviceId !== "communications";

  return preCondiditon && !/ZoomAudioDevice/i.test(deviceLabel) && !/Microsoft Teams Audio Device/i.test(deviceLabel);
}

interface MediaDeviceInfo {
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/MediaDeviceInfo/deviceId) */
  deviceId: string;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/MediaDeviceInfo/groupId) */
  groupId: string;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/MediaDeviceInfo/kind) */
  kind: MediaDeviceKind;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/MediaDeviceInfo/label) */
  label: string;
}

interface DeviceState {
  microphones: MediaDeviceInfo[];
  speakers: MediaDeviceInfo[];
  cameras: MediaDeviceInfo[];
  activeMicrophone: string;
  activeSpeaker: string;
  activeCamera: string;
}

interface DeviceManagerConfig {
  labelForDefaultDevice: string;
}

interface DeviceSelectedEvent {
  activeMicrophone?: string;
  activeSpeaker?: string;
  activeCamera?: string;
}

interface StorageDevice {
  deviceId: string;
  label: string;
}

const isDev = false;
const UNKNOWN_MIC = "Unrecognized microphone";
const UNKNOWN_SPEAKER = "Unrecognized speaker";
const UNKNOWN_CAMERA = "Unrecognized camera";

export const DeviceManagerEvents = {
  INIT_SUCCESS: "INIT_SUCCESS",
  INIT_FAIL: "INIT_FAIL",
  DEVICE_CHANGED: "DEVICE_CHANGED",
  DEVICE_PERMISSION_MAY_GRANT: "DEVICE_PERMISSION_MAY_GRANT",
  DEVICE_SELECTED: "DEVICE_SELECTED",
} as const;

type EventType = (typeof DeviceManagerEvents)[keyof typeof DeviceManagerEvents];

const STORAGE_KEY = {
  selectedMicrophoneId: "activeMicrophoneDeviceId",
  selectedMicrophoneLabel: "activeMicrophoneLabel",
  selectedSpeakerId: "activeSpeakerDeviceId",
  selectedSpeakerLabel: "activeSpeakerLabel",
  selectedCameraId: "activeCameraDeviceId",
  selectedCameraLabel: "activeCameraDeviceLabel",
} as const;

const SAME_AS_SYSTEM = "Same as System";
class DeviceManager {
  private static _instance: DeviceManager | null = null;
  private _eb: any;
  private _labelForDefaultDevice: string;
  private _deviceMap: Map<string, MediaDeviceInfo>;
  private _microphoneIdList: string[];
  private _speakerIdList: string[];
  private _cameraIdList: string[];
  private _activeMicrophone: string;
  private _activeSpeaker: string;
  private _activeCamera: string;
  private _initComplete: boolean;
  private _isMicrophoneAuthorized: boolean;
  private _isCameraAuthorized: boolean;
  private _skipPermissionCheck: boolean;

  private constructor({ labelForDefaultDevice }: DeviceManagerConfig) {
    this._eb = emitter();
    this._labelForDefaultDevice = labelForDefaultDevice;
    this._deviceMap = new Map();
    this._microphoneIdList = [];
    this._speakerIdList = [];
    this._cameraIdList = [];
    this._activeMicrophone = "default";
    this._activeSpeaker = "default";
    this._activeCamera = "default";
    this._initComplete = false;
    this._isMicrophoneAuthorized = false;
    this._isCameraAuthorized = false;
    this._skipPermissionCheck = true;
  }

  public static getInstance(): DeviceManager {
    if (!DeviceManager._instance) {
      DeviceManager._instance = new DeviceManager({ labelForDefaultDevice: SAME_AS_SYSTEM });
    }
    return DeviceManager._instance;
  }

  static getDeviceKey(kind: string, deviceId: string): string {
    return `${kind}:${deviceId}`;
  }

  static isSameDevice(deviceA: MediaDeviceInfo | null, deviceB: MediaDeviceInfo | null): boolean {
    if (!deviceA || !deviceB) {
      return false;
    }
    return deviceA.deviceId === deviceB.deviceId && deviceA.label === deviceB.label;
  }

  init(): void {
    navigator.mediaDevices.ondevicechange = async (payload) => {
      this._enumerateDevice().then((devices) => {
        this._updateDevices(devices);
        this._updateActiveDevices();
        this.emit(DeviceManagerEvents.DEVICE_CHANGED, this.getDeviceState());
      });
    };

    this._enumerateDevice()
      .then((devices) => {
        this._updateDevices(devices);
        this._updateActiveDevices();
        this.emit(DeviceManagerEvents.INIT_SUCCESS, this.getDeviceState());
      })
      .catch((err) => {
        this.emit(DeviceManagerEvents.INIT_FAIL, err);
      })
      .finally(() => {
        this._initComplete = true;
      });

    this.on(DeviceManagerEvents.DEVICE_PERMISSION_MAY_GRANT, () => {
      if (!this._isMicrophoneAuthorized || !this._isCameraAuthorized) {
        this._enumerateDevice().then((devices) => {
          this._updateDevices(devices);
          if (this._isMicrophoneAuthorized || this._isCameraAuthorized) {
            this.emit(DeviceManagerEvents.DEVICE_CHANGED, this.getDeviceState());
          }
        });
      }
    });
  }

  private async _enumerateDevice(): Promise<MediaDeviceInfo[]> {
    if (typeof navigator.mediaDevices !== "object") {
      return Promise.resolve([]);
    }
    try {
      const devices = await ZoomVideo.getDevices(this._skipPermissionCheck);
      if (devices?.length > 0) {
        this._skipPermissionCheck = true;
      }
      return devices;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error getting devices", err);
      return [];
    }
  }

  private _updateDevices(devices: MediaDeviceInfo[]): void {
    this._microphoneIdList = [];
    this._speakerIdList = [];
    this._cameraIdList = [];
    this._deviceMap.clear();

    let defaultMicrophone: string | undefined, defaultSpeaker: string | undefined, defaultCamera: string | undefined;

    devices.forEach((device) => {
      const { kind, deviceId, label } = device;
      const deviceObj = { kind, deviceId, label, groupId: device.groupId };

      if (kind === "audioinput" && isMicDeviceValid(deviceId, label)) {
        this._microphoneIdList.push(deviceId);
        if (!isEmpty(deviceId) && !isEmpty(label)) {
          this._isMicrophoneAuthorized = true;
        }
        if (deviceId === "default") {
          defaultMicrophone = deviceId;
        }
        if (!deviceObj.label) {
          deviceObj.label = `${UNKNOWN_MIC}${this._microphoneIdList.length}`;
        }
      }
      if (kind === "audiooutput" && isSpeakerDeviceValid(deviceId, label)) {
        this._speakerIdList.push(deviceId);
        if (deviceId === "default") {
          defaultSpeaker = deviceId;
        }
        if (!deviceObj.label) {
          deviceObj.label = `${UNKNOWN_SPEAKER}${this._speakerIdList.length}`;
        }
      }
      if (kind === "videoinput") {
        this._cameraIdList.push(deviceId);
        if (deviceId === "default") {
          defaultCamera = deviceId;
        }
        if (!isEmpty(deviceId) && !isEmpty(label)) {
          this._isCameraAuthorized = true;
        }
        if (!deviceObj.label) {
          deviceObj.label = `${UNKNOWN_CAMERA}${this._cameraIdList.length}`;
        }
      }

      this._setDevice(kind, deviceId, deviceObj as MediaDeviceInfo);
    });

    if (!defaultMicrophone) {
      this._setDevice("audioinput", "default", {
        kind: "audioinput",
        deviceId: "default",
        label: this._labelForDefaultDevice,
        groupId: "",
      } as MediaDeviceInfo);
      this._microphoneIdList.unshift("default");
    }
    if (!defaultSpeaker) {
      this._setDevice("audiooutput", "default", {
        kind: "audiooutput",
        deviceId: "default",
        label: this._labelForDefaultDevice,
        groupId: "",
      } as MediaDeviceInfo);
      this._speakerIdList.unshift("default");
    }
    if (!defaultCamera) {
      this._setDevice("videoinput", "default", {
        kind: "videoinput",
        deviceId: "default",
        label: this._labelForDefaultDevice,
        groupId: "",
      } as MediaDeviceInfo);
      this._cameraIdList.unshift("default");
    }
  }

  private _updateActiveDevices(): void {
    const kinds = ["audioinput", "audiooutput", "videoinput"] as const;
    kinds.forEach((kind) => {
      const activeDeviceId = this._getActiveDeviceIdByKind(kind);
      const selectedDevice = this._getManuallySelectedDevice(kind);
      const deviceIdList = this._getDeviceListByKind(kind);

      if (selectedDevice && this._hasDevice(kind, selectedDevice.deviceId)) {
        this._setActiveDeviceIdByKind(kind, selectedDevice.deviceId);
      } else if (!this._hasDevice(kind, activeDeviceId)) {
        this._setActiveDeviceIdByKind(kind, deviceIdList[0]);
      }
    });
  }

  getDeviceState(): DeviceState {
    return {
      microphones: this._microphoneIdList.map((deviceId) => this._getDevice("audioinput", deviceId)),
      speakers: this._speakerIdList.map((deviceId) => this._getDevice("audiooutput", deviceId)),
      cameras: this._cameraIdList.map((deviceId) => this._getDevice("videoinput", deviceId)),
      activeMicrophone: this._activeMicrophone,
      activeSpeaker: this._activeSpeaker,
      activeCamera: this._activeCamera,
    };
  }

  isInitComplete(): boolean {
    return this._initComplete;
  }

  emit(event: EventType, payload: unknown): void {
    this._eb.emit(event, payload);
  }

  on(event: EventType, handler: (payload: unknown) => void): void {
    this._eb.on(event, handler);
  }

  off(event: EventType, handler: (payload: unknown) => void): void {
    this._eb.off(event, handler);
  }

  private _setManuallySelectedDevice(kind: string, deviceId: string): void {
    if (!this._hasDevice(kind, deviceId)) {
      if (isDev) {
        throw Error(`device with id ${deviceId} not exist!`);
      }
      return;
    }
    const device = this._getDevice(kind, deviceId);
    if (device.kind === "audioinput") {
      localStorage.setItem(STORAGE_KEY.selectedMicrophoneId, deviceId);
      localStorage.setItem(STORAGE_KEY.selectedMicrophoneLabel, device.label);
    } else if (device.kind === "audiooutput") {
      localStorage.setItem(STORAGE_KEY.selectedSpeakerId, deviceId);
      localStorage.setItem(STORAGE_KEY.selectedSpeakerLabel, device.label);
    } else if (device.kind === "videoinput") {
      localStorage.setItem(STORAGE_KEY.selectedCameraId, deviceId);
      localStorage.setItem(STORAGE_KEY.selectedCameraLabel, device.label);
    }
  }

  private _getManuallySelectedDevice(kind: string): StorageDevice | null {
    let deviceId: string | null, label: string | null;
    if (kind === "audioinput") {
      deviceId = localStorage.getItem(STORAGE_KEY.selectedMicrophoneId);
      label = localStorage.getItem(STORAGE_KEY.selectedMicrophoneLabel);
    } else if (kind === "audiooutput") {
      deviceId = localStorage.getItem(STORAGE_KEY.selectedSpeakerId);
      label = localStorage.getItem(STORAGE_KEY.selectedSpeakerLabel);
    } else if (kind === "videoinput") {
      deviceId = localStorage.getItem(STORAGE_KEY.selectedCameraId);
      label = localStorage.getItem(STORAGE_KEY.selectedCameraLabel);
    }
    if (!deviceId || !label) {
      return null;
    }
    return { deviceId, label };
  }

  manuallySelectSpeaker(deviceId: string): void {
    this._setManuallySelectedDevice("audiooutput", deviceId);
    this._activeSpeaker = deviceId;
    this.emit(DeviceManagerEvents.DEVICE_SELECTED, { activeSpeaker: deviceId });
  }

  manuallySelectMicrophone(deviceId: string): void {
    this._setManuallySelectedDevice("audioinput", deviceId);
    this._activeMicrophone = deviceId;
    this.emit(DeviceManagerEvents.DEVICE_SELECTED, { activeMicrophone: deviceId });
  }

  manuallySelectCamera(deviceId: string): void {
    this._setManuallySelectedDevice("videoinput", deviceId);
    this._activeCamera = deviceId;
    this.emit(DeviceManagerEvents.DEVICE_SELECTED, { activeCamera: deviceId });
  }

  private _getDeviceListByKind(kind: string): string[] {
    if (kind === "audioinput") {
      return this._microphoneIdList;
    } else if (kind === "audiooutput") {
      return this._speakerIdList;
    } else if (kind === "videoinput") {
      return this._cameraIdList;
    } else {
      return [];
    }
  }

  private _getActiveDeviceIdByKind(kind: string): string {
    if (kind === "audioinput") {
      return this._activeMicrophone;
    } else if (kind === "audiooutput") {
      return this._activeSpeaker;
    } else if (kind === "videoinput") {
      return this._activeCamera;
    } else {
      return "";
    }
  }

  private _setActiveDeviceIdByKind(kind: string, deviceId: string): void {
    if (kind === "audioinput") {
      this._activeMicrophone = deviceId;
    } else if (kind === "audiooutput") {
      this._activeSpeaker = deviceId;
    } else if (kind === "videoinput") {
      this._activeCamera = deviceId;
    }
  }

  private _hasDevice(kind: string, deviceId: string): boolean {
    return this._deviceMap.has(DeviceManager.getDeviceKey(kind, deviceId));
  }

  private _getDevice(kind: string, deviceId: string): MediaDeviceInfo {
    return this._deviceMap.get(DeviceManager.getDeviceKey(kind, deviceId))!;
  }

  private _setDevice(kind: string, deviceId: string, device: MediaDeviceInfo): void {
    this._deviceMap.set(DeviceManager.getDeviceKey(kind, deviceId), device);
  }

  watchInitComplete() {
    return new Promise((resolve, reject) => {
      if (this.isInitComplete()) {
        resolve(this.getDeviceState());
      } else {
        this.on(DeviceManagerEvents.INIT_SUCCESS, resolve);
        this.on(DeviceManagerEvents.INIT_FAIL, reject);
      }
    });
  }
}

const instance = DeviceManager.getInstance();

export default instance;
