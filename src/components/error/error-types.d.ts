import { ErrorProps } from "../../../types";

export interface ErrorContainerProps {
  errorStatus: ErrorProps;
  onRetry: () => void;
}
