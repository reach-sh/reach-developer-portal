---
menuItem: mi-docs
---

# Quick Start

This page shows you how to run a Reach *Hello World* decentralized application (DApp) in a terminal:

## Install prerequisites

1. Install [GNU Make](https://www.gnu.org/software/make/) or verify your installation:

    ``` nonum
    $ make -v
    GNU Make 4.3
    ```

1. Install [Docker](https://docs.docker.com/get-docker/) or verify your installation:

    ``` nonum
    $ docker -v
    Docker version 20.10.5
    ```

## Install Reach

1. Create a *reach* directory:

    ``` nonum
    $ mkdir ~/reach
    $ cd ~/reach
    ```

1. Download the [reach](https://github.com/reach-sh/reach-lang/blob/master/reach) script to the *reach* directory:

    ``` nonum
    $ curl https://docs.reach.sh/reach -o reach ; chmod +x reach
    ```

1. Verify that you can run the reach script:

    ``` nonum
    $ ./reach version
    reach 0.1
    ```

1. Download Reach Docker images:

    ``` nonum
    $ ./reach update
    ```

## Create the app

1. Create a project subfolder (as a child of `~/reach`):

    ``` nonum
    $ mkdir hello-world
    $ cd hello-world
    ```

1. Create source files:

    ``` nonum
    $ ~/reach/reach init
    Writing index.rsh...
    Writing index.mjs...
    Done.
    ```

    *index.mjs* is the JS frontend, and *index.rsh* is the Reach backend. We defer code analysis until the [Tutorials](/en/books/essentials/tutorials/).

## Run the app

1. Run the DApp on a local dockerized Ethereum devnet:

    ``` nonum
    $ ~/reach/reach run
    ...
    Hello, Alice and Bob!
    Launching...
    Starting backends...
    Goodbye, Alice and Bob!
    ```

    You could also use `REACH_CONNECTOR_MODE=ETH-devnet ~/reach/reach run`.

1. Run the DApp on a local dockerized Algorand devnet:

    ``` nonum
    $ REACH_CONNECTOR_MODE=ALGO-devnet ~/reach/reach run
    ...
    Hello, Alice and Bob!
    Launching...
    Starting backends...
    Goodbye, Alice and Bob!
    ```

1. Run the DApp on a local dockerized Conflux devnet:

    ``` nonum
    $ REACH_CONNECTOR_MODE=CFX-devnet ~/reach/reach run
    ...
    Hello, Alice and Bob!
    Launching...
    Starting backends...
    Goodbye, Alice and Bob!
    ```

## Next Steps

1. Watch the [Overview Video](/en/books/essentials/) (if you haven't already).
1. Set up a [Development Environment](/en/books/essentials/development-environment/).
1. Start the [Tutorials](/en/books/essentials/tutorials/).
