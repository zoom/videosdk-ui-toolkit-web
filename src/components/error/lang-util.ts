export const ErrorKeyMap = {
  errorcodes_be_removed: "Be removed.",
  errorcodes_disconnect: "Session has been disconnected.",
  errorcodes_fail: "Fail to join the session.",
  errorcodes_frequent_call: "You have reached the API limit for this call.",
  errorcodes_frequent_join: "You be limit by zoom, need to check recaptcha.",
  errorcodes_not_exist: "Session does not exist.",
  errorcodes_not_host: "You are not the session host.",
  errorcodes_not_init: "Session not initialized.",
  errorcodes_not_start: "Session has not started",
  errorcodes_offline: "The service is temporarily offline.",
  errorcodes_pac_invalid_signature: "Signature is invalid.",
  errorcodes_pac_mn_not_fount: "The session number is not found.",
  errorcodes_pac_mn_wrong: "The session number is wrong.",
  errorcodes_pac_no_permission: "No permission.",
  errorcodes_pac_role_error: "Incorrect role.",
  errorcodes_pac_signature_expired: "The signature has expired.",
  errorcodes_re_connect: "Session is reconnecting.",
  errorcodes_register: "This session requires registration.",
  errorcodes_rwc_empty: "Could not get a response from the web server.",
  errorcodes_rwc_error: "Could not connect to Web Server error.",
  errorcodes_success: "Successfully joined the session.",
  errorcodes_tk_expired: "Token has expired.",
  errorcodes_update: "You cant join, you need update lastest version",
  errorcodes_wasm_fail: "Download wasm files error, please check your network and firewall.",

  errorcodes_web_not_support_tsp:
    "Not support start or join session from web, when you chose TSP as his audio in a session.",
  errorcodes_web_not_support_webclient: "Not support start or join session from web.",

  errorcodes_web_require_email: "User email is required.",

  errorcodes_wrong_pass: "Session Passcode wrong.",
  "apac.rmc.assistant_exist_warning":
    "You cannot control the session because another assistant is controlling this session.",
  "apac.uikit_enforce_update_content":
    "Your app version needs to be {0} or higher to join this session. Please update to continue.",
  "apac.invalid_parameter": "Invalid parameter",
  errorcodes_participant_exist: "participant exist",
  errorcodes_reject_barriers: "reject for information barriers",
  "apac.dialog.session_capacity_reached": "Session capacity has been reached",
  "apac.dialog.session_locked": "The session has been locked",
  "apac.dialog.session_ended": "The session has been ended",
  "apac.uikit_update_content": "Update UIKit to the latest version to optimize session experience",
  errorcodes_need_token: "Join fail because you email no token",
  "apac.dialog.server_error": "The server encountered an internal error and was unable to process your request.",
  errorcodes_not_allow_assistant_join: "dont support assisnt join through widget",
};

export function getKeyByValue(object: Record<string, string>, value: string): string | undefined {
  return Object.keys(object).find((key) => object[key] === value);
}
