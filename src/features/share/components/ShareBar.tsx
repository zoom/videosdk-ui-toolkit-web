import { getRemoteControlEnabled } from "@/components/util/util";
import { useAppSelector, useSessionSelector } from "@/hooks/useAppSelector";

import ShareBarBase from "@/features/share/components/ShareBarBase";
import ShareBarRemoteControl from "@/features/share/components/ShareBarRemoteControl";

const ShareBar = () => {
  const { featuresOptions } = useAppSelector(useSessionSelector);
  const isRemoteControlFeatureEnabled = getRemoteControlEnabled(featuresOptions);

  if (isRemoteControlFeatureEnabled) {
    return <ShareBarRemoteControl />;
  }

  return <ShareBarBase />;
};

export default ShareBar;
