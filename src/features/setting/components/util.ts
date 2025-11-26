export const DEFAULT_VALUE_FORMAT = "-";

export const dataExists = (data) => data === 0 || !!data;

/**
 * Returns the data with all the formatting functions applied sequentially
 * @param data original data
 * @param args list of function that take data string and return new data string
 * @returns {null|string}
 */
export const formatter = (data, ...args) => {
  if (!dataExists(data)) {
    return null;
  }
  return args.reduce((prev, cur) => cur(prev), data);
};

export const formatMetric = (value, unit) => {
  let result = DEFAULT_VALUE_FORMAT;
  if (value !== undefined) {
    result = `${value} ${unit}`;
  }
  return result;
};

export const msFormatter = (data) => formatMetric(data, "ms");
export const khzFormatter = (data) => formatMetric(data, "khz");

export const percentFormatter = (value) => {
  let result = value;
  if (value !== DEFAULT_VALUE_FORMAT) {
    result = `${((value / 1000) * 100).toFixed(1)}%`;
  }
  return result;
};

export const packetLossFormatter = (encoding, decoding) => {
  const encAvgLossData = formatter(encoding.avg_loss, percentFormatter);
  const decAvgLossData = formatter(decoding.avg_loss, percentFormatter);
  const encMaxLossData = formatter(encoding.max_loss, percentFormatter);
  const decMaxLossData = formatter(decoding.max_loss, percentFormatter);
  const encodingDataExist = dataExists(encAvgLossData) && dataExists(encMaxLossData);
  const decodingDataExist = dataExists(decAvgLossData) && dataExists(decMaxLossData);
  const encodingResult = encodingDataExist
    ? formatter(encAvgLossData, () => `${encAvgLossData} (${encMaxLossData})`)
    : null;
  const decodingResult = decodingDataExist
    ? formatter(decAvgLossData, () => `${decAvgLossData} (${decMaxLossData})`)
    : null;
  return [encodingResult, decodingResult];
};

export const getWorstWarningLevel = (encode, decode) => {
  const warningLevels = ["normal", "warning", "error"];
  let maxLossErrorLevelIndex = 0;
  let avgLossWarningLevelIndex = 0;
  if (encode.max_loss >= 500 || decode.max_loss >= 500) {
    maxLossErrorLevelIndex += 2;
  } else if (encode.max_loss >= 200 || decode.max_loss >= 200) {
    maxLossErrorLevelIndex += 1;
  }

  if (encode.avg_loss >= 400 || decode.avg_loss >= 400) {
    avgLossWarningLevelIndex += 2;
  } else if (encode.avg_loss >= 150 || decode.avg_loss >= 150) {
    avgLossWarningLevelIndex += 1;
  }

  return warningLevels[Math.max(maxLossErrorLevelIndex, avgLossWarningLevelIndex)];
};
