import * as ui from './dist/videosdk-ui-toolkit.js'

let /** @type {HTMLElement} */ uitoolkitProvider
let /** @type {HTMLElement} */ uitoolKit
let /** @type {HTMLElement} */ previewKit
let /** @type {HTMLElement} */ videoLayoutComponent
let /** @type {HTMLElement} */ usersComponent
let /** @type {HTMLElement} */ controlsComponent
let /** @type {HTMLElement} */ settingsComponent
let /** @type {HTMLElement} */ chatComponent


export default {
    openPreview: (/** @type {HTMLElement} */ container) => {
        previewKit = document.createElement('app-previewkit')
        container.append(previewKit)
    },
    closePreview: (/** @type {HTMLElement} */ container) => {
        if(previewKit) {
            container.removeChild(previewKit)
        } else {
            console.log('Cannot close preview since preview is not opened.')
        }
    },
    joinSession: (/** @type {HTMLElement} */ container, /** @type {Object} */ config) => {
        if (!uitoolKit) {
            uitoolKit = document.createElement('app-uitoolkit')
            uitoolKit.setAttribute("config", JSON.stringify(config))
            container.append(uitoolKit)
        } else {
            console.log('Cannot join session since it is already joined.');
        }
    },
    closeSession: (/** @type {HTMLElement} */ container) => {
        if(uitoolKit) {
            container.removeChild(uitoolKit);
            uitoolKit = undefined;
        } else {
            console.log('Cannot close session since session is not joined.')
        }
    },
    onSessionJoined: (/** @type {EventListenerOrEventListenerObject} */ callback) => {
        if(uitoolKit) {
            uitoolKit.addEventListener('sessionJoined', callback)
        } else if (uitoolkitProvider) {
            uitoolkitProvider.addEventListener('sessionJoined', callback)
        } else {
            console.log('Cannot use event listeners before joinSession is called.')
        }
    },
    offSessionJoined: (/** @type {EventListenerOrEventListenerObject} */ callback) => {
        if(uitoolKit) {
            uitoolKit.removeEventListener('sessionJoined', callback)
        } else if (uitoolkitProvider) {
            uitoolkitProvider.removeEventListener('sessionJoined', callback)
        } else {
            console.log('Cannot use event listeners before joinSession is called.')
        }
    },
    onSessionClosed: (/** @type {EventListenerOrEventListenerObject} */ callback) => {
        if(uitoolKit) {
            uitoolKit.addEventListener('sessionClosed', callback)
        } else if (uitoolkitProvider) {
            uitoolkitProvider.addEventListener('sessionClosed', callback)
        } else {
            console.log('Cannot use event listeners before joinSession is called.')
        }
    },
    offSessionClosed: (/** @type {EventListenerOrEventListenerObject} */ callback) => {
        if(uitoolKit) {
            uitoolKit.removeEventListener('sessionClosed', callback)
        } else if (uitoolkitProvider) {
            uitoolkitProvider.removeEventListener('sessionClosed', callback)
        } else {
            console.log('Cannot use event listeners before joinSession is called.')
        }
    },
    showUitoolkitComponents: (/** @type {HTMLElement} */ container, /** @type {Object} */ config) => {
        if (!uitoolkitProvider) {
            uitoolkitProvider = document.createElement('uitoolkit-components')
            uitoolkitProvider.setAttribute("config", JSON.stringify(config))
            container.append(uitoolkitProvider)
        } else {
            console.log('Cannot show wrapper since it is already shown.');
        }
    }, 
    hideUitoolkitComponents: (/** @type {HTMLElement} */ container) => {
        if(uitoolkitProvider) {
            container.removeChild(uitoolkitProvider);
            uitoolkitProvider = undefined;
        } else {
            console.log('Cannot close the provider since the provider is not open.')
        }
    },
    showVideoComponent: (/** @type {HTMLElement} */ container) => {
        if (!videoLayoutComponent) {
            videoLayoutComponent = document.createElement('video-component')
            container.append(videoLayoutComponent);
        } else {
            console.log('Cannot show video component since it is already shown.');
        }
    },
    hideVideoComponent: (/** @type {HTMLElement} */ container) => {
        if(videoLayoutComponent) {
            container.removeChild(videoLayoutComponent);
            videoLayoutComponent = undefined;
        } else {
            console.log('Cannot close the video wrapper since the video wrapper is not open.')
        }
    },    
    showChatComponent: (/** @type {HTMLElement} */ container) => {
        if (!chatComponent) {
            chatComponent = document.createElement('chat-component')
            container.append(chatComponent);
        } else {
            console.log('Cannot show chat component since it is already shown.');
        }
    },
    hideChatComponent: (/** @type {HTMLElement} */ container) => {
        if(chatComponent) {
            container.removeChild(chatComponent);
            chatComponent = undefined;
        } else {
            console.log('Cannot close the chat component since it is not open.')
        }
    },
    showControlsComponent: (/** @type {HTMLElement} */ container) => {
        if (!controlsComponent) {
            controlsComponent = document.createElement('controls-component');
            container.append(controlsComponent);
        } else {
            console.log('Cannot show controls component since it is already shown.');
        }
    },
    hideControlsComponent: (/** @type {HTMLElement} */ container) => {
        if(controlsComponent) {
            container.removeChild(controlsComponent);
            controlsComponent = undefined;
        } else {
            console.log('Cannot close the controls since it is not open.')
        }
    },
    showUsersComponent: (/** @type {HTMLElement} */ container) => {
        if (!usersComponent) {
            usersComponent = document.createElement('users-component')
            container.append(usersComponent);
        } else {
            console.log('Cannot show users component since it is already shown.');
        }
    },
    hideUsersComponent: (/** @type {HTMLElement} */ container) => {
        if(usersComponent) {
            container.removeChild(usersComponent);
            usersComponent = undefined;
        } else {
            console.log('Cannot close the users component since it is not open.')
        }
    },
    showSettingsComponent: (/** @type {HTMLElement} */ container) => {
        if (!settingsComponent) {
            settingsComponent = document.createElement('settings-component')
            container.append(settingsComponent);
        } else {
            console.log('Cannot show settings component since it is already shown.');
        }
    },
    hideSettingsComponent: (/** @type {HTMLElement} */ container) => {
        if(settingsComponent) {
            container.removeChild(settingsComponent);
            settingsComponent = undefined;
        } else {
            console.log('Cannot close the settings component since it is not open.')
        }
    },
    
}