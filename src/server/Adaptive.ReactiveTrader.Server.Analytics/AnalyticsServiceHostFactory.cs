﻿using System;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Common;
using Adaptive.ReactiveTrader.Contract;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Blotter;
using Common.Logging;
using EventStore.ClientAPI;
using System.Reactive.Linq;
using Adaptive.ReactiveTrader.Server.Core;

namespace Adaptive.ReactiveTrader.Server.Analytics
{
    public class AnalyticsServiceHostFactory : IServiceHostFactoryWithEventStore, IDisposable
    {
        protected static readonly ILog Log = LogManager.GetLogger<AnalyticsServiceHostFactory>();

        private AnalyticsService _service;
        private TradeCache _cache;

        public Task<ServiceHostBase> Create(IBroker broker)
        {
            return Task.FromResult<ServiceHostBase>(new AnalyticsServiceHost(_service, broker));
        }

        public void Dispose()
        {
            _cache.Dispose();
        }

        public IDisposable Initialize(IObservable<IConnected<IBroker>> broker)
        {
            return null;
        }

        public IDisposable Initialize(IObservable<IConnected<IBroker>> brokerStream, IObservable<IConnected<IEventStoreConnection>> eventStoreStream)
        {
            _cache = new TradeCache(eventStoreStream);

            var doneTrades = _cache.GetTrades()
                .SelectMany(t => t.Trades)
                .Where(t => t.Status == TradeStatusDto.Done);

            var engine = new AnalyticsEngine(doneTrades);

            _service = new AnalyticsService(engine);

            return brokerStream.LaunchOrKill(broker => new AnalyticsServiceHost(_service, broker))
                .Subscribe();
        }
    }
}