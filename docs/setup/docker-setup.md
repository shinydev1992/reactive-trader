# Running on Docker

The following instructions have been tested on: 
- Windows 7 / 10
- Ubuntu 14.04.3 / 15.10
- OS X 10.11.2 (15C50) / kernel 15.2.0

If you have any issues with this process, please have a look [here](docker-issues.md). We have list some of the known problems that may occur.

## Install docker for your OS

Follow the steps [here](https://docs.docker.com/engine/installation/) for instructions for your specific OS/distribution.

We also propose a [complete guide for Ubuntu 14.04.3](ubuntu-complete-guide.md).

## Check your docker
#### Start toolbox for Windows/Mac user:
Launch `Docker Quickstart Terminal` - this will start a default virtual machine on which your containers will run. You'll see something like

```
                        ##         .
                  ## ## ##        ==
               ## ## ## ## ##    ===
           /"""""""""""""""""\___/ ===
      ~~~ {~~ ~~~~ ~~~ ~~~~ ~~~ ~ /  ===- ~~~
           \______ o           __/
             \    \         __/
              \____\_______/

docker is configured to use the default machine with IP 192.168.99.100
For help getting started, check out the docs at https://docs.docker.com
``` 

Note the IP address as we'll use it to load the client later.

Docker toolbox runs an Ubuntu virtual machine. This VM automatically shares your user folders. Building ReactiveTrader needs to share some code with the containers inside the VM. Please make sure that your cloned project is under your user folder. E.g.: `c:\Users\myname\repository\reactivetradercloud` is perfect. 

#### Linux users
Just check that docker is running with:

```bash
docker ps
```
This should output:

```bash
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES

```

## Clone the repository

For windows user, note that the line ending on your OS is `CRLF`. All script are written in bash and most of them will run inside Linux containers. The expected line ending are `LF` and `CRLF` will break some of the script.
This can be easily fixed by asking git to not update `LF` to `CRLF` when clone the repository. 

Before cloning :
```bash
git config --global core.autocrlf false
```

## End to end

If all you want is to quickly run ReactiveTrader, you can move to the [Run Reactive Trader part](#run-reactive-trader).

This step will control that everything is working:  
 - download all the base containers to build the project
 - build all services
 - run ReactiveTrader
 - test ReactiveTrader
 - stop ReactiveTrader
 
```bash
cd deploy/e2e
./e2e.sh
```

If everything is fine, you should see something like that at the end of the script:
```bash
  Finished:    Adaptive.ReactiveTrader.Server.IntegrationTests
=== TEST EXECUTION SUMMARY ===
   Adaptive.ReactiveTrader.Server.IntegrationTests  Total: 8, Errors: 0, Failed: 0, Skipped: 0, Time: 9.818s

==============================
Stop ReactiveTrader containers

e34c506a599c555c91987923aa46752db106ea829c24db13cc3c998b14109317
93d6c3027f19540fedb197c0767d9f45fa730b9a86df25489a5840c97c21af3b
83640cd4e0e3537999fa5d42a9d26a3167ddd75ee54634956f12e8bffc82156d
105d166f2b85300a6563b9a8b79409270693fc28eb6b7713bcac8a98bd1f2e1b
8f00e46caf8b811593cc2b61f11ea214f2e524fc2b51e22a7dbc4dc0f1491e21
5e954aec1ec2872bb530b270c2bfb20cfcd885b2c466e4124487e0e42f5c9751
267be6d366486d63601678db8e94d363df4967fc8be50c2cd1bac11c1978c471
2b37c25a5876615bffbf23cdf5f2b85ffd08d68f89b3562501715059466df13c
 
=============
Time details:
Tue Jan 19 11:19:32 GMT 2016
Tue Jan 19 11:33:23 GMT 2016
```

Note that the time for all this process is mostly defined by your internet bandwidth.

## Build
 
If the e2e step have passed, you are now confident that the setup is fine.  
We can look at how to manually build `Reactive Trader`.

Move to the docker folder
```bash
cd deploy/docker
```

You will find here these scripts:
- prepare (to build and push)
- runAll
- testAll
- killAll

First, define a `BUILD_ID`. It's a string that will tag your containers. `mytest` or `1` are good choices. Here we will use `localtest`.    
Then build all the ReactiveTrader services.
```bash
./prepare build services localtest
```

you can look to your generated docker images:
```bash
docker images
```
should output something like that:
```bash
TO ADD
```

## Run Reactive Trader

if you have followed the `build` step before, use the `build_id` you have defined:
```bash
$ cd deploy/docker
$ ./runAll localtest
```

else, you can run the app by using our pre-built containers.
In order to run the latest one, execute:
```bash
$ cd deploy/docker
$ ./runAll
```

Inspect the running containers:

```bash
$ docker ps
```

Should give you something similar to:

```bash
$ docker ps
CONTAINER ID        IMAGE                             COMMAND                  CREATED             STATUS              PORTS               NAMES
ba36323ecc73        reactivetrader/servers:0.0.769    "bash -c 'dnx -p Adap"   29 seconds ago      Up 23 seconds                           analytics
e116fa85abdb        reactivetrader/servers:0.0.769    "bash -c 'dnx -p Adap"   30 seconds ago      Up 24 seconds                           blotter
b69e619c1059        reactivetrader/servers:0.0.769    "bash -c 'dnx -p Adap"   31 seconds ago      Up 25 seconds                           tradeexecution
fa50bfc6a88a        reactivetrader/servers:0.0.769    "bash -c 'dnx -p Adap"   32 seconds ago      Up 26 seconds                           pricing
93f19b26ee0f        reactivetrader/servers:0.0.769    "bash -c 'dnx -p Adap"   33 seconds ago      Up 27 seconds                           reference
86d3f0ce7e9e        reactivetrader/broker:0.0.769     "/bin/sh -c 'crossbar"   34 seconds ago      Up 28 seconds                           broker
8cea2e5eceec        reactivetrader/eventstore:0.0.769 "/bin/sh -c './run-no"   35 seconds ago      Up 29 seconds                           eventstore
05c18462d3c5        reactivetrader/web:0.0.769        "bash -c 'cp /localho"   35 seconds ago      Up 30 seconds                           web
```

Open a browser, navigate to the docker address (localhost for linux users and something like 192.168.99.100 for windows/mac users) and the web client will load.

## Test ReactiveTrader
After having started ReactiveTrader, you can run the test script to controll that everything is fine.

If you build/run with a `build_id` (ie: `localtest`): 
```bash
./testAll localtest
```

else
```bash
./testAll
```

This should output something like this:
```bash
TO ADD
```

## Stop all the containers
You can then stop all the containers with:
```bash
$ ./killAll
```

that should list the containers ids.
