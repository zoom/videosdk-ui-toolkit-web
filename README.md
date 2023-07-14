# Zoom Video SDK UI toolkit for web (beta)

Use of this SDK is subject to our [Terms of Use](https://explore.zoom.us/en/video-sdk-terms/).

The Zoom Video SDK UI toolkit is a prebuilt video chat user interface powered by the Zoom Video SDK.

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

In angular, CSS can't be imported directly into the component, instead, add the styles to your `angular.json` file in the styles array:

```JSON
...
"styles": [
  "node_modules/@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css",
  ...
],
...
```

For Vanilla JS applications, use the link and script tag syntax in your html file:

```html
<link rel="stylesheet" href="videosdk-ui-toolkit.css">
<script src="videosdk-ui-toolkit.js"></script>
```

## Usage

### Preview

To preview your local camera, microhpone, and speaker, render the following HTML element:

```html
<app-previewkit></app-previewkit>
```

### Join Session

To join a Video SDK session, create your Video SDK config object, with your [Video SDK session info](https://developers.zoom.us/docs/video-sdk/web/sessions/#prerequisites), [Video SDK JWT](https://developers.zoom.us/docs/video-sdk/auth/), and features you want to render:

```js
var UIToolkitConfig = JSON.stringify({
  videoSDKJWT: "",
  sessionName: "testReact",
  userName: 'Tommy',
  sessionPasscode: "test123",
  features: ['video', 'audio', 'settings', 'users']
})
```

Then, add the following HTML element to where you want the UI Toolkit to be rendered:

```html
<div id='UIToolkit'></div>
```

Now, create your UIToolkit instance, pass in the UIToolkitConfig object, and render the UIToolkit:

```js
let UIToolkit = document.createElement('app-uitoolkit');

UIToolkit.setAttribute("uitoolkitconfig", UIToolkitConfig)

document.getElementById('UIToolkit')?.append(UIToolkit);
```

## Sample Apps

Sample apps built with the Video SDK UI are coming soon.

## Need help?

If you're looking for help, try [Developer Support](https://devsupport.zoom.us) or our [Developer Forum](https://devforum.zoom.us). Priority support is also available with [Premier Developer Support](https://zoom.us/docs/en-us/developer-support-plans.html) plans.