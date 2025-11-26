import { CustomizationOptions, SessionClient } from "@/types";
import { SessionApplication } from "@/App";
const PreviewKit = (props: {
  client: SessionClient;
  config: CustomizationOptions;
  options?: { onClickJoin: () => void };
}) => {
  const { client, config, options } = props;
  return options?.onClickJoin ? (
    <SessionApplication client={client} config={config} options={{ onClickJoin: options.onClickJoin }} />
  ) : (
    <div>Preview: onClickJoin is not provided</div>
  );
};

export default PreviewKit;
