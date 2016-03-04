import React from 'react';
import { router } from '../../../system';
import { ViewBase } from '../../common';
import { WorkspaceModel, WorkspaceItem } from '../model';
import { logger } from '../../../system';
import WorkspaceItemContainer from './workspaceItemContainer.jsx';

var _log:logger.Logger = logger.create('WorkspaceView');

class WorkspaceView extends ViewBase {
  constructor() {
    super();
    this.state = {
      model: null
    }
  }

  render() {
    if(!this.state.model) {
      return null;
    }
    let workspaceItems = this.state.model.workspaceItems;
    return (
      <div className='currency-pairs'>
        {
          workspaceItems.length
            ? this._renderWorkspaceItems(workspaceItems)
            : <div className='text-center'><i className='fa fa-5x fa-cog fa-spin'/></div>
        }
        <div className='clearfix'></div>
      </div>);
  }

  _renderWorkspaceItems(workspaceItems) {
    let _this = this;
    return workspaceItems.map((item:WorkspaceItem) => {
      const className = 'currency-pair animated flipInX '; // + spotTile.state;
      return (
        <WorkspaceItemContainer
          key={item.key}
          onTearOff={() => router.publishEvent(this.props.modelId, 'tearoff', {itemId:item.key})}
          className={className}>
          {item.view}
        </WorkspaceItemContainer>
      );
    });
  }
}

export default WorkspaceView;
