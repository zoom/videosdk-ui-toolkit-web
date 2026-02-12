import { getRemoteControlEnabled } from "@/components/util/util";
import { useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";

import ShareIndicatorBarBase from "@/features/share/components/ShareIndicatorBarBase";
import ShareIndicatorBarRemoteControl from "@/features/share/components/ShareIndicatorBarRemoteControl";

const ShareIndicatorBar = () => {
  const { featuresOptions } = useAppSelector(useSessionSelector);
  const isRemoteControlFeatureEnabled = getRemoteControlEnabled(featuresOptions);

  if (isRemoteControlFeatureEnabled) {
    return <ShareIndicatorBarRemoteControl />;
  }

  return <ShareIndicatorBarBase />;
};

export default ShareIndicatorBar;
