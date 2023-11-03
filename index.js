import * as ui from './dist/videosdk-ui-toolkit.js'

let /** @type {HTMLElement} */ uitoolKit
let /** @type {HTMLElement} */ previewKit

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
        uitoolKit = document.createElement('app-uitoolkit')
        uitoolKit.setAttribute("config", JSON.stringify(config))
        container.append(uitoolKit)
    },
    closeSession: (/** @type {HTMLElement} */ container) => {
        if(uitoolKit) {
            container.removeChild(uitoolKit)
        } else {
            console.log('Cannot close session since session is not joined.')
        }
    },
    onSessionJoined: (/** @type {EventListenerOrEventListenerObject} */ callback) => {
        if(uitoolKit) {
            uitoolKit.addEventListener('sessionJoined', callback)
        } else {
            console.log('Cannot use event listeners before joinSession is called.')
        }
    },
    offSessionJoined: (/** @type {EventListenerOrEventListenerObject} */ callback) => {
        if(uitoolKit) {
            uitoolKit.removeEventListener('sessionJoined', callback)
        } else {
            console.log('Cannot use event listeners before joinSession is called.')
        }
    },
    onSessionClosed: (/** @type {EventListenerOrEventListenerObject} */ callback) => {
        if(uitoolKit) {
            uitoolKit.addEventListener('sessionClosed', callback)
        } else {
            console.log('Cannot use event listeners before joinSession is called.')
        }
    },
    offSessionClosed: (/** @type {EventListenerOrEventListenerObject} */ callback) => {
        if(uitoolKit) {
            uitoolKit.removeEventListener('sessionClosed', callback)
        } else {
            console.log('Cannot use event listeners before joinSession is called.')
        }
    }
}