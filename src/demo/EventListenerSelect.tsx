import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { getReactSelectTheme } from "./reactSelectTheme";

interface EventListenerSelectProps {
  eventOptions: { value: string; label: string }[];
  selectedEvents: { value: string; label: string }[];
  setSelectedEvents: (events: { value: string; label: string }[]) => void;
  onEventsChange?: (eventsString: string) => void;
  apiLink?: {
    text: string;
    link: string;
  }[];
}

export interface EventListenerSelectRef {
  getSelectedEventsString: () => string;
}

const EventListenerSelect = forwardRef<EventListenerSelectRef, EventListenerSelectProps>(
  ({ eventOptions, selectedEvents, setSelectedEvents, onEventsChange, apiLink }, ref) => {
    const { t } = useTranslation();
    const handleEventSelectChange = (selected: any) => {
      setSelectedEvents(selected || []);
    };
    const handleSelectAllEvents = () => setSelectedEvents(eventOptions);
    const handleClearAllEvents = () => setSelectedEvents([]);

    useImperativeHandle(ref, () => ({
      getSelectedEventsString: () => selectedEvents.map((event) => event.value).join(","),
    }));

    useEffect(() => {
      const eventsString = selectedEvents.map((event) => event.value).join(",");
      onEventsChange?.(eventsString);
    }, [selectedEvents, onEventsChange]);

    return (
      <div className="mb-6">
        <div className="flex items-center mb-2">
          {apiLink && (
            <div className="flex items-center space-x-4 mt-2">
              {apiLink.map((link) => (
                <a
                  key={`events-listener-${link.text}`}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 flex items-center"
                >
                  {link.text}
                </a>
              ))}
            </div>
          )}
          <button
            type="button"
            className="ml-auto px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 mr-2 shadow"
            onClick={handleSelectAllEvents}
            disabled={selectedEvents.length === eventOptions.length}
            title={t("common.select_all")}
          >
            {selectedEvents.length}
            <span className="ml-1">✓</span>
          </button>
          <button
            type="button"
            className="px-2 py-1 text-xs rounded bg-theme-surface text-theme-text hover:bg-theme-background mr-2 shadow border border-theme-border"
            onClick={handleClearAllEvents}
            disabled={selectedEvents.length === 0}
            title={t("common.clear_all")}
          >
            ×
          </button>
        </div>
        <Select
          isMulti
          isSearchable
          options={eventOptions}
          value={selectedEvents}
          onChange={handleEventSelectChange}
          classNamePrefix="react-select uikit-custom-scrollbar"
          placeholder={t("common.search_event_listeners")}
          closeMenuOnSelect={false}
          id="event-listener-select"
          styles={getReactSelectTheme()}
        />
      </div>
    );
  },
);

export default EventListenerSelect;
