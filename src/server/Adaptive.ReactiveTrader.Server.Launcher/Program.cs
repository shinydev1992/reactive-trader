﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Disposables;
using System.Reflection;
using System.Threading;
using Adaptive.ReactiveTrader.Common.Config;
using Adaptive.ReactiveTrader.EventStore;
using Adaptive.ReactiveTrader.EventStore.Connection;
using Adaptive.ReactiveTrader.EventStore.Domain;
using Adaptive.ReactiveTrader.MessageBroker;
using Adaptive.ReactiveTrader.Server.ReferenceDataWrite;
using Common.Logging;
using Common.Logging.Simple;
using EventStore.ClientAPI;
using Adaptive.ReactiveTrader.Common;

namespace Adaptive.ReactiveTrader.Server.Launcher
{
    public class Program
    {
        public readonly ManualResetEvent CtrlC = new ManualResetEvent(false);

        private readonly IServiceLauncher _launcher;
        private IServiceConfiguration _config;
        public bool Running = true;


        public Program(IServiceLauncher serviceLauncher)
        {
            _launcher = serviceLauncher;
        }

        private static IEventStoreConnection GetEventStoreConnection(IEventStoreConfiguration configuration,
            bool embedded)
        {
            var eventStoreConnection =
                EventStoreConnectionFactory.Create(
                    embedded ? EventStoreLocation.Embedded : EventStoreLocation.External, configuration);


            return eventStoreConnection;
        }

