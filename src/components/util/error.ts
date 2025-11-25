export function getErrorMessageFromApiError(error: any, fallbackMessage: string): string {
  if (!error) {
    return fallbackMessage;
  }

  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }

  const candidates: Array<unknown> = [
    (error as any).errorMessage,
    (error as any).reason,
    (error as any).message,
    (error as any).response?.errorMessage,
    (error as any).response?.reason,
    (error as any).error?.errorMessage,
    (error as any).error?.reason,
    (error as any).error?.message,
  ];

  const message = candidates.find((item) => typeof item === "string" && (item as string).trim()) as string | undefined;

  if (message) {
    return message.trim();
  }

  return fallbackMessage;
}
