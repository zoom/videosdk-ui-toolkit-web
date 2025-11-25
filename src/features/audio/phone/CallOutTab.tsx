import { ClientContext } from "@/context/client-context";
import { StreamContext } from "@/context/stream-context";
import { useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { DialoutState } from "@zoom/videosdk";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Select from "react-select";
import { CallButton, getDialoutStateText } from "./CallButton";
import { useCurrentUser } from "@/features/participant/hooks";
import { CommonSelectStyle } from "@/components/widget/CommonSelectStyle";

interface CallOutTabProps {
  inputClasses: string;
  darkModeTextClasses: string;
}

const MAX_PHONE_LENGTH = 15; // Standard maximum length for international numbers

interface CountryOption {
  label: string;
  value: string;
  countryName: string;
}

export const CallOutTab: React.FC<CallOutTabProps> = ({ inputClasses, darkModeTextClasses }) => {
  const [inviteeName, setInviteeName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [requireGreeting, setRequireGreeting] = useState(true);
  const [requirePressing1, setRequirePressing1] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);
  const [callMe, setCallMe] = useState(false);
  const { callOutCountry } = useAppSelector(useSessionSelector);
  const { themeName } = useAppSelector(useSessionUISelector);
  const currentUser = useCurrentUser();
  const { stream } = useContext(StreamContext);
  const client = useContext(ClientContext);
  const isCallButtonDisabled = !phoneNumber || phoneNumber.trim() === "" || !selectedCountry;

  const [isCalling, setIsCalling] = useState(false);
  const [dialoutState, setDialoutState] = useState<DialoutState | null>(null);
  const [callTimeout, setCallTimeout] = useState<NodeJS.Timeout | null>(null);

  const formatPhoneNumber = (value: string): string => {
    // Group numbers in a readable format: XXX-XXX-XXXX
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})(\d*)$/);

    if (!match) return "";

    const parts = [match[1], match[2], match[3]].filter(Boolean);
    return parts.join("-") + (match[4] ? `-${match[4]}` : "");
  };

  const convertFullWidthToHalfWidth = (str: string): string => {
    return str.replace(/[\uFF10-\uFF19]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xff10 + 0x30));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Convert full-width numbers to half-width first
    const convertedInput = convertFullWidthToHalfWidth(input);
    const numbersOnly = convertedInput.replace(/\D/g, "");

    if (numbersOnly.length <= MAX_PHONE_LENGTH) {
      const formattedNumber = formatPhoneNumber(numbersOnly);
      setPhoneNumber(formattedNumber);
    }
  };

  const handleCountryCodeChange = (option: CountryOption | null) => {
    setSelectedCountry(option);
  };

  const phoneNumberDialOutResultHandler = useCallback(
    (result: { state: DialoutState }) => {
      // eslint-disable-next-line no-console
      console.log("phoneNumberDialOutResultHandler", { result });
      setDialoutState(result.state);
      if (
        result.state === DialoutState.Fail ||
        result.state === DialoutState.Canceled ||
        result.state === DialoutState.Timeout
      ) {
        setIsCalling(false);
        // Clear timeout if call ends before timeout
        if (callTimeout) {
          clearTimeout(callTimeout);
          setCallTimeout(null);
        }
      }
    },
    [callTimeout],
  );

  useEffect(() => {
    client.on("dialout-state-change", phoneNumberDialOutResultHandler);
    return () => {
      client.off("dialout-state-change", phoneNumberDialOutResultHandler);
    };
  }, [client, phoneNumberDialOutResultHandler]);

  useEffect(() => {
    return () => {
      if (callTimeout) {
        clearTimeout(callTimeout);
      }
    };
  }, [callTimeout]);

  const handleCancel = () => {
    if (stream && selectedCountry) {
      stream.cancelInviteByPhone(selectedCountry.value, phoneNumber.replace(/-/g, ""));
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

  const handleCall = () => {
    if (!selectedCountry) return;

    setIsCalling(true);
    stream?.inviteByPhone(selectedCountry.value, phoneNumber.replace(/-/g, ""), inviteeName, {
      greeting: requireGreeting,
      pressingOne: requirePressing1,
      callMe: callMe,
    });

    const timeout = setTimeout(() => {
      if (dialoutState !== DialoutState.Accepted) {
        setDialoutState(DialoutState.Timeout);
        setIsCalling(false);
      }
    }, 60000);
    setCallTimeout(timeout);
  };

  useEffect(() => {
    if (callMe) {
      setInviteeName(currentUser?.displayName || "");
    } else {
      setInviteeName("");
    }
  }, [callMe, currentUser]);

  return (
    <div className="space-y-6">
      <div>
        <label className={`block text-sm font-medium mb-1 ${darkModeTextClasses}`}>Invitee Name</label>
        <input
          type="text"
          value={inviteeName}
          maxLength={140}
          onChange={(e) => setInviteeName(e.target.value)}
          disabled={callMe}
          placeholder="Name to be displayed in the meeting"
          className={`${callMe ? "opacity-50 cursor-not-allowed" : ""} w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none text-gray-500`}
        />
      </div>
      <div>
        <label className={`block text-sm font-medium mb-1 ${darkModeTextClasses}`}>Phone Number</label>
        <div className="flex">
          <Select<CountryOption>
            options={callOutCountry.map((country) => ({
              label: `${country.name} (${country.code})`,
              value: country.code,
              countryName: country.name,
            }))}
            value={selectedCountry}
            onChange={handleCountryCodeChange}
            className={`w-1/2 mr-2 rounded-lg`}
            classNamePrefix="rounded-lg uikit-custom-scrollbar"
            noOptionsMessage={() => "No found your country code"}
            placeholder="Select country"
            styles={CommonSelectStyle({ themeName })}
          />
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            className={`focus:ring-2 focus:ring-blue-500 w-1/2 border rounded border-gray-300 text-gray-500`}
            placeholder="XXX-XXX-XXXX"
            pattern="[0-9-]*"
            inputMode="numeric"
            maxLength={MAX_PHONE_LENGTH} // Account for hyphens
            aria-label="Phone number"
          />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium  mb-2">Invite Options</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={requireGreeting}
              onChange={() => setRequireGreeting(!requireGreeting)}
              className="h-4 w-4  focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm ">Require greeting before being connected</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={requirePressing1}
              onChange={() => setRequirePressing1(!requirePressing1)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm ">Require pressing 1 before being connected</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={callMe}
              onChange={() => setCallMe(!callMe)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm ">Call me instead of the invitee (phone audio is bound to current user)</span>
          </label>
        </div>
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
};
