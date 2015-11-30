﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.EventStore;
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

namespace Adaptive.ReactiveTrader.Server.Launcher
{
    public class Program
    {
        protected static readonly ILog Log = LogManager.GetLogger<Program>();

        static readonly Dictionary<string, IDisposable> Servers = new Dictionary<string, IDisposable>();

        public static void Main(string[] args)
        {
            var uri = "ws://127.0.0.1:8080/ws";
            var realm = "com.weareadaptive.reactivetrader";

            try
            {
                LogManager.Adapter = new ConsoleOutLoggerFactoryAdapter
                {
                    ShowLogName = true,
                };

                var eventStoreConnection = GetEventStoreConnection(args.Contains("es")).Result;

                if (args.Contains("mb"))
                    Servers.Add("mb1", MessageBrokerLauncher.Run());

                var broker = BrokerFactory.Create(uri, realm);

                if (args.Contains("p"))
                    Servers.Add("p1", PriceServiceLauncher.Run(broker.Result).Result);

                if (args.Contains("ref"))
                    Servers.Add("r1", ReferenceDataReaderLauncher.Run(eventStoreConnection, broker.Result).Result);

                if (args.Contains("exec"))
                    Servers.Add("e1", TradeExecutionLauncher.Run(eventStoreConnection, broker.Result).Result);

                if (args.Contains("b"))
                    Servers.Add("b1", BlotterLauncher.Run(eventStoreConnection, broker.Result).Result);

                Console.WriteLine("Press Any Key To Stop...");


                while (true)
                {
                    var x = Console.ReadLine();

                    try
                    {
                        if (x == "exit" || x == "")
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

                            if (serviceType == "r")
                            {
                                Console.WriteLine("Adding reference service");
                                Servers.Add(serviceName,
                                    ReferenceDataReaderLauncher.Run(eventStoreConnection, broker.Result).Result);
                            }

                            if (serviceType == "p")
                            {
                                Console.WriteLine("Adding pricing service");
                                Servers.Add(serviceName, PriceServiceLauncher.Run(broker.Result).Result);
                            }

                            if (serviceType == "e")
                            {
                                Console.WriteLine("Adding exec service");
                                Servers.Add(serviceName, TradeExecutionLauncher.Run(eventStoreConnection, broker.Result).Result);
                            }

                            if (serviceType == "b")
                            {
                                Console.WriteLine("Adding blotter service");
                                Servers.Add(serviceName, BlotterLauncher.Run(eventStoreConnection, broker.Result).Result);
                            }


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

        private static async Task<IEventStoreConnection> GetEventStoreConnection(bool embedded)
        {
            IEventStore eventStore;

            if (embedded)
            {
                eventStore = new EmbeddedEventStore();
                await eventStore.Connection.ConnectAsync();
                await ReferenceDataWriterLauncher.PopulateRefData(eventStore.Connection);
            }
            else
            {
                eventStore = new ExternalEventStore();
                await eventStore.Connection.ConnectAsync();
            }

            return eventStore.Connection;
        }
    }
}