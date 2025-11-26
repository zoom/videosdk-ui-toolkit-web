import React, { useCallback, useContext, useEffect, useState } from "react";
import CommonTab from "../../../components/widget/CommonTab";
import { useAppSelector } from "@/hooks/useAppSelector";
import { StreamContext } from "@/context/stream-context";
import { ClientContext } from "@/context/client-context";
import { CRCProtocol, DialoutState } from "@zoom/videosdk";
import { CallButton, getDialoutStateText } from "./CallButton";

interface RoomSystemTabProps {
  inputClasses: string;
}

export const RoomSystemTab: React.FC<RoomSystemTabProps> = ({ inputClasses }) => {
  const [roomSystemTab, setRoomSystemTab] = useState<"dialIn" | "callOut">("callOut");
  const [ipAddress, setIpAddress] = useState("");
  const [h323Selected, setH323Selected] = useState(true);
  const { callInInfo } = useAppSelector((state) => state.session);
  const { stream } = useContext(StreamContext);
  const client = useContext(ClientContext);

  const [isCalling, setIsCalling] = useState(false);
  const [dialoutState, setDialoutState] = useState<DialoutState | null>(null);
  const [callTimeout, setCallTimeout] = useState<NodeJS.Timeout | null>(null);

  const darkModeTextClasses = "text-theme-text";
  const isCallButtonDisabled = !ipAddress || ipAddress.trim() === "" || isCalling;

  const crcCallOutStateChangeHandler = useCallback(
    (result: { state: DialoutState }) => {
      // eslint-disable-next-line no-console
      console.log("crcCallOutStateChangeHandler", { result });
      setDialoutState(result.state);
      if (
        result.state === DialoutState.Fail ||
        result.state === DialoutState.Canceled ||
        result.state === DialoutState.Timeout
      ) {
        setIsCalling(false);
        if (callTimeout) {
          clearTimeout(callTimeout);
          setCallTimeout(null);
        }
      }
    },
    [callTimeout],
  );

  useEffect(() => {
    client.on("crc-call-out-state-change", crcCallOutStateChangeHandler);
    return () => {
      client.off("crc-call-out-state-change", crcCallOutStateChangeHandler);
    };
  }, [client, crcCallOutStateChangeHandler]);

  useEffect(() => {
    return () => {
      if (callTimeout) {
        clearTimeout(callTimeout);
      }
    };
  }, [callTimeout]);

  const handleCall = () => {
    setIsCalling(true);
    if (h323Selected) {
      stream.callCRCDevice(ipAddress, CRCProtocol.H323);
    } else {
      stream.callCRCDevice(ipAddress, CRCProtocol.SIP);
    }
    const timeout = setTimeout(() => {
      if (dialoutState !== DialoutState.Accepted) {
        setDialoutState(DialoutState.Timeout);
        setIsCalling(false);
      }
    }, 60000);
    setCallTimeout(timeout);
  };

  const handleCancel = () => {
    if (stream) {
      if (h323Selected) {
        stream.cancelCallCRCDevice(ipAddress, CRCProtocol.H323).catch((error) => {
          setDialoutState(error?.reason);
          // eslint-disable-next-line no-console
          console.error("cancelCallCRCDevice error", error);
        });
      } else {
        stream.cancelCallCRCDevice(ipAddress, CRCProtocol.SIP).catch((error) => {
          setDialoutState(error?.reason);
          // eslint-disable-next-line no-console
          console.error("cancelCallCRCDevice error", error);
        });
      }
      setIsCalling(false);
      setDialoutState(DialoutState.Canceled);
      setTimeout(() => {
        setDialoutState(null);
      }, 5000);
      if (callTimeout) {
        clearTimeout(callTimeout);
        setCallTimeout(null);
      }
    }
  };

  const dialInTab = (
    <div className="space-y-4">
      <p className={`text-sm ${darkModeTextClasses}`}>Dial In from a H.323/SIP Room System</p>
      <div>
        <label className={`block text-sm font-medium mb-1 ${darkModeTextClasses}`}>Dial</label>
        <input
          type="text"
          value="127.0.0.1 (US West)"
          readOnly
          className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label className={`block text-sm font-medium mb-1 ${darkModeTextClasses}`}>Enter Meeting ID</label>
        <input
          type="text"
          value={callInInfo?.meetingId}
          readOnly
          className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label className={`block text-sm font-medium mb-1 ${darkModeTextClasses}`}>Passcode</label>
        <input
          type="text"
          value={callInInfo?.password}
          readOnly
          className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
    </div>
  );
  const callOutTab = (
    <div className="space-y-4">
      <p className={`text-sm text-theme-text`}>Call a H.323/SIP Room System:</p>
      <div>
        <input
          type="text"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          placeholder="IP address"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none text-gray-500`}
          disabled={isCalling}
        />
      </div>
      <div className="flex space-x-6 justify-center">
        <label className="flex items-center">
          <input
            type="radio"
            checked={h323Selected}
            onChange={() => setH323Selected(true)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            disabled={isCalling}
          />
          <span className="ml-2 text-sm ">H.323</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            checked={!h323Selected}
            onChange={() => setH323Selected(false)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            disabled={isCalling}
          />
          <span className="ml-2 text-sm ">SIP</span>
        </label>
      </div>

      <CallButton
        isCalling={isCalling}
        isCallButtonDisabled={isCallButtonDisabled}
        onCall={handleCall}
        onCancel={handleCancel}
      />

      {dialoutState && <div className={`text-center ${darkModeTextClasses}`}>{getDialoutStateText(dialoutState)}</div>}
    </div>
  );
  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-4">
        <CommonTab
          tabs={[
            // { name: "dialIn", title: "Dial In" },
            { name: "callOut", title: "Call Out" },
          ]}
          orientation="horizontal"
          className="justify-center px-2 rounded-lg"
          activeTab={roomSystemTab}
          setActiveTab={(tabName) => setRoomSystemTab(tabName as "dialIn" | "callOut")}
        />
      </div>

      {roomSystemTab === "dialIn" ? dialInTab : callOutTab}
    </div>
  );
};
