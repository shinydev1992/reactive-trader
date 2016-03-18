import { ModelBase } from '../../common';
import { Router, observeEvent } from 'esp-js/src';
import { RegionModelRegistration } from './';
import { logger } from '../../../system';

export default class RegionModel extends ModelBase {
  _regionName:string;
  _log:logger.Logger;

  modelRegistrations:Array<RegionModelRegistration>

  constructor(modelId:string, regionName:string, router:Router) {
    super(modelId, router);
    this._regionName = regionName;
    this._log = logger.create(`Region-${this._regionName}`);
    this.modelRegistrations = [];
  }

  @observeEvent('init')
  _onInit() {
    this._log.info('Region initialised');
  }

  get regionName() {
    return this._regionName;
  }

  addToRegion(model:ModelBase, context:?string) {
    this.router.runAction(this.modelId, ()=>{
      this.modelRegistrations.push(new RegionModelRegistration(
        model,
        context
      ));
    });
  }

  removeFromRegion(modelId:string) {

  }
}
