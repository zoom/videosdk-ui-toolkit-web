import { isPortrait } from "@/components/util/service";
import { useAppSelector, useSessionSelector, useSessionUISelector } from "@/hooks/useAppSelector";
import React, { useMemo } from "react";

interface PageIndicatorProps {
  currentPage: number;
  totalPages: number;
  [key: string]: any; // For rest props
}

const PageIndicator = ({ totalPages, currentPage, ...rest }: PageIndicatorProps) => {
  const { isControlsVisible } = useAppSelector(useSessionUISelector);
  const { isReceivingScreenShare, isSendingScreenShare } = useAppSelector(useSessionSelector);

  const visiblePages = useMemo(() => {
    const adjustedCurrentPage = isReceivingScreenShare || isSendingScreenShare ? currentPage + 1 : currentPage;
    const adjustedTotalPages = isReceivingScreenShare || isSendingScreenShare ? totalPages + 1 : totalPages;
    if (adjustedTotalPages <= 5) {
      // If there are less than or equal to 5 pages, show all the dots
      return Array.from({ length: adjustedTotalPages }, (_, index) => index);
    }

    // If more than 5 pages, dynamically calculate the visible range
    if (adjustedCurrentPage <= 2) {
      return [0, 1, 2, 3, 4];
    } else if (adjustedCurrentPage >= adjustedTotalPages - 3) {
      return [
        adjustedTotalPages - 5,
        adjustedTotalPages - 4,
        adjustedTotalPages - 3,
        adjustedTotalPages - 2,
        adjustedTotalPages - 1,
      ];
    } else {
      return [
        adjustedCurrentPage - 2,
        adjustedCurrentPage - 1,
        adjustedCurrentPage,
        adjustedCurrentPage + 1,
        adjustedCurrentPage + 2,
      ];
    }
  }, [currentPage, isReceivingScreenShare, isSendingScreenShare, totalPages]);

  return (
    <div
      className={`absolute w-full flex justify-center items-center`}
      style={{ bottom: isPortrait() ? "80px" : "60px" }}
    >
      <div
        className={`flex justify-center items-center mt-5 space-x-2 transform transition-transform duration-300 ease-in-out`}
        style={{
          opacity: isControlsVisible ? "100%" : "0%",
        }}
        {...rest}
      >
        {visiblePages.map((page, index) => (
          <span
            key={index}
            className={`w-2 h-2 rounded-full transform transition-transform duration-300 ${
              isReceivingScreenShare || isSendingScreenShare
                ? page === currentPage + 1
                  ? "bg-gray-500 scale-120"
                  : "bg-gray-300"
                : page === currentPage
                  ? "bg-gray-500 scale-120"
                  : "bg-gray-300"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default PageIndicator;
