import React from 'react';
import ReactDOM from 'react-dom';
import {PopoutOptions} from './';
import {logger} from '../../../system';
import PopoutServiceBase from './popoutServiceBase';
import _ from 'lodash';
import './popoutRegion.scss';

let POPOUT_CONTAINER_ID = 'popout-content-container';

let _log:logger.Logger = logger.create('BrowserPopoutService');

export default class BrowserPopoutService extends PopoutServiceBase {
  constructor() {
    super();
  }

  openPopout(options:PopoutOptions, view:React.Component) {
    let popoutContainer;
    let windowOptionsString = this._getWindowOptionsString(options.windowOptions);
    _log.debug(`Opening child window url:${options.url},title:${options.title}`);
    let childWindow = window.open(options.url, options.title, windowOptionsString);
    let onloadHandler = () => {
      _log.debug(`Popout window loading`);
      childWindow.document.title = options.title;
      popoutContainer = childWindow.document.createElement('div');
      popoutContainer.id = POPOUT_CONTAINER_ID;
      childWindow.document.body.appendChild(popoutContainer);
      ReactDOM.render(view, popoutContainer);
    };
    childWindow.onbeforeunload = () => {
      ReactDOM.unmountComponentAtNode(popoutContainer);

      if (options.onClosing) {
        options.onClosing();
      }
    };
    childWindow.onload = onloadHandler;
  }

  _getWindowOptionsString(options = {height: 400, width: 400}) {
    const top = ((window.innerHeight - options.height) / 2) + window.screenY;
    const left = ((window.innerWidth - options.width) / 2) + window.screenX;
    let windowOptions = Object.assign({
      top,
      left
    }, options);

    return Object.keys(windowOptions)
                .map(key => `${key}=${this._mapWindowOptionValue(windowOptions[key])}`)
                .join(',');
  }

  _mapWindowOptionValue(value) {
    if (_.isBoolean(value)) {
      return value ? 'yes' : 'no';
    }
    return value;
  }
}
