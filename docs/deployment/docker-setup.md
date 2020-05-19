# Docker

- [Docker](#docker)
  - [Docker in really short](#docker-in-really-short)
  - [Why docker](#why-docker)
  - [Installation](#installation)
  - [Configuration](#configuration)
    - [Windows specifics](#windows-specifics)
    - [standard](#standard)

## Docker in really short

In short, docker is like a virtual machine but without the kernel emulation. Every container share the host kernel. For RTC, we use Linux containers that require a Linux kernel.

On Windows or Mac, Linux containers run inside virtual machine. This virtual machine provides the Linux kernel. On Linux, it's the host kernel that is shared with the containers.

## Why docker

One of the biggest benefits is boot time. A container starts in less than one second. This lets us use a multiple of them for tiny tasks. It also provides a really short restart time for services.

As it's a virtual machine implementation, it comes with all the benefits of portability and reusability. A container that runs on a Windows host will run on a Mac host.

## Installation

Docker comes in 2 parts:

- docker client
- docker daemon

The containers run on the daemon. The client let you manipulate the docker daemon. Client and daemon doesn't require to be on the same host.

The installation procedure is different on each OS. Plase follow the installation instructions for **docker-ce** on the [docker official website for your OS][docker] in the \*_Get Docker_ section at the top of the page. When you see the docker helloworld, you're good.

## Configuration

### Windows specifics

- follow the [bash setup instructions][bash-setup]

### All Platforms

- just confirm that you run Linux containers by:
  - right clicking on docker icon
  - confirm that **Switch to Windows containers** is present, showing you are running **Linux containers**
- when you start RTC, answer yes to sharing the RTC folder

[docker]: https://www.docker.com/
[bash-setup]: ./bash-setup.md
