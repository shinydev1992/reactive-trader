# Reactive Trader

[![Circle CI](https://circleci.com/gh/AdaptiveConsulting/AdaptiveTrader.svg?style=svg&circle-token=801547883329d22e505634493b58b26fbb742e46)](https://circleci.com/gh/AdaptiveConsulting/AdaptiveTrader)

## Overview

Reactive Trader 2 is a real-time FX trading platform demo showcasing reactive programming principles applied across the full application stack.

Improvements have been made across the board since the first Reactive Trader. The UI is revamped with a modern Javascript framework (React), and an event sourcing approach is used by the backend services for data resiliency.

All frameworks and libraries used are entirely open source, and each component can be run on either Windows, Linux or Mac OS.

The services are also distributed and are capable of recovery from disconnections. This demonstrates an approach similar to what is put in practice in major financial institutions for trading systems. 

## Architecture

The backend is made up of distributed services written in .NET leveraging the cross-platform capabilities provided by DNX.

Every component can be deployed via Docker containers. This allows the use of tools such as Kubernetes to facilitate cluster management for resiliency purposes, as well as ease of deployment.

Client-side implementations are available for all major platforms, including desktop browser, OpenFin, Android, iOS, Apple Watch and WPF.

![Architecture Overview](/docs/ArchitectureOverview.png)

## Getting Started

### Windows

If you are familiar with using Visual Studio on Windows.

[Getting Started using Visual Studio 2015](/docs/vs-setup.md)

### Linux

You can also setup a dev environment on Linux.

[Getting Started on Linux](/docs/linux-setup.md)

### Mac OS

And on Mac OS

[Getting Started on Mac OS](/docs/macos-setup.md)

### Docker

The simplest way to run the full application no matter which OS you are running is by using Docker.

[Getting Started using Docker](/docs/docker-setup.md)
