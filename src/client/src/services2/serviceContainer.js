import system from 'system';
import PricingService from './pricingService';
import ReferenceDataService from './referenceDataService';
import BlotterService from './blotterService';
import ExecutionService from './executionService';
import AnalyticsService from './analyticsService';
import * as model from './model';

var _log:system.logger.Logger = system.logger.create('ServiceContainer');

export default class ServiceContainer {
  _connection:system.service.Connection;
  _pricingService:PricingService;
  _referenceDataService:PricingService;
  _blotterService:BlotterService;
  _executionService:ExecutionService;
  _analyticsService:AnalyticsService;
  _serviceStatusStream: Rx.Observable<model.ServiceStatusSummaryLookup>;
  _currentServiceStatusSummaryLookup : model.ServiceStatusSummaryLookup;

  constructor() {
    var url = 'ws://' + location.hostname + ':8080/ws', realm = 'com.weareadaptive.reactivetrader';
    var schedulerService = new system.SchedulerService();
    var autobahnProxy = new system.service.AutobahnConnectionProxy(url, realm);
    this._connection = new system.service.Connection('LMO', autobahnProxy);

    this._pricingServiceClient = new system.service.ServiceClient(model.ServiceConst.PricingServiceKey, this._connection, schedulerService);
    this._referenceDataServiceClient = new system.service.ServiceClient(model.ServiceConst.ReferenceServiceKey, this._connection, schedulerService);
    this._blotterServiceClient = new system.service.ServiceClient(model.ServiceConst.BlotterServiceKey, this._connection, schedulerService);
    this._executionServiceClient = new system.service.ServiceClient(model.ServiceConst.ExecutionServiceKey, this._connection, schedulerService);
    this._analyticsServiceClient = new system.service.ServiceClient(model.ServiceConst.AnalyticsServiceKey, this._connection, schedulerService);

    this._pricingService = new PricingService(this._pricingServiceClient, schedulerService);
    this._referenceDataService = new ReferenceDataService(this._referenceDataServiceClient, schedulerService);
    this._blotterService = new BlotterService(this._blotterServiceClient, schedulerService);
    this._executionService = new ExecutionService(this._executionServiceClient, schedulerService);
    this._analyticsService = new AnalyticsService(this._analyticsServiceClient, schedulerService);

    this._serviceStatusStream = this._createServiceStatusStream();
    this._currentServiceStatusSummaryLookup = new model.ServiceStatusSummaryLookup();
  }

  /**
   * A true/false stream indicating if we're connected on the wire
   * @returns {*}
   */
  get connectionStatusStream():Rx.Observable<Boolean> {
    return this._connection.connectionStatusStream;
  }

  /**
   * The current isConnected status
   * @returns {*}
   */
  get isConnected():Boolean {
    return this._connection.isConnected;
  }

  /**
   * A stream of ServiceStatusSummaryLookup which can be queried for individual service connection status
   * @returns {Rx.Observable.<model.ServiceStatusSummaryLookup>}
   */
  get serviceStatusStream() : Rx.Observable<model.ServiceStatusSummaryLookup> {
    return this._serviceStatusStream;
  }

  /**
   * THe current ServiceStatusSummaryLookup
   * @returns {model.ServiceStatusSummaryLookup}
   */
  get currentServiceStatus() : model.ServiceStatusSummaryLookup {
    return this._currentServiceStatusSummaryLookup;
  }

  get pricingService() {
    return this._pricingService;
  }

  get referenceDataService() {
    return this._referenceDataService;
  }

  get blotterService() {
    return this._blotterService;
  }

  get executionService() {
    return this._executionService;
  }

  get analyticsService() {
    return this._analyticsService;
  }

  connect() {
    _log.info('Connect called');
    this._pricingServiceClient.connect();
    this._referenceDataServiceClient.connect();
    this._blotterServiceClient.connect();
    this._executionServiceClient.connect();
    this._analyticsServiceClient.connect();
    this._serviceStatusStream.subscribe(update => {
      this._currentServiceStatusSummaryLookup = update;
    });
    this._connection.connect();
  }

  _createServiceStatusStream() : Rx.Observable<model.ServiceStatusSummaryLookup>{
    return Rx.Observable.merge(
      this._pricingServiceClient.serviceStatusSummaryStream,
      this._referenceDataServiceClient.serviceStatusSummaryStream,
      this._blotterServiceClient.serviceStatusSummaryStream,
      this._executionServiceClient.serviceStatusSummaryStream,
      this._analyticsServiceClient.serviceStatusSummaryStream
    )
      .scan((lookup:model.ServiceStatusSummaryLookup, summary:system.service.ServiceStatusSummary) => lookup.update(summary), new model.ServiceStatusSummaryLookup())
      .publish()
      .refCount();
  }
}

var serviceContainer = new ServiceContainer();
serviceContainer.connect();

export default serviceContainer;