        public void Run(IEnumerable<string> arguments)
        {
            var args = ExpandArgs(arguments);

            if (!args.Any() || args.Any(a => a.IsIn("--help", "/?", "-h", "-help")))
            {
                Usage();
                return;
            }

            using (Colour(ConsoleColor.Red))
            {
                Console.WriteLine();
                Console.WriteLine(@"______                _   _             _____             _           ");
                Console.WriteLine(@"| ___ \              | | (_)           |_   _|           | |          ");
                Console.WriteLine(@"| |_/ /___  __ _  ___| |_ ___   _____    | |_ __ __ _  __| | ___ _ __ ");
                Console.WriteLine(@"|    // _ \/ _` |/ __| __| \ \ / / _ \   | | '__/ _` |/ _` |/ _ \ '__|");
                Console.WriteLine(@"| |\ \  __/ (_| | (__| |_| |\ V /  __/   | | | | (_| | (_| |  __/ |   ");
                Console.WriteLine(@"\_| \_\___|\__,_|\___|\__|_| \_/ \___|   \_/_|  \__,_|\__,_|\___|_|   ");
                Console.WriteLine();
            }

            try
            {
                Console.CancelKeyPress += (s, e) =>
                {
                    Console.WriteLine("Termination signal sent.");

                    e.Cancel = true;
                    CtrlC.Set();
                };
                
                var interactive = args.Remove("--interactive");

                LogManager.Adapter = new ConsoleOutLoggerFactoryAdapter
                {
                    ShowLogName = true,
                };

                _config = ServiceConfiguration.FromArgs(args.Where(a => a.Contains(".json")).ToArray());
                args.RemoveAll(a => a.Contains(".json"));

                var populate = args.Remove("--init-es") || args.Remove("--populate-eventstore");
                var embedded = args.Remove("--eventstore");

                if (populate || embedded)
                {
                    var eventStoreConnection = GetEventStoreConnection(_config.EventStore, embedded);
                    eventStoreConnection.ConnectAsync().Wait();

                    if (populate)
                        ReferenceDataHelper.PopulateRefData(eventStoreConnection).Wait();
                }

                if (args.Remove("--message-broker"))
                {
                    MessageBrokerLauncher.Run();

                    using (Colour(ConsoleColor.Green))
                        Console.WriteLine("Started Message Broker");
                }

                foreach (var a in args.ToList())
                {
                    var serviceType = GetServiceType(a);
                    if (serviceType != ServiceType.Unknown)
                    {
                        RunCommand($"start {a}");
                        args.Remove(a);
                    }
                }

                using (Colour(ConsoleColor.Red))
                    foreach (var unhandledCommand in args)
                    {
                        Console.WriteLine("Unrecognised Command:  {0}", unhandledCommand);
                    }

                if (!interactive && !_launcher.GetRunningServers().Any())
                    return;

                if (!interactive)
                {
                    CtrlC.WaitOne();
                    return;
                }

                using (Colour(ConsoleColor.Green))
                {
                    Console.WriteLine();
                    Console.WriteLine("INTERACTIVE MODE - type 'help' for help or 'exit' to EXIT");
                }

                // interactive mode
                while (Running)
                {
                    var x = Console.ReadLine();

                    try
                    {
                        if (x == null || x == "exit" || x == "quit")
                            break;


                        if (RunCommand(x)) continue;

                        if (x == "help" || x == "h" || x == "")
                        {
                        }
                        else
                        {
                            using (Colour(ConsoleColor.Red))
                                Console.WriteLine("Didn't understand command {0}", x);
                        }

                        using (Colour(ConsoleColor.Gray))
                        {
                            Console.WriteLine();
                            Console.WriteLine("Available Commands");
                            Console.WriteLine("==================");
                            Console.WriteLine("start");
                            Console.WriteLine("  p|pricing - launch a pricing service.");
                            Console.WriteLine("  r|reference - launch a reference service.");
                            Console.WriteLine("  b|blotter - launch a blotter service.");
                            Console.WriteLine("  e|execution - launch a trade execution service.");
                            Console.WriteLine("  a|analytics - launch an analytics service.");
                            Console.WriteLine("kill [name] - kills a service (use status to find names).");
                            Console.WriteLine("status - returns a list of running services.");
                            Console.WriteLine("help - show this page.");
                            Console.WriteLine("exit - close the launcher.");
                            Console.WriteLine();
                        }
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

        public static List<string> ExpandArgs(IEnumerable<string> args)
        {
            string[] devArgs =
            {
                "pricing", "reference-read", "execution", "blotter", "analytics", "--interactive",
                "--eventstore", "--message-broker"
            };

            string[] allArgs =
            {
                "pricing", "reference-read", "execution", "blotter", "analytics"
            };
            
            var ret = new List<string>();

            foreach (var a in args)
            {
                if (a == "dev")
                    ret.AddRange(devArgs);
                if (a == "all")
                    ret.AddRange(allArgs);
                else
                    ret.Add(a);
            }
            return ret;
        }

        public bool RunCommand(string x)
        {
            if (x.StartsWith("start"))
            {
                var a = x.Split(' ');

                var serviceType = a[1];

                try
                {
                    var type = GetServiceType(serviceType);
                    var name = _launcher.StartService(type);

                    using (Colour(ConsoleColor.Green))
                        Console.WriteLine("Started {0} Service: {1}", type, name);
                }
                catch (Exception e)
                {
                    using (Colour(ConsoleColor.Red))
                        Console.WriteLine("Could not start service: {0}", e.Message);
                }
                return true;
            }

            if (x.StartsWith("kill"))
            {
                var a = x.Split(' ');

                var serviceName = a[1];

                using (Colour(ConsoleColor.Green))
                {
                    Console.WriteLine("Killing service {0}...", serviceName);
                }
                if (_launcher.KillService(serviceName))
                {
                    using (Colour(ConsoleColor.Green))
                        Console.WriteLine("Service Killed.");
                }
                else
                {
                    using (Colour(ConsoleColor.Red))
                        Console.WriteLine("Service '{0}' does not exist.", serviceName);
                }
                return true;
            }

            if (x == "status")
            {
                using (Colour(ConsoleColor.Green))
                {
                    Console.WriteLine("Running servers");
                    Console.WriteLine("===============");
                    foreach (var s in _launcher.GetRunningServers())
                    {
                        Console.WriteLine("{0}", s);
                    }
                }
                return true;
            }

            if (x.StartsWith("switch"))
            {
                using (var conn = GetEventStoreConnection(_config.EventStore, true))
                {
                    var repository = new Repository(conn);

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
                    return true;
                }
            }

            return false;
        }

        public static ServiceType GetServiceType(string type)
        {
            switch (type)
            {
                case "p":
                case "pricing":
                    return ServiceType.Pricing;

                case "ref":
                case "r":
                case "reference-read":
                case "reference":
                    return ServiceType.Reference;

                case "exec":
                case "e":
                case "execution":
                    return ServiceType.Execution;
                case "b":
                case "blotter":
                    return ServiceType.Blotter;

                case "a":
                case "analytics":
                    return ServiceType.Analytics;
            }

            return ServiceType.Unknown;
        }

        public static void Main(string[] args)
        {
            var p = new Program(new ServiceLauncher());
            p.Run(args);
        }

        private static IDisposable Colour(ConsoleColor colour)
        {
            var previousColour = Console.ForegroundColor;
            Console.ForegroundColor = colour;
            return Disposable.Create(() => Console.ForegroundColor = previousColour);
        }

        private static void Usage()
        {
            Console.WriteLine("Reactive Trader launcher v{0}", Assembly.GetAssembly(typeof (Program)).GetName().Version);
            Console.WriteLine();
            Console.WriteLine("usage dnx run [service] [options]");

            Console.WriteLine();
            Console.WriteLine("service:");
            Console.WriteLine("  p|pricing - launch a pricing service.");
            Console.WriteLine("  r|reference - launch a reference service.");
            Console.WriteLine("  b|blotter - launch a blotter service.");
            Console.WriteLine("  e|execution - launch a trade execution service.");
            Console.WriteLine("  a|analytics - launch an analytics service.");
            Console.WriteLine();
            Console.WriteLine("  all - launches all of the above.");
            Console.WriteLine("  dev - launches all of the above with an embedded eventstore & message broker in interactive mode.");

            Console.WriteLine();
            Console.WriteLine("options:");
            Console.WriteLine("  --interactive - launch in interactive mode");
            Console.WriteLine("  --message-broker - launch with message broker (use when crossbar.io isn't running)");
            Console.WriteLine("  --eventstore - launch with embedded event store");
            Console.WriteLine("  --populate-eventstore|--init-es - populate external event store");
            Console.WriteLine();
        }
    }
}