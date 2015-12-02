﻿using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.MessageBroker;
using Adaptive.ReactiveTrader.Messaging;
using Adaptive.ReactiveTrader.Server.Blotter;
using Adaptive.ReactiveTrader.Server.Pricing;
using Adaptive.ReactiveTrader.Server.ReferenceDataRead;
using Adaptive.ReactiveTrader.Server.ReferenceDataWrite;
using Adaptive.ReactiveTrader.Server.TradeExecution;
using Common.Logging;
using Common.Logging.Simple;
using EventStore.ClientAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Common.Config;
using Adaptive.ReactiveTrader.EventStore.Connection;
using Adaptive.ReactiveTrader.EventStore.Domain;

namespace Adaptive.ReactiveTrader.Server.Launcher
{
    public class Program
    {
        
        private static readonly Dictionary<string, IDisposable> Servers = new Dictionary<string, IDisposable>();

        private static readonly Dictionary<string, Lazy<IServiceHostFactory>> Factories =
            new Dictionary<string, Lazy<IServiceHostFactory>>();

        private static IBrokerConnection _conn;

        private static IEventStoreConnection _eventStoreConnection;
        private static IConnectionStatusMonitor _connectionStatusMonitor;

        public static void StartService(string name, IServiceHostFactory factory)
        {
            var esConsumer = factory as IEventStoreConsumer;
            esConsumer?.Initialize(_eventStoreConnection, _connectionStatusMonitor);

            Servers.Add(name, _conn.Register(name, factory).Result);
        }

        private static IServiceHostFactory GetFactory(string type)
        {
            switch (type)
            {
                case "p":
                    return Factories["pricing"].Value;

                case "ref":
                    return Factories["reference-read"].Value;
                case "ref-write":
                    return Factories["reference-write"].Value;

                case "exec":
                    return Factories["execution"].Value;

                default:
                    return Factories[type].Value;
            }
        }
        
        public static void InitializeFactories()
        {
            Factories.Add("reference-read", new Lazy<IServiceHostFactory>(() => new ReferenceDataReadServiceHostFactory()));
            Factories.Add("reference-write", new Lazy<IServiceHostFactory>(() => new ReferenceDataWriteServiceHostFactory()));
            Factories.Add("pricing", new Lazy<IServiceHostFactory>(() => new PriceServiceHostFactory()));
            Factories.Add("blotter", new Lazy<IServiceHostFactory>(() => new BlotterServiceHostFactory()));
            Factories.Add("execution", new Lazy<IServiceHostFactory>(() => new TradeExecutionServiceHostFactory()));
        }

        public static void Main(string[] args)
        {
            InitializeFactories();


            try
            {
                LogManager.Adapter = new ConsoleOutLoggerFactoryAdapter
                {
                    ShowLogName = true,
                };

                Log = LogManager.GetLogger<Program>();

        // We should only be using the launcher during development, so hard code this to use the dev config
        var config = ServiceConfiguration.FromArgs(args.Where(a=>a.Contains(".json")).ToArray());
                
                var tuple = GetEventStoreConnection(config.EventStore, args.Contains("es"), args.Contains("init-es")).Result;
                _eventStoreConnection = tuple.Item1;
                _connectionStatusMonitor = tuple.Item2;
                _conn = BrokerConnectionFactory.Create(config.Broker);

                if (args.Contains("mb"))
                    Servers.Add("mb1", MessageBrokerLauncher.Run());

                if (args.Contains("p"))
                    StartService("p1", GetFactory("p"));

                if (args.Contains("ref"))
                    StartService("r1", GetFactory("ref"));

                if (args.Contains("exec"))
                    StartService("e1", GetFactory("exec"));

                if (args.Contains("b"))
                    StartService("b1", GetFactory("blotter"));

                var repository = new Repository(_eventStoreConnection);
             
                _conn.Start();

                if (!args.Contains("--interactive"))
                    while (true)
                        Thread.Sleep(TimeSpan.FromSeconds(1));
                
                while (true)
                {
                    var x = Console.ReadLine();

                    try
                    {
                        if (x == null || x == "exit")
                            break;

                        
                        if (x.StartsWith("start"))
                        {
                            var a = x.Split(' ');

                            var serviceType = a[1];
                            var serviceName = a[2];

                            if (Servers.ContainsKey(serviceName))
                            {
                                Console.WriteLine("Already got a {0}", serviceName);
                                continue;
                            }

                            StartService(serviceName, GetFactory(serviceType));

                            continue;
                        }

                        if (x.StartsWith("switch"))
                        {
                            var a = x.Split(' ');

                            var ccyPair = a[1];

                            var currencyPair =
                                repository.GetById<ReferenceDataWrite.Domain.CurrencyPair>(ccyPair).Result;

                            if (currencyPair.IsActive)
                            {
                                Console.WriteLine("** Deactivating {0}", ccyPair);
                                currencyPair.Deactivate();
                            }
                            else
                            {
                                Console.WriteLine("** Activating {0}", ccyPair);
                                currencyPair.Activate();
                            }

                            repository.SaveAsync(currencyPair).Wait();
                            continue;
                        }


                        if (x.StartsWith("kill"))
                        {
                            var a = x.Split(' ');

                            var serviceName = a[1];

                            Console.WriteLine("Killing service {0}", serviceName);
                            var server = Servers[serviceName];
                            Servers.Remove(serviceName);
                            server.Dispose();
                            continue;
                        }

                        if (x == "status")
                        {
                            Console.WriteLine("Running servers");
                            Console.WriteLine("===============");
                            foreach (var s in Servers.Keys)
                            {
                                Console.WriteLine("{0}", s);
                            }
                            continue;
                        }

                        if (x == "help")
                        {
                            Console.WriteLine("Available Commands");
                            Console.WriteLine("==================");
                            Console.WriteLine("start [r|p|e|b] [name]");
                            Console.WriteLine("kill [name]");
                            Console.WriteLine("status");
                            Console.WriteLine("help");
                            continue;
                        }

                        Console.WriteLine("Didn't understand command {0}", x);
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine("Error handling request");
                        Console.WriteLine(e);
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                Console.ReadLine();
            }
        }

        public static ILog Log { get; set; }

        private static async Task<Tuple<IEventStoreConnection, IConnectionStatusMonitor>> GetEventStoreConnection(IEventStoreConfiguration configuration, bool embedded, bool populate)
        {
            var eventStoreConnection = EventStoreConnectionFactory.Create(embedded ? EventStoreLocation.Embedded : EventStoreLocation.External, configuration);
            IConnectionStatusMonitor monitor = new ConnectionStatusMonitor(eventStoreConnection);

            await eventStoreConnection.ConnectAsync();

            if (embedded || populate)
                ReferenceDataHelper.PopulateRefData(eventStoreConnection).Wait();

            return Tuple.Create(eventStoreConnection, monitor);
        }
    }
}