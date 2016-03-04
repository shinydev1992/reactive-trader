import { Router, model, observeEvent } from 'esp-js/src';
import { ReferenceDataService, PricingService, ExecutionService } from '../../../services';
import { CurrencyPairUpdates } from '../../../services/model';
import { logger } from '../../../system';
import { ServiceStatus } from '../../../system/service';
import { CurrencyPair } from '../../../services/model';
import { ModelBase } from '../../common';
import { GetSpotStreamRequest, SpotPrice, Direction, ExecuteTradeRequest } from '../../../services/model';
import { TileStatus } from './';

var _log:logger.Logger = logger.create('SpotTileModel');

let modelIdKey = 1;

export default class SpotTileModel extends ModelBase {
  _referenceDataService:ReferenceDataService;
  _pricingService:PricingService;
  _executionService:ExecutionService;
  _currencyPair:CurrencyPair;

  currentSpotPrice:SpotPrice;
  canTrade:Boolean;
  status:TileStatus;
  historicMidSportRates:Array<Number>;
  notificationMessage:String;
  shouldShowChart:Boolean;
  titleTitle:String;
  notional:Number;

  constructor(currencyPair:CurrencyPair, // in a real system you'd take a specific state object, not just a piece of state as we do here
              router,
              referenceDataService:ReferenceDataService,
              pricingService:PricingService,
              executionService:ExecutionService) {
    super((`spotTileModel` + modelIdKey++), router);
    this._referenceDataService = referenceDataService;
    this._pricingService = pricingService;
    this._executionService = executionService;
    this._currencyPair = currencyPair;

    this.status = TileStatus.Listening;
    this.historicMidSportRates = [];
    this.shouldShowChart = true;
    this.titleTitle = currencyPair.symbol;
    this.notificationMessage = null;
    this.notional = null;
  }

  @observeEvent('init')
  _onInit() {
    _log.info(`Cash tile starting for pair ${this._currencyPair.symbol}`);
    this._subscribeToPriceStream();
    this._subscribeToConnectionStatus();
  }

  @observeEvent('tileClosed')
  _onTileClosed() {
    _log.info(`Cash tile closing`);
  }

  @observeEvent('toggleSparkLineChart')
  _onToggleSparkLineChart() {
    _log.debug(`toggling spark line chart`);
  }

  @observeEvent('notificationMessageDismissed')
  _onNotificationMessageDismissed() {
    _log.debug(`message dismissed`);
    this.notificationMessage = null;
  }

  @observeEvent('executeTrade')
  _onExecuteTrade(direction:Direction) {
    let request = new ExecuteTradeRequest(
      this._currencyPair.symbol,
      direction == Direction.Buy ? this.currentSpotPrice.ask : this.currentSpotPrice.bid,
      direction,
      this.notional,
      direction == Direction.Buy ? this._currencyPair.base : this._currencyPair.terms
    );
    _log.info(`Will execute ${request.toString()}`);
  }

  get hasNotificationMessage() {
    return this.notificationMessage !== null;
  }

  _subscribeToPriceStream() {
    this.addDisposable(
      this._pricingService
        .getSpotPriceStream(new GetSpotStreamRequest(this._currencyPair.symbol))
        .subscribeWithRouter(
          this.router,
          this._modelId,
          (price:SpotPrice) => {
            this.currentSpotPrice = price;
            this.historicMidSportRates.push(price.mid.rawRate);
          },
          err => {
            _log.error('Error on getSpotPriceStream stream stream', err);
          }
        )
    );
  }

  _subscribeToConnectionStatus() {
    let serviceStatusStream = Rx.Observable.combineLatest(
      this._pricingService.serviceStatusStream,
      this._executionService.serviceStatusStream,
      (pricingStatus, executionStatus) => {
        return {
          pricingStatus: pricingStatus,
          executionStatus: executionStatus
        };
      });
    this.addDisposable(
      serviceStatusStream.subscribeWithRouter(
        this.router,
        this._modelId,
        (statusTuple:{pricingStatus:ServiceStatus, executionStatus:ServiceStatus}) => {
            this.canTrade =
              statusTuple.executionStatus == ServiceStatus.isConnected &&
              executionStatus.executionStatus == ServiceStatus.isConnected;
        })
    );
  }
}
