import "./progress-bar.css";

const ProgressBar = ({ level, ...rest }) => {
  return (
    <div
      tabIndex={0}
      className="audio-progress"
      aria-valuemax={100}
      aria-valuemin={0}
      role="progressbar"
      aria-valuenow={level}
      {...rest}
    >
      <div className="audio-progress-inner" style={{ width: `${level}%` }} />
    </div>
  );
};

export default ProgressBar;
