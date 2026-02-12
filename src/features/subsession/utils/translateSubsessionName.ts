/**
 * Translates default subsession names from SDK (e.g., "Subsession 1") to localized versions
 * @param name - The subsession name from SDK
 * @param t - Translation function from i18next
 * @returns Translated subsession name or original name if it's custom
 */
export const translateSubsessionName = (name: string, t: (key: string, options?: any) => string): string => {
  // Match pattern "Subsession X" where X is a number
  const match = name.match(/^Subsession (\d+)$/);
  if (match) {
    const [, number] = match;
    return t("subsession.default_name", { number });
  }
  // Return original name if it doesn't match the default pattern (i.e., it's been renamed)
  return name;
};
