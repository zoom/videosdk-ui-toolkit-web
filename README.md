# Zoom Video SDK UI toolkit for web (beta)

Use of this SDK is subject to our [Terms of Use](https://explore.zoom.us/en/video-sdk-terms/).

The [Zoom Video SDK UI toolkit](https://developers.zoom.us/docs/video-sdk/web/ui-toolkit/) is a prebuilt video chat user interface powered by the Zoom Video SDK.

![Zoom Video SDK UI toolkit web](videosdk-ui-toolkit-web.png)

> Zoom Video SDK UI toolkit is in a public beta. [Share your feedback with us](https://zoom.sjc1.qualtrics.com/jfe/form/SV_3NMYztWpWzNVSiG), and leverage the [beta FAQ](https://developers.zoom.us/docs/video-sdk/web/ui-toolkit/#beta-faq) for details.

## Installation

In your frontend project, install the Video SDK UI toolkit:

```
$ npm install @zoom/videosdk-ui-toolkit --save
```

## Setup

In the component file where you want to use the Video SDK UI, import the JavaScript package and the CSS styles.

For webpack / single page applications like Angular, Vue, React, etc, use the import syntax:

```js
import * as UIToolkit from '@zoom/videosdk-ui-toolkit'
import '@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css'
```

In Angular, CSS can't be imported directly into the component, instead, add the styles to your `angular.json` file in the styles array:

```JSON
"styles": [
  "node_modules/@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css",
]
```

For Vanilla JS applications, use the link and script tag syntax in your html file:

```html
<link rel="stylesheet" href="videosdk-ui-toolkit.css">
<script src="videosdk-ui-toolkit.js"></script>
```

## Usage

### Preview

To preview your local camera, microphone, and speaker, render the following HTML element:

```html
<app-previewkit></app-previewkit>
```

### Join Session

To join a Video SDK session, add the following HTML element to where you want the UI Toolkit to be rendered:

```html
<div id='UIToolkit'></div>
```

Then, create your UIToolkit instance, pass in the UIToolkitConfig object, and render the UIToolkit:

```js
let UIKit = document.createElement('app-uitoolkit');

document.getElementById('UIToolkit')?.append(UIKit);
```

Next, create your Video SDK config object, with your [Video SDK session info](https://developers.zoom.us/docs/video-sdk/web/sessions/#prerequisites), [Video SDK JWT](https://developers.zoom.us/docs/video-sdk/auth/), and features you want to render. Pass this object into the `window.initUIToolkit` function and call the `window.joinSession()` function to start or join a Video SDK Session:

```js
var UIToolkitConfig = {
  videoSDKJWT: '',
  sessionName: '',
  userName: '',
  sessionPasscode: '',
  features: ['video', 'audio', 'settings', 'users', 'chat']
};

window.initUIToolKit(obj);
window.joinSession();
```

### Leave/End Session

To leave a Video SDK session, the user can click the red leave button. The host can also end the session for everyone, by clicking their red end button.

You can also leave/end a session programatically by calling the `destroyUikit()` function, the session will be left or ended based on the user's role in their [Video SDK JWT](https://developers.zoom.us/docs/video-sdk/auth/):

```js
window.destroyUikit()
```

Use the `uikit-destroy` event listener to be notified when the session is left or ended by a user:

```js
window.UIkitSubscribe("uikit-destroy", () => {
  // session left/ended, post session business logic...
})
```

## Sample Apps

Sample apps built with the Video SDK UI toolkit are coming soon.

## Need help?

If you're looking for help, try [Developer Support](https://devsupport.zoom.us) or our [Developer Forum](https://devforum.zoom.us). Priority support is also available with [Premier Developer Support](https://zoom.us/docs/en-us/developer-support-plans.html) plans.