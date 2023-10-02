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

Then, create your UIToolkit instance and render it to your DOM:

```js
let UIToolKit = document.createElement('app-uitoolkit');

document.getElementById('UIToolkit')?.append(UIToolKit);
```

Next, create your Video SDK config object, with your [Video SDK session info](https://developers.zoom.us/docs/video-sdk/web/sessions/#prerequisites), [Video SDK JWT](https://developers.zoom.us/docs/video-sdk/auth/), and features you want to render. Pass this object into the `window.ZoomUIToolKit.init()` function and call the `window.ZoomUIToolKit.join()` function to start or join a Video SDK Session:

```js
let UIToolKitConfig = {
  videoSDKJWT: '',
  sessionName: '',
  userName: '',
  sessionPasscode: '',
  features: ['video', 'audio', 'settings', 'users', 'chat']
};

window.ZoomUIToolKit.init(UIToolKitConfig);

window.ZoomUIToolKit.join();
```

### Leave/End Session

To leave a Video SDK session, the user can click the red leave button. The host can also end the session for everyone, by clicking their red end button.

You can also leave/end a session programatically by calling the `window.ZoomUIToolKit.destroy()` function, the session will be left or ended based on the user's role in their [Video SDK JWT](https://developers.zoom.us/docs/video-sdk/auth/):

```js
window.ZoomUIToolKit.destroy(); //Leaves the meeting
//or
window.ZoomUIToolKit.destroy(true); //If you're a host you can end the meeting by passing in 'true'
```

Use the `uikit-destroy` event listener to be notified when the session is left or ended by a user:

```js
window.ZoomUIToolKit.subscribe("uikit-destroy", () => {
  // session left/ended, post session business logic...
});
```

You can also subscribe directly to the [Zoom Video SDK Events](https://marketplacefront.zoom.us/sdk/custom/web/modules/VideoClient.html#on) using the `window.ZoomUIToolKit.vsdkSubscribe()` method. Pass in the name of the Video SDK event and a callback function as shown:
 ```js
window.ZoomUIToolKit.vsdkSubscribe("user-added", () => {
        console.log("USER ADDED!")
});
```

Subscribe to the `loader-switch` event to better sync your loaders to the join flow of the UIToolKit! You only need to pass in a callback function that controls the state of your loader. The UIToolKit will fire the event and execute your loader callback logic once the meeting has been joined:
```js
window.ZoomUIToolKit.subscribe("loader-switch", () => { 
  setLoader(loader => !loader) 
  });
```


## Sample Apps

Sample apps built with the Video SDK UI toolkit are coming soon.

## Need help?

If you're looking for help, try [Developer Support](https://devsupport.zoom.us) or our [Developer Forum](https://devforum.zoom.us). Priority support is also available with [Premier Developer Support](https://zoom.us/docs/en-us/developer-support-plans.html) plans.