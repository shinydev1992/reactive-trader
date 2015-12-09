# docker

You will find here:
- `build`: the src to generate the containers for the project
  - `base containers` stored on `weareadaptive` at `dockerhub`:
    - `crossbar`: Base OS with crossbar installed
    - `eventstore`: Base OS with eventstore installed
    - `gcloud`: Base OS used to manage creation of googleCloudEngine cluster
    - `mono`: Base OS with mono, DNVM and some dependency libraries.
    - `nginx`: Base OS with nginx insalled
    - `node`: Base OS with node insalled. This container is not used for now
    - `testtools`: Base OS with some dependencies used to test other ones.
  - `ReactiveTrader` containers:
    - `broker`: Auto running container that start the broker
    - `web`: Auto running container that start the web client.
    - `populatedEventstore`: Auto running container that start the eventstore.
    - `servers`: Ship with the .NET code. Every part are ready to run on a start command.
- `run`: the code to start ReactiveTrader using containers.
  - web
  - broker
  - eventstore
  - blotter
  - pricing
  - referenceDataRead
  - tradeExecution
  - analytics
- `prepare`: this command is used to build and push the different containers. It will look for the service folder in the build folder. The build and push commands are used by this script. 
- `runAll`: this command start all the adaptiveTrader services. The only dependency is to have a docker environment. 
- `killAll`: this command kill all the adaptiveTrader services started by the `runAll` command. 


### Install docker on windows/mac:

- go to [toolbox download page](https://www.docker.com/docker-toolbox) and click on your OS (version 1.9.1c on writing moment)
- install
- select virtualbox/docker, kitematic and git are optional
- then launch `Docker Quickstart Terminal`
- run `docker ps` and control that it match the following
```
$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS

```

### Docker Quickstart Terminal tips

- go to `properties` (click on left top corner -> Properties)
- Check `QuickEdit Mode` and `Insert Mode`, 
- go to `layout` and enlarge width to your convenience 
- `copy`: select a zone with the mouse and right click
- `paste`: press `insert` or `right click` under a container
- `.bashrc` file is named `.bash_profile` and need to be placed in your user folder
- on windows, you can create file starting with dot like this: `.bash_profile.` will create `.bash_profile`

### Some known issues

The different scripts here will need to share code with the different containers. On linux you don't have anything to do. On windows and linux, the sharing is between the container and the virtual machine. The virtual machine is defined to share your home folder (/c/Users/ for windows). If your git clone folder is a children folder of your home user, it's fine. Else you need to open VirtualBox and share tht specific folder.

