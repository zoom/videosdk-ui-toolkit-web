# Zoom Video SDK UI toolkit for web

Use of this SDK is subject to our [Terms of Use](https://explore.zoom.us/en/video-sdk-terms/).

The [Zoom Video SDK UI toolkit](https://developers.zoom.us/docs/video-sdk/web/ui-toolkit/) is a prebuilt video chat user interface powered by the Zoom Video SDK.

![Zoom Video SDK UI toolkit web](ui-toolkit–gallery-view.png)

## Installation

In your frontend project, install the Video SDK UI toolkit:

```
$ npm install @zoom/videosdk-ui-toolkit --save
```

Or, for Vanilla JS applications, download the package and add it to your project. Then, add the following script and CSS style to the HTML page you want the UI toolkit to live on:

```html
<link rel="stylesheet" href="@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css">
<script src="@zoom/videosdk-ui-toolkit/index.js" type="module"></script>
```

## Setup

For webpack / single page applications like Angular, Vue, React, etc, import the UI toolkit, package and styles:

```js
import uitoolkit from '@zoom/videosdk-ui-toolkit'
import '@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css'
```

In Angular, CSS can't be imported directly into the component, instead, add the styles to your `angular.json` file in the styles array:

```JSON
"styles": [
  "node_modules/@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css",
]
```

Or, for Vanilla JS applications, import the JS file directly:

```js
import uitoolkit from './@zoom/videosdk-ui-toolkit/index.js'
```

> [JS imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#applying_the_module_to_your_html) work if your script tag has the `type="module"` attribute.

> UI toolkit CDN is coming soon to make vanilla JS usage easier.

## Usage

### Join Session

To join a Video SDK session, create an HTML container that it will be rendered in:

```html
<div id='sessionContainer'></div>
```

Create your Video SDK session config object, with your [Video SDK JWT](https://developers.zoom.us/docs/video-sdk/auth/), and [Video SDK session info](https://developers.zoom.us/docs/video-sdk/web/sessions/#prerequisites), the features you want to render, and any options you want to specify.

```js
var config = {
  videoSDKJWT: '',
  sessionName: 'SessionA',
  userName: 'UserA',
  sessionPasscode: 'abc123',
  features: ['preview', 'video', 'audio', 'share', 'chat', 'users', 'settings'],
  options: { init: {}, audio: {}, video: {}, share: {}},
  virtualBackground: {
    allowVirtualBackground: true,
    allowVirtualBackgroundUpload: true,
    virtualBackgrounds: ['https://images.unsplash.com/photo-1715490187538-30a365fa05bd?q=80&w=1945&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D']
  }
}
```

Currently, we support the following features:

| `features[]` | Description                                                                                                                                                |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `preview`    | Enables the preview flow, let's the end user choose their preferred video, microphone, speaker, and background before joining the session.                 |
| `video`      | Enable the video layout, and to send and receive video.                                                                                                    |
| `audio`      | Show the audio button on the toolbar, and to send and receive audio.                                                                                       |
| `share`      | Show the screen share button on the toolbar, and to send and receive screen share content.                                                                 |
| `chat`       | Show the chat button on the toolbar, and to send and receive session chats.                                                                                |
| `users`      | Show the users button on the toolbar, and to see the list of users in the session.                                                                         |
| `settings`   | Show the settings button on the toolbar, and to configure virtual background, camera, microphone, and speaker devices, and see session quality statistics. |

We also support setting specific properties for the Video SDK [init](https://marketplacefront.zoom.us/sdk/custom/web/interfaces/InitOptions.html), [audio](https://marketplacefront.zoom.us/sdk/custom/web/interfaces/AudioOption.html), [video](https://marketplacefront.zoom.us/sdk/custom/web/interfaces/CaptureVideoOption.html), and [share](https://marketplacefront.zoom.us/sdk/custom/web/interfaces/ScreenShareOption.html) options.

| `options{}` | Properties                                                                                       | Default                                         | Description |
| ----------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------- | ----------- |
| `init`      | `enforceMultipleVideos` <br> `enforceVirtualBackground` <br> `webEndpoint`                       | `false` <br> `false` <br> `zoom.us`             | Enables [rendering multiple videos](https://developers.zoom.us/docs/video-sdk/web/video/#render-multiple-participant-videos) if [SharedArrayBuffer](https://developers.zoom.us/docs/video-sdk/web/sharedarraybuffer/) is off. <br> Enables [virtual background](https://developers.zoom.us/docs/video-sdk/web/video/#use-virtual-background) if [SharedArrayBuffer](https://developers.zoom.us/docs/video-sdk/web/sharedarraybuffer/) is off. <br> Specifies the Zoom real-time media environment.          |
| `audio`     | `backgroundNoiseSuppression` <br> `originalSound` <br> `syncButtonsOnHeadset` | `true` <br> `false` <br> `false`   | Zoom's AI background noise suppression. <br> Sends sound exactly as it's captured (opposite of background noise suppression). <br> Enables headset buttons like mute/unmute to work within [supported browsers](https://caniuse.com/webhid). |
| `video`     | `originalRatio` <br> `virtualBackground`                              | `true` <br> `false` <br> `true` <br> `null`     | Sends video exactly as it's captured. If false, Zoom crops it to 16:9. <br> Sets a default virtual background for the user. |
| `share`     | `controls` <br> `displaySurface` <br> `hideShareAudioOption` <br> `optimizedForSharedVideo`      | `null`  <br> `null`  <br> `false`  <br> `false` | Enables configuring specific content to share within [supported browsers](https://caniuse.com/mdn-api_mediadevices_getdisplaymedia_controller_option) <br> Enables configuring specific share surfaces within [supported browsers](https://caniuse.com/mdn-api_mediadevices_getdisplaymedia_monitortypesurfaces_option).  <br> Enables or disables the share computer audio option within [supported browsers](https://caniuse.com/mdn-api_mediadevices_getdisplaymedia_systemaudio_option). <br> Prioritizes frame rate over resolution for better screen sharing of videos. |

> You may notice some options irrelevant for the UI Toolkit use case are not exposed (for example [`skipJsMedia`](https://marketplacefront.zoom.us/sdk/custom/web/interfaces/InitOptions.html#skipJsMedia) and [`alternativeNameForVideoPlayer`](https://marketplacefront.zoom.us/sdk/custom/web/interfaces/InitOptions.html#alternativeNameForVideoPlayer)), or are defaulted on (for example [`leaveOnPageUnload`](https://marketplacefront.zoom.us/sdk/custom/web/interfaces/InitOptions.html#leaveOnPageUnload) and [`patchJsMedia`](https://marketplacefront.zoom.us/sdk/custom/web/interfaces/InitOptions.html#patchJsMedia)) with no option to change them. For feedback or requests relating to exposing additional [`init`](https://marketplacefront.zoom.us/sdk/custom/web/modules/VideoClient.html#init), [`audio`](https://marketplacefront.zoom.us/sdk/custom/web/modules/Stream.html#startAudio), [`video`](https://marketplacefront.zoom.us/sdk/custom/web/modules/Stream.html#startVideo), and [`share`](https://marketplacefront.zoom.us/sdk/custom/web/modules/Stream.html#startShareScreen) options from the Video SDK, please [share your use case here](https://github.com/zoom/videosdk-ui-toolkit-web/issues).

Virtual backgrounds can also be configured further like providing a list of available backgrounds, allowing the user to upload their own background, or disabling virtual backgrounds completely. To set a default, specific virtual background for a user, use the `options` -> `video` -> `virtualBackground` approach mentioned above.

| `virtualBackground{}`          |  Default    | Description                                                                   |
| ------------------------------ | ----------- | ----------------------------------------------------------------------------- |
| `allowVirtualBackground`       | `true`      | Enables users to choose their virtual background from the `backgrounds` list. |
| `allowVirtualBackgroundUpload` | `true`      | Enables users to upload their own virtual background.                         |
| `virtualBackgrounds`           | `[]`        | Sets the list of available virtual backgrounds.                               |

After you have configured your session, call the `uitoolkit.joinSession` function, passing in the container reference, and the Video SDK session config object:

```js
var sessionContainer = document.getElementById('sessionContainer')

uitoolkit.joinSession(sessionContainer, config)
```

### Leave Session

To leave a Video SDK session, the user can click the red leave button. The host can also end the session for everyone, by clicking their red end button.

You can also leave a session programmatically by calling the `uitoolkit.closeSession` function:

```js
uitoolkit.closeSession(sessionContainer)
```

### Event Listeners

To subscribe to event listeners, define a callback function that you want to execute when the respective event is triggered:

```js
var sessionJoined = (() => {
  console.log('session joined')
})

var sessionClosed = (() => {
  console.log('session closed')
})
```

Then, pass the callback function to the respective **on** event listener (after calling the `uitoolkit.joinSession` function).

```js
uitoolkit.onSessionJoined(sessionJoined)

uitoolkit.onSessionClosed(sessionClosed)
```

To unsubscribe to event listeners, pass the callback function to the respective **off** event listener.

```js
uitoolkit.offSessionJoined(sessionJoined)

uitoolkit.offSessionClosed(sessionClosed)
```

Currently, we support the following event listeners:

| Event Listener     | Description                                         |
| ------------------ | --------------------------------------------------- |
| `onSessionJoined`  | Fires when the user joins the session successfully. |
| `onSessionClosed`  | Fires when the session is left or ended.            |
| `offSessionJoined` | Unsubscribes to the `onSessionJoined` event.        |
| `offSessionClosed` | Unsubscribes to the `onSessionClosed` event.        |

## Build with UI Toolkit components

Zoom's UI Toolkit now offers Developers powerful built-in components that are ready to use. Currently, we offer the following components:

| Component    | Description                                         |
| ---------- | --------------------------------------------------- |
| `uitoolkit-components`    | Gives UI Toolkit components access to Video SDK session and context. |
| `controls-component`    | Enables users to envoke actions such as muting, starting video, screen sharing, and more. |
| `video-component`    | Displays user videos and screen sharing. |
| `chat-component`    | Displays session and 1:1 chat messages. |
| `users-component`     | Displays the list of users in a session and allows hosts to moderate the session. |
| `settings-component`    | Displays the session settings and allows users to configure virtual background, camera, microphone, and speaker devices, and see session quality statistics. |

### Show UI Toolkit components

When building with UI Toolkit components, the `uitoolkit-components` component is a required wrapper around the UI Toolkit components. To begin, create an HTML container that it will be rendered in:

```html
<div id='uitoolkitContainer'></div>
```

Then, call the `uitoolkit.showUitoolkitComponents` function, passing in the container reference, and the Video SDK session config object:

```js
var uitoolkitContainer = document.getElementById('uitoolkitContainer')

uitoolkit.showUitoolkitComponents(uitoolkitContainer, config)
```

### Hide UI Toolkit components

To close the wrapper, call the `uitoolkit.hideUiToolkitComponents` function while passing in the container reference:

```js
uitoolkit.hideUiToolkitComponents(providerContainer)
```

### Show the controls component

The controls component is a required component that enables users to control their video call experience.
To render the controls component, create and HTML container and pass it into the `uitoolkit.showControlsComponent` function:

```html
<div id='uitoolkitContainer'>
  ...
  <div id='controlsContainer'></div>
  ...
</div>
```

```js
var controlsContainer = document.getElementById('controlsContainer')

uitoolkit.showControlsComponent(controlsContainer)
```

### Hide the controls component

To close the Control Bar Component, call the `uitoolkit.hideControlsComponent` function while passing in the container reference:

```js
uitoolkit.hideControlsComponent(controlsContainer)
```

### Show the video component

To render the video component, create and HTML container and pass it into the `uitoolkit.showVideoComponent` function:

```html
<div id='uitoolkitContainer'>
  ...
  <div id='videoContainer'></div>
  ...
</div>
```

```js
var videoContainer = document.getElementById('videoContainer')

uitoolkit.showVideoComponent(videoContainer)
```

### Hide the video component

To close the video component, call the `uitoolkit.hideVideoComponent` function while passing in the container reference:

```js
uitoolkit.hideVideoComponent(videoContainer)
```

### Show the chat component

To render the Chatkit, create and HTML container and pass it into the `uitoolkit.showChatComponent` function:

```html
<div id='uitoolkitContainer'>
  ...
  <div id='chatContainer'></div>
  ...
</div>
```

```js
var chatContainer = document.getElementById('chatContainer')

uitoolkit.showChatComponent(chatContainer)
```

### Hide the chat component

To close the chat component, call the `uitoolkit.hideChatComponent` function while passing in the container reference:

```js
uitoolkit.hideChatComponent(chatContainer)
```

### Show the users component

To render the users component, create and HTML container and pass it into the `uitoolkit.showUsersComponent` function:

```html
<div id='uitoolkitContainer'>
  ...
  <div id='usersContainer'></div>
  ...
</div>
```

```js
var usersContainer = document.getElementById('usersContainer')

uitoolkit.showUsersComponent(usersContainer)
```

### Hide the users component

To close the users component, call the `uitoolkit.hideUsersComponent` function while passing in the container reference:

```js
uitoolkit.hideUsersComponent(usersContainer)
```

### Show the settings component

To render the settings component, create and HTML container and pass it into the `uitoolkit.showSettingsComponent` function:

```html
<div id='uitoolkitContainer'>
  ...
  <div id='settingsContainer'></div>
  ...
</div>
```

```js
var settingsContainer = document.getElementById('settingsContainer')

uitoolkit.showSettingsComponent(settingsContainer)
```

### Hide the settings component

To close the settings component, call the `uitoolkit.hideSettingsComponent` function while passing in the container reference:

```js
uitoolkit.hideSettingsComponent(settingsContainer)
```

### Cleaning up the session

Once your session has ended, we recommend properly cleaning up the UI Toolkit so users can join subsequent sessions. You can easily do this by using the `onSessionClosed` event listener. Simply call each component's respective hide function to properly remove each component from the DOM. See the following code snippet for an example:

```js
  ...
  uitoolkit.onSessionClosed(sessionClosed)
  ...

  function sessionClosed {
    uitoolkit.hideSettingsComponent(settingsContainer)
    uitoolkit.hideUsersComponent(usersContainer)
    uitoolkit.hideControlsComponent(controlsContainer)
    uitoolkit.hideVideoComponent(videoContainer)
    uitoolkit.hideChatComponent(chatContainer)
    uitoolkit.hideUitoolkitComponents(sessionContainer)
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

If you're looking for help, try [Developer Support](https://devsupport.zoom.us) or our [Developer Forum](https://devforum.zoom.us). Priority support is also available with [Premier Developer Support](https://zoom.us/docs/en-us/developer-support-plans.html) plans.