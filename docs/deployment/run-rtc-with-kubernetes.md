# Run Reactive Trader Cloud with kubernetes

- [Run Reactive Trader Cloud with kubernetes](#run-reactive-trader-cloud-with-kubernetes)
  - [Start RTC](#start-rtc)
  - [See it running](#see-it-running)
  - [Stop all the running containers](#stop-all-the-running-containers)

Running RTC with docker is extremely easy

## Build RTC

If you never ran docker-compose up and your images are not built,
in terminal go to ../../src folder and execute the following command:

```bash
docker-compose build
```

Then, run the following command:

```bash
DOCKER_STACK_ORCHESTRATOR=kubernetes docker stack deploy --compose-file ./docker-compose.yml rtcstack
```

## See it running

Open a browser, navigate to the docker address (`localhost`) and the web client will load.

## Stop all the running containers

```bash
docker-compose down
```
