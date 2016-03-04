import Rx from 'rx';
import { OpenFin } from '../system/openFin';
import { Trade, ExecuteTradeRequest, ExecuteTradeResponse } from './model';
import { TradeMapper } from './mappers';
import { logger, SchedulerService } from '../system';
import { Connection, ServiceBase } from '../system/service';

const _log:logger.Logger = logger.create('ExecutionService');

export default class ExecutionService extends ServiceBase {

  static EXECUTION_TIMEOUT_MS = 2000;

  constructor(serviceType:String,
              connection:Connection,
              schedulerService:SchedulerService,
              referenceDataService:ReferenceDataService,
              openFin:OpenFin) {
    super(serviceType, connection, schedulerService);
    this._openFin = openFin;
    this._tradeMapper = new TradeMapper(referenceDataService);
  }

  executeTrade(executeTradeRequest:ExecuteTradeRequest):Rx.Observable<ExecuteTradeResponse> {
    let _this = this;
    return Rx.Observable.create(
      o => {
        _log.info(`executing: ${executeTradeRequest.toString()}`, executeTradeRequest);
        let disposables = new Rx.CompositeDisposable();
        disposables.add(
          _this._openFin
            .checkLimit(executeTradeRequest.spotRate, executeTradeRequest.notional, executeTradeRequest.currencyPair)
            .take(1)
            .subscribe(limitCheckResult => {
              if (limitCheckResult) {
                disposables.add(
                  _this._serviceClient
                    .createRequestResponseOperation('executeTrade', executeTradeRequest)
                    .map(dto => {
                      var trade = _this._tradeMapper.mapFromDto(dto.Trade);
                      _log.info(`execute response received for: ${executeTradeRequest.toString()}. Status: ${trade.status}`, dto);
                      return ExecuteTradeResponse.create(trade);
                    })
                    .timeout(ExecutionService.EXECUTION_TIMEOUT_MS, Rx.Observable.return(ExecuteTradeResponse.createForError('Trade execution timeout exceeded')))
                    .subscribe(o)
                );
              }
              else {
                //TODO
                o.onError(new Error('Openfin integration not finished'));
              }
            })
        );
        return disposables;
      }
    );
  }
}
