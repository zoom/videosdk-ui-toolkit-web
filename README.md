# Zoom Video SDK UI toolkit

The [Zoom Video SDK UI toolkit](https://developers.zoom.us/docs/video-sdk/web/ui-toolkit/) is a prebuilt video chat user interface powered by the Zoom Video SDK.

![Zoom Video SDK UI toolkit web](https://github.com/zoom/videosdk-ui-toolkit-web/blob/main/uitoolkitgalleryview.png?raw=true)

Use of this SDK is subject to our [Terms of Use](https://explore.zoom.us/en/video-sdk-terms/).

## Installation

In your frontend project, install the Video SDK UI toolkit:

```
$ npm install @zoom/videosdk-ui-toolkit --save
```

Or, for Vanilla JS applications, download the package and add it to your project. Then, add the following script and CSS style to the HTML page you want the UI toolkit to live on:

```html
<link rel="stylesheet" href="https://source.zoom.us/uitoolkit/{VERSION}/videosdk-ui-toolkit.css" />
<script src="https://source.zoom.us/uitoolkit/{VERSION}/videosdk-ui-toolkit.min.umd.js">
  const uitoolkit = window.UIToolkit;
</script>
```

or

```html
<link rel="stylesheet" href="https://source.zoom.us/uitoolkit/{VERSION}/videosdk-ui-toolkit.css" />
<script type="module">
  import uitoolkit from "https://source.zoom.us/uitoolkit/{VERSION}/videosdk-ui-toolkit.min.esm.js";
</script>
```

## Setup

For webpack / single page applications like Angular, Vue, React, etc, import the UI toolkit, package and styles:

```js
import uitoolkit from "@zoom/videosdk-ui-toolkit";
import "@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css";
```

In Angular, CSS can't be imported directly into the component, instead, add the styles to your `angular.json` file in the styles array:

```JSON
"styles": [
  "node_modules/@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css",
]
```

Or, for Vanilla JS applications, import the JS file directly:

```js
import uitoolkit from "./@zoom/videosdk-ui-toolkit/index.js";
```

> [JS imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#applying_the_module_to_your_html) work if your script tag has the `type="module"` attribute.

## Usage

### Join Session

To join a Video SDK session, create an HTML container that it will be rendered in:

```html
<div id="sessionContainer"></div>
```

Create your Video SDK session config object, with your [Video SDK JWT](https://developers.zoom.us/docs/video-sdk/auth/), and [Video SDK session info](https://developers.zoom.us/docs/video-sdk/web/sessions/#prerequisites), the features you want to render, and any options you want to specify.

```js
var config = {
  videoSDKJWT: "",
  sessionName: "SessionA",
  userName: "UserA",
  sessionPasscode: "abc123",
};
```

Currently, we support the following features:

| `featuresOptions[]` | Description                                                                                                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `preview`           | Enable the preview flow, lets the end user choose their preferred video, microphone, speaker, and background before joining the session.                   |
| `video`             | Enable the video layout, and to send and receive video.                                                                                                    |
| `audio`             | Show the audio button on the toolbar, and to send and receive audio.                                                                                       |
| `share`             | Show the screen share button on the toolbar, and to send and receive screen share content.                                                                 |
| `chat`              | Show the chat button on the toolbar, and to send and receive session chats.                                                                                |
| `users`             | Show the users button on the toolbar, and to see the list of users in the session.                                                                         |
| `settings`          | Show the settings button on the toolbar, and to configure virtual background, camera, microphone, and speaker devices, and see session quality statistics. |
| `recording`         | Show the button for cloud recording (Requires a paid plan).                                                                                                |
| `phone`             | Show the options of joining the session by phone (Requires a paid plan).                                                                                   |
| `invite`            | Show the invite options to the session by invite link                                                                                                      |
| `theme`             | Show the options in the settings panel to select theme color.                                                                                              |
| `viewMode`          | Show the options to choose view modes.                                                                                                                     |
| `feedback`          | Show session experience feedback after the session ends.                                                                                                   |
| `troubleshoot`      | Show the troubleshooting settings tab using [Zoom Probe SDK](https://www.npmjs.com/package/@zoom/probesdk).                                                |
| `caption`           | Show the in-session translations (Requires a paid plan).                                                                                                   |
| `playback`          | Show media file playback options in the settings panel.                                                                                                    |
| `subsession`        | Show button for subsession.                                                                                                                                |
| `leave`             | Show button for end session or leave.                                                                                                                      |
| `virtualBackground` | Show options for the virtual background in the settings panel.                                                                                             |
| `footer`            | Show footer UI with buttons for the session                                                                                                                |
| `header`            | Show the session header UI.                                                                                                                                |

See [index.d.ts](index.d.ts) for more `featuresOptions` details.

After configuring your session, call the `uitoolkit.joinSession` function, passing in the container reference, and the Video SDK session config object:

```js
var sessionContainer = document.getElementById("sessionContainer");
// const newConfig = uitoolkit.migrateConfig(config); if use migrate config from old version(<2.1.10)
uitoolkit.joinSession(sessionContainer, newConfig);
```

### Leave Session

To leave a Video SDK session, the user can click the red leave button. The host can also end the session for everyone, by clicking their red end button.

You can also leave a session programmatically by calling the `uitoolkit.closeSession` function:

```js
uitoolkit.closeSession(sessionContainer);
```

### Event Listeners

To subscribe to event listeners, define a callback function to execute when the respective event is triggered:

```js
var sessionJoined = () => {
  console.log("session joined");
};

var sessionClosed = () => {
  console.log("session closed");
};
```

Then, pass the callback function to the respective **on** event listener (after calling the `uitoolkit.joinSession` function).

```js
uitoolkit.onSessionJoined(sessionJoined);

uitoolkit.onSessionClosed(sessionClosed);
```

To unsubscribe to event listeners, pass the callback function to the respective **off** event listener.

```js
uitoolkit.offSessionJoined(sessionJoined);

uitoolkit.offSessionClosed(sessionClosed);
```

Currently, we support the following event listeners:

| Event Listener     | Description                                         |
| ------------------ | --------------------------------------------------- |
| `onSessionJoined`  | Fires when the user joins the session successfully. |
| `onSessionClosed`  | Fires when the session is left or ended.            |
| `offSessionJoined` | Unsubscribes to the `onSessionJoined` event.        |
| `offSessionClosed` | Unsubscribes to the `onSessionClosed` event.        |

### Hide UI Toolkit components

To close the wrapper, call the `uitoolkit.hideAllComponents` function while passing in the container reference:

```js
uitoolkit.hideAllComponents();
```

### Show the controls component

The controls component is a required component that enables users to control their video call experience.
To render the controls component, create and HTML container and pass it into the `uitoolkit.showControlsComponent` function:

```html
<div id="uitoolkitContainer">
  ...
  <div id="controlsContainer"></div>
  ...
</div>
```

```js
var controlsContainer = document.getElementById("controlsContainer");

uitoolkit.showControlsComponent(controlsContainer);
```

### Hide the controls component

To close the Control Bar Component, call the `uitoolkit.hideControlsComponent` function while passing in the container reference:

```js
uitoolkit.hideControlsComponent(controlsContainer);
```

### Show the chat component

To render the Chatkit, create and HTML container and pass it into the `uitoolkit.showChatComponent` function:

```html
<div id="uitoolkitContainer">
  ...
  <div id="chatContainer"></div>
  ...
</div>
```

```js
var chatContainer = document.getElementById("chatContainer");

uitoolkit.showChatComponent(chatContainer);
```

### Hide the chat component

To close the chat component, call the `uitoolkit.hideChatComponent` function while passing in the container reference:

```js
uitoolkit.hideChatComponent(chatContainer);
```

### Show the users component

To render the users component, create and HTML container and pass it into the `uitoolkit.showUsersComponent` function:

```html
<div id="uitoolkitContainer">
  ...
  <div id="usersContainer"></div>
  ...
</div>
```

```js
var usersContainer = document.getElementById("usersContainer");

uitoolkit.showUsersComponent(usersContainer);
```

### Hide the users component

To close the users component, call the `uitoolkit.hideUsersComponent` function while passing in the container reference:

```js
uitoolkit.hideUsersComponent(usersContainer);
```

### Show the settings component

To render the settings component, create and HTML container and pass it into the `uitoolkit.showSettingsComponent` function:

```html
<div id="uitoolkitContainer">
  ...
  <div id="settingsContainer"></div>
  ...
</div>
```

```js
var settingsContainer = document.getElementById("settingsContainer");

uitoolkit.showSettingsComponent(settingsContainer);
```

### Hide the settings component

To close the settings component, call the `uitoolkit.hideSettingsComponent` function while passing in the container reference:

```js
uitoolkit.hideSettingsComponent(settingsContainer);
```

### Cleaning up the session

Once your session has ended, we recommend properly cleaning up the UI Toolkit so users can join subsequent sessions. You can easily do this by using the `onSessionClosed` event listener. Simply call each component's respective hide function to properly remove each component from the DOM. See the following code snippet for an example:

```js
  uitoolkit.onSessionClosed(sessionClosed)

  function sessionClosed() {
    // Your code here
  }
```

## Sample Apps

- [Video SDK UI Toolkit Angular Sample](https://github.com/zoom/videosdk-ui-toolkit-angular-sample)
- [Video SDK UI Toolkit React Sample](https://github.com/zoom/videosdk-ui-toolkit-react-sample)
- [Video SDK UI Toolkit Vue.js Sample](https://github.com/zoom/videosdk-ui-toolkit-vuejs-sample)
- [Video SDK UI Toolkit JavaScript Sample](https://github.com/zoom/videosdk-ui-toolkit-javascript-sample)
- [Video SDK Auth Sample (Node.js)](https://github.com/zoom/videosdk-auth-endpoint-sample)
- [Webhook Sample (Node.js)](https://github.com/zoom/webhook-sample)

## Need help?

If you're looking for help, try [Developer Support](https://developers.zoom.us/support/) or our [Developer Forum](https://devforum.zoom.us). Priority support is also available with [Premier Developer Support](https://explore.zoom.us/en/support-plans/developer/) plans.
