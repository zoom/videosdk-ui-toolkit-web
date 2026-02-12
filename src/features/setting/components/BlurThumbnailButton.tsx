import { useId } from "react";

interface BlurThumbnailButtonProps {
  isActive: boolean;
  onSelect: () => void;
  label: string;
  className?: string;
  labelClassName?: string;
}

const BlurThumbnailButton = ({ isActive, onSelect, label, className, labelClassName }: BlurThumbnailButtonProps) => {
  const id = useId();
  const gradientId = `uikit-blur-grad-${id}`;
  const blurId = `uikit-blur-filter-${id}`;

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onSelect}
      className={`bg-theme-surface rounded-lg aspect-video cursor-pointer overflow-hidden border-2 ${
        isActive ? "border-blue-500" : "border-gray-200"
      } relative ${className ?? ""}`}
    >
      <span className="sr-only">{label}</span>
      <svg aria-hidden viewBox="0 0 160 90" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d6e1ef" />
            <stop offset="0.58" stopColor="#d6e1ef" />
            <stop offset="1" stopColor="#0b4b78" />
          </linearGradient>
          <filter id={blurId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
        </defs>

        <g filter={`url(#${blurId})`}>
          <rect width="160" height="90" fill={`url(#${gradientId})`} />
          <ellipse cx="44" cy="16" rx="28" ry="12" fill="rgba(255,255,255,0.45)" />
          <ellipse cx="112" cy="20" rx="38" ry="14" fill="rgba(255,255,255,0.35)" />
          <rect y="56" width="160" height="34" fill="rgba(3, 37, 76, 0.18)" />
          <rect width="160" height="90" fill="rgba(0,0,0,0.16)" />
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className={`${labelClassName ?? "text-base font-medium text-theme-text"}`}>{label}</span>
      </div>
    </button>
  );
};

export default BlurThumbnailButton;
