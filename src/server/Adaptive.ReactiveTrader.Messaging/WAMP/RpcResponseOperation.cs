﻿using System;
using System.Collections.Generic;
using System.Reactive.Concurrency;
using System.Text;
using System.Threading.Tasks;
using Adaptive.ReactiveTrader.Messaging.Abstraction;
using Common.Logging;
using WampSharp.Core.Serialization;
using WampSharp.V2.Core;
using WampSharp.V2.Core.Contracts;
using WampSharp.V2.Rpc;

namespace Adaptive.ReactiveTrader.Messaging.WAMP
{
    internal class RpcResponseOperation<TResponse> : IWampRpcOperation
    {
        protected static readonly ILog Log = LogManager.GetLogger<RpcOperation>();

        private readonly IScheduler _scheduler = TaskPoolScheduler.Default;
        private readonly Func<IRequestContext, IMessage, Task<TResponse>> _serviceMethod;

        public RpcResponseOperation(string name, Func<IRequestContext, IMessage, Task<TResponse>> serviceMethod)
        {
            Procedure = name;
            _serviceMethod = serviceMethod;
        }

        public string Procedure { get; }

        public void Invoke<TMessage>(IWampRawRpcOperationRouterCallback caller,
                                     IWampFormatter<TMessage> formatter,
                                     InvocationDetails details)
        {
            var dummyDetails = new Dictionary<string, object>();

            caller.Error(WampObjectFormatter.Value,
                         dummyDetails,
                         "wamp.error.runtime_error",
                         new object[] { "Expected parameters" });
        }

        public void Invoke<TMessage>(IWampRawRpcOperationRouterCallback caller,
                                     IWampFormatter<TMessage> formatter,
                                     InvocationDetails details,
                                     TMessage[] arguments)
        {
            InnerInvoke(_serviceMethod, caller, formatter, arguments);
        }

        public void Invoke<TMessage>(IWampRawRpcOperationRouterCallback caller,
                                     IWampFormatter<TMessage> formatter,
                                     InvocationDetails details,
                                     TMessage[] arguments,
                                     IDictionary<string, TMessage> argumentsKeywords)
        {
            InnerInvoke(_serviceMethod, caller, formatter, arguments);
        }

        private void InnerInvoke<T>(Func<IRequestContext, IMessage, Task<TResponse>> serviceMethod,
                                           IWampRawRpcOperationRouterCallback caller,
                                           IWampFormatter<T> formatter,
                                           T[] arguments)
        {
            var dummyDetails = new YieldOptions();

            try
            {
                var x = formatter.Deserialize<MessageDto>(arguments[0]);

                var message = new Message
                {
                    ReplyTo = new WampTransientDestination(x.ReplyTo),
                    Payload = Encoding.UTF8.GetBytes(x.Payload.ToString()) // TODO need to stop this from deserializing
                };

                var userSession = new UserSession
                {
                    Username = x.Username
                };

                var userContext = new RequestContext(message, userSession);

                _scheduler.Schedule(async () =>
                {
                    var response = await serviceMethod(userContext, message);
                    caller.Result(WampObjectFormatter.Value, dummyDetails, new object[] { response });
                });
            }
            catch (Exception e)
            {
                Log.Error(e);
                caller.Error(WampObjectFormatter.Value, dummyDetails, e.Message);
            }
        }
    }
}