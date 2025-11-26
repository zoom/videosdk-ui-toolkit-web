import React, { useState } from "react";
import Select from "react-select";
import { Phone, Hash, Users, Lock } from "lucide-react";
import { TollNumber } from "./types";
import { useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import { THEME_COLOR_CLASS } from "@/constant/ui-constant";
import { CommonSelectStyle } from "@/components/widget/CommonSelectStyle";

interface StepNumberProps {
  number: number;
}

interface InfoRowProps {
  label: string;
  value: string;
  icon: React.ElementType;
}

const StepNumber: React.FC<StepNumberProps> = ({ number }) => (
  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-theme-background text-theme-text text-sm font-medium">
    {number}
  </div>
);

const InfoRow: React.FC<InfoRowProps> = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between p-3 bg-theme-background rounded-xl">
    <div className="flex items-center space-x-3">
      <Icon className="w-4 h-4 text-theme-text" />
      <span className="text-sm text-theme-text">{label}</span>
    </div>
    <div className="flex items-center space-x-2">
      <span className="text-theme-text font-mono">{value}</span>
      <Hash className="w-4 h-4 text-theme-text" />
    </div>
  </div>
);

interface CallInTabProps {
  inputClasses: string;
}

export const CallInTab: React.FC<CallInTabProps> = ({ inputClasses }) => {
  const { callInInfo } = useAppSelector(useSessionSelector);
  const { themeName } = useAppSelector(useSessionUISelector);

  // Modified country options creation to include country code in the label
  const countryOptions = Object.values(
    callInInfo.tollNumbers.reduce((acc, number) => {
      const countryKey = number.countryName;
      if (!acc[countryKey]) {
        // Extract country code from the displayNumber
        // eslint-disable-next-line prefer-destructuring
        const countryCode = number.displayNumber.split(" ")[0];
        acc[countryKey] = {
          value: number.country,
          // Include country code in the label
          label: `${number.countryName}`,
          countryCode: countryCode,
          numbers: [],
        };
      }
      acc[countryKey].numbers.push(number);
      return acc;
    }, {}),
  );

  // Find US option and set as default
  const defaultCountry: any = countryOptions.find((option: any) => option?.value === "US") || null;
  const [selectedCountry, setSelectedCountry] = useState<TollNumber | null>(defaultCountry);

  // Set default number if US is found
  const defaultNumber = defaultCountry?.numbers?.[0]
    ? {
        value: defaultCountry.numbers[0].number,
        label: `${defaultCountry.numbers[0].displayNumber} (${defaultCountry.numbers[0].dc}) ${defaultCountry.numbers[0].free ? "(Toll-Free)" : ""}`,
        dc: defaultCountry.numbers[0].dc,
        country: defaultCountry.numbers[0].country,
        countryName: defaultCountry.numbers[0].countryName,
        number: defaultCountry.numbers[0].number,
        displayNumber: defaultCountry.numbers[0].displayNumber,
        free: defaultCountry.numbers[0].free,
      }
    : null;
  const [selectedNumber, setSelectedNumber] = useState<TollNumber | null>(defaultNumber);

  // Update numberOptions to show city/location if available
  const numberOptions = selectedCountry
    ? selectedCountry.numbers.map((num) => ({
        value: num.number,
        // Include location (dc) more prominently in the label
        label: `${num.displayNumber} - ${num.dc} ${num.free ? "(Toll-Free)" : ""}`,
        dc: num.dc,
      }))
    : [];

  return (
    <div className="max-w-lg mx-auto p-2 space-y-8 rounded-2xl bg-theme-surface text-theme-text border border-theme-border">
      <div className="space-y-6">
        {/* Step 1: Location Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <StepNumber number={1} />
            <h2 className="text-sm font-medium ">Select your location</h2>
          </div>
          <div className="space-y-3 flex relative w-full">
            <span className="flex w-full items-center px-2 text-gray-400">
              <Select
                options={countryOptions as any}
                value={selectedCountry}
                onChange={(option) => {
                  setSelectedCountry(option);
                  if (option?.numbers?.[0]) {
                    const firstNumber = {
                      value: option.numbers[0].number,
                      // Updated label format for better clarity
                      label: `${option.numbers[0].displayNumber} - ${option.numbers[0].dc} ${option.numbers[0].free ? "(Toll-Free)" : ""}`,
                      dc: option.numbers[0].dc,
                      country: option.numbers[0].country,
                      countryName: option.numbers[0].countryName,
                      number: option.numbers[0].number,
                      displayNumber: option.numbers[0].displayNumber,
                      free: option.numbers[0].free,
                    };
                    setSelectedNumber(firstNumber);
                  } else {
                    setSelectedNumber(null);
                  }
                }}
                placeholder="Search for a country..."
                className={inputClasses + "w-1/2 flex-1 mr-2"}
                classNamePrefix="uikit-custom-scrollbar"
                styles={CommonSelectStyle({ themeName })}
              />
              <Select
                options={numberOptions as any}
                value={selectedNumber}
                onChange={setSelectedNumber}
                className={`${inputClasses} ${THEME_COLOR_CLASS} w-1/2 flex-1 ml-2`}
                placeholder={selectedCountry ? "Select a number" : "select a country first"}
                isDisabled={!selectedCountry}
                classNamePrefix="uikit-custom-scrollbar"
                styles={CommonSelectStyle({ themeName })}
              />
            </span>
          </div>
        </div>

        {/* Steps 2-4: Meeting Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <StepNumber number={2} />
            <h2 className="text-sm font-medium text-theme-text">Enter the following information</h2>
          </div>

          <div className="space-y-3">
            <InfoRow label="Meeting ID" value={callInInfo.meetingId} icon={Phone} />
            <InfoRow label="Participant ID" value={callInInfo.participantId} icon={Users} />
            <InfoRow label="Passcode" value={callInInfo.password} icon={Lock} />
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-theme-background rounded-xl p-4">
          <p className="text-xs text-theme-text leading-relaxed">
            After dialing in, you&apos;ll be prompted to enter each piece of information above. Remember to press the #
            key after entering each number.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CallInTab;
