import type { TFunction } from "i18next";

export function permissionStateLabel(t: TFunction, state: PermissionState): string {
  switch (state) {
    case "granted":
      return t("permission.state.granted");
    case "denied":
      return t("permission.state.denied");
    case "prompt":
      return t("permission.state.prompt");
    default:
      return t("permission.state.unknown", { state });
  }
}
