---
menuItem: mi-docs
---

# Wisdom for Sale

This tutorial introduces you to Reach DApp development and prepares you for more advanced Reach tutorials and projects. It is primarily task-based, but it includes several information sections that you can expand to learn more. Be sure to complete [Quick Start](/en/books/essentials/quick-start/) and [Development Environment](/en/books/essentials/developer-environment/) before proceeding.

# Overview

During this tutorial, you will build [Wisdom for Sale](https://github.com/hagenhaus/wisdom-for-sale), an application that enables two participants, a seller and a buyer, to trade wisdom for currency via a smart contract running on a private Algorand, Ethereum, or Conflux consensus network residing in a Docker container on your computer. Your DApp will create and fund two accounts, one for each participant. Then, it will enable the seller and buyer to make a deal.

<button class="btn btn-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#deal" aria-expanded="false">
  <i class="fas fa-info-circle me-2"></i><span>Seller-Buyer Diagram</span>
</button>

<span class="collapse" id="deal">

The following diagram represents the wisdom-for-sale deal.

<div><img src="seller-buyer.png" class="img-fluid my-4 d-block" width=800 height=314 loading="lazy"></div>

This particular transaction took place on an Algorand devnet. The Algorand cryptocurrency standard token unit is the *ALGO*. As indicated by the final balances in the diagram, the seller received 0.006 ALGO less than the agreed upon price, and the buyer paid 0.003 ALGO more. These expenses represent *gas*, the cost of doing business on a consensus network. The seller paid a little more gas than the buyer because the seller deployed the contract.

<hr style="background-color:#6c757d;opacity:1;height:5px;"/>
</span>

Creating a Reach DApp does *not* entail implementing a smart contract. Rather, it involves using the Reach programming language to describe, step by step, participant interactions from which the Reach compiler derives a smart contract.

<button class="btn btn-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#stf" aria-expanded="false">
  <i class="fas fa-info-circle me-2"></i><span>Develop & Deploy Video</span>
</button>

<span class="collapse" id="stf">

This video provides a mental framework for understanding Reach development and deployment.

<p class="ratio ratio-16x9 my-4" style="max-width:500px;">
  <iframe 
    src="https://www.youtube.com/embed/4MJqPNelqCE" 
    frameborder="0"  
    allowfullscreen>
  </iframe>
</p>

Mentioned in the video are (1) the Reach [JavaScript Standard Library](/en/books/essentials/support-for-js-frontends/) which supports Reach applications by providing properties and methods dealing with accounts, arithmetic, big numbers, comparisons, consensus network providers, contracts, debugging, encryption, randomization, and time, (2) interact objects which are JavaScript objects that enable communication between Reach frontends and backends, explained in detail below, and (3) the Reach Verification Engine which helps to ensure that the immutable smart contract you deploy will run without errors like the error of forgetting to transfer all the otherwise unretrievable tokens out of a smart contract account before the contract exits.

<hr style="background-color:#6c757d;opacity:1;height:5px;"/>
</span>

# Clone the repository

This section shows you how to clone the tutorial repository. Be sure to complete [Quick Start](/en/books/essentials/quick-start/) and [Development Environment](/en/books/essentials/developer-environment/) before proceeding.

1. Clone the [wisdom-for-sale](https://github.com/hagenhaus/wisdom-for-sale) repository:

    ``` nonum
    $ cd ~/reach
    $ git clone https://github.com/hagenhaus/wisdom-for-sale.git
    ```

1. Open the repository in vscode.

    <p><img src="vscode-initial.png" class="img-fluid" width=700 loading="lazy"></p>

1. Copy *index.mjs* and *index.rsh* from the *starter* folder to the *current* folder, and open both new files.

<button class="btn btn-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#rsf" aria-expanded="false">
  <i class="fas fa-info-circle me-2"></i><span>Review Starter Files</span>
</button>

<span class="collapse" id="rsf">

**index.mjs**

``` js
load: https://raw.githubusercontent.com/hagenhaus/wisdom-for-sale/master/starter/index.mjs
```

Below is a line-by-line description:

* Line 1: Import the Reach JS Standard Library loader.
* Line 2: Import the JS backend compiled from index.rsh.
* Line 3: Import a Reach Node.js package to help with command-line i/o.
* Line 5: Hard-code the role. You will change this later.
* Line 6: Display the role.
* Line 8: Load the Reach JS Stdlib for the consensus network specified by `REACH_CONNECTOR_MODE` env var.
* Line 9: Display the consensus network type.
* Line 11: Enable enclosed code to await the fulfillment of promises.
* Line 13: Define empty (for now) object.
* Line 16: Code for when you run this app as the seller.
* Line 17: Define empty (for now) object.
* Line 19: Create an account for the seller. *parseCurrency* transforms units from standard to atomic.
* Line 20: Get a reference to the contract.
* Line 21: Initiate interaction with contract for seller.
* Line 25: Code for when you run this app as the buyer.
* Line 26: Define empty (for now) object.
* Line 29: Call process.exit(0).

**index.rsh**

``` js
load: https://raw.githubusercontent.com/hagenhaus/wisdom-for-sale/master/starter/index.rsh
```

Below is a line-by-line description:

* Line 1: Instruction to the compiler.
* Lines 3-5: Define empty (for now) objects.
* Line 7: Reach standard application initialization.
* Line 8: Define a constant to represent the seller.
* Line 9: Define a constant to represent the buyer.
* Line 10: Finalize participant and other options, and proceed to a Reach step.
* Line 12: Terminate computation.

<hr style="background-color:#6c757d;opacity:1;height:5px;"/>
</span>

# Run the DApp

This section shows you how to run your DApp. Reach can compile your DApp to run on any of the following consensus network types:

* `ALGO-devnet`
* `CFX-devnet`
* `ETH-devnet`

You tell the Reach compiler which type by setting the `REACH_CONNECTOR_MODE` environment variable. One way is to export the variable and then execute `reach run`:

``` nonum
$ export REACH_CONNECTOR_MODE=ALGO-devnet
$ reach run
```

Another is to set the variable and execute `reach run` on the same line:

``` nonum
$ REACH_CONNECTOR_MODE=ALGO-devnet reach run
```

To become familiar, run your DApp in the vscode terminal using combinations of your choice.

> Example output in this tutorial reflects `REACH_CONNECTOR_MODE=ALGO-devnet`.

Where does your DApp run? In your current environment, the Reach Compiler, the consensus network devnets, your application, and the smart contract run on your computer in Docker containers instantiated from Reach Docker images.

<button class="btn btn-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#ebp" aria-expanded="false">
  <i class="fas fa-info-circle me-2"></i><span>Explore Build Output</span>
</button>

<span class="collapse" id="ebp">

Here is sample output:

```
current % REACH_CONNECTOR_MODE=ALGO-devnet reach run
Verifying knowledge assertions
Verifying for generic connector
  Verifying when ALL participants are honest
  Verifying when NO participants are honest
  Verifying when ONLY "Buyer" is honest
  Verifying when ONLY "Seller" is honest
Checked 4 theorems; No failures!
[+] Building 0.2s (7/7) FINISHED
 => [internal] load build definition from Dockerfile                                         0.0s
 => => transferring dockerfile: 234B                                                         0.0s
 => [internal] load .dockerignore                                                            0.0s
 => => transferring context: 75B                                                             0.0s
 => [internal] load metadata for docker.io/reachsh/runner:0.1.5                              0.0s
 => [internal] load build context                                                            0.0s
 => => transferring context: 4.60kB                                                          0.0s
 => CACHED [1/2] FROM docker.io/reachsh/runner:0.1.5                                         0.0s
 => [2/2] COPY . /app                                                                        0.0s
 => exporting to image                                                                       0.0s
 => => exporting layers                                                                      0.0s
 => => writing image sha256:13e69eb72504bbc85074476e5d1183b6ad2734a5eabc9e56c2138023d64a507a 0.0s
 => => naming to docker.io/reachsh/reach-app-current:latest                                  0.0s

Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them
Creating reach2021-10-13t14-26-55z-vcv1_reach-app-current_run ... done

> @reach-sh/current@ index /app
> node --experimental-modules --unhandled-rejections=strict index.mjs

The consensus network is ALGO.
Your role is seller.
```

Below is a line-by-line description:

* Line 1: The Reach Compiler inputs *reach.rsh*.

    <p><img src="reach-run-2.png" class="img-fluid" width=420 loading="lazy"></p>

    And, it outputs *index.main.mjs* consisting of the compiled backend (blue) and the smart contract (dark orange):

    <p><img src="reach-run-3.png" class="img-fluid" width=420 loading="lazy"></p>

* Line 2: The Reach Verification Engine validates the smart contract:

    <p><img src="reach-run-4.png" class="img-fluid" width=420 loading="lazy"></p>

* Lines 10-22: The process builds a Docker image for your application.

    <p><img src="reach-run-5.png" class="img-fluid" width=420 loading="lazy"></p>

    Note the mention of *Dockerfile* and *.dockerignore*. The `reach run` command creates the following set of files, deleting all but *index.main.mjs* on completion:

    ``` nonum
    build/index.main.mjs
    .dockerignore
    .gitignore
    Dockerfile
    package.json
    ```

    For some of your Reach projects, you may find it useful to retain and edit these files, especially *package.json*. To create and retain these files, run `reach scaffold` before running `reach run`.

* Line 24: The process checks the new image for vulnerabilities.

    <p><img src="reach-run-6.png" class="img-fluid" width=420 loading="lazy"></p>

* Line 27: The process runs your app in a container built from the image.

    <p><img src="reach-run-7.png" class="img-fluid" width=420 loading="lazy"></p>

* Line 30-31: Your application outputs these messages.

<hr style="background-color:#6c757d;opacity:1;height:5px;"/>
</span>

# Pass role as argument

This section shows you how to modify the starter app to accept a command-line argument specifying whether to run as the seller or buyer. Although this change does not involve Reach directly, it does emphasize that your application represents two different participants negotiating via the same contract.

1. Find the following line in *index.mjs*:

    ``` js nonum
    const role = 'seller';
    ```

1. Replace it with the code below, and save the file:

    ``` js nonum
    if (process.argv.length < 3 || ['seller', 'buyer'].includes(process.argv[2]) == false) {
      console.log('Usage: reach run index [seller|buyer]');
      process.exit(0);
    }
    const role = process.argv[2];
    ```

1. Open two terminals (i.e. shells), and change directory in both to `~/reach/wisdom-for-sale/current`:

    <p><img src="terminals-empty.png" class="img-fluid" width=700 loading="lazy"></p>

1. Run *one* of the following commands in *both* terminals thereby choosing a consensus network for your environment.

    ``` nonum
    $ export REACH_CONNECTOR_MODE=ALGO-devnet
    $ export REACH_CONNECTOR_MODE=CFX-devnet
    $ export REACH_CONNECTOR_MODE=ETH-devnet
    ```

1. In the Seller Terminal, run your DApp as the seller:

    ``` nonum
    $ reach run index seller
    ```

    When you pass arguments to `reach run`, the first one must be the name of the `index.rsh` file without the extension (i.e. `index`). 
    
    Application output should resemble the following:

    ``` nonum
    The consensus network is ALGO.
    Your role is seller.
    ```

1. In the Buyer Terminal, run your DApp as the buyer:

    ``` nonum
    $ reach run index buyer
    ```

    Output should resemble the following:

    ``` nonum
    The consensus network is ALGO.
    Your role is buyer.
    ```

Later (perhaps after you finish the tutorial) you can replace this simple way of handling command-line arguments in your Reach DApp with a more sophisticated one using one of several Node.js packages like [Minimist](https://www.npmjs.com/package/minimist), [Commander](https://www.npmjs.com/package/commander), [Meow](https://www.npmjs.com/package/meow), [Yargs](https://www.npmjs.com/package/yargs), and [Vorpal](https://www.npmjs.com/package/vorpal).

<button class="btn btn-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#npi" aria-expanded="false">
  <i class="fas fa-info-circle me-2"></i><span>Node Package Integration</span>
</button>

<span class="collapse" id="npi">

Not done yet.

<hr style="background-color:#6c757d;opacity:1;height:5px;"/>
</span>

The [reach](https://github.com/reach-sh/reach-lang/blob/master/reach) script exports only a pre-determined list of environment variables (e.g. `REACH_CONNECTOR_MODE`) within the Docker container where it runs your DApp, so it does not support custom environment variables (e.g. `ROLE=seller reach run`).

# Explore units and balances

This section helps you explore standard and atomic units using the [JavaScript Standard Library](/en/books/essentials/support-for-js-frontends/). Regarding tokens, each consensus network has a (divisible) standard unit and an (indivisible) atomic unit. Users usually want to see standard units. A smart contract, on the other hand, *always* deals with atomic units. So, your DApp needs to convert between the two frequently. `parseCurrency` converts from standard to atomic. `formatCurrency` converts from atomic to standard. 

1. Find the following line in *index.mjs*:

    ``` js nonum
    console.log(`The consensus network is ${stdlib.connector}.`);
    ```

1. Append the following, and run your DApp as seller to view the standard and atomic units for your network:

    ``` js nonum
    console.log(`The standard unit is ${stdlib.standardUnit}`);
    console.log(`The atomic unit is ${stdlib.atomicUnit}`);
    ```

    Output should resemble the following:

    ``` nonum
    The consensus network is ALGO.
    The standard unit is ALGO
    The atomic unit is μALGO
    ```

1. Replace your additions with the following, and run again:

    ``` js nonum
    const suStr = stdlib.standardUnit;
    const auStr = stdlib.atomicUnit;
    console.log(`The standard unit is ${suStr}`);
    console.log(`The atomic unit is ${auStr}`);
    ```

    Output should be the same.

1. Replace your additions with the following, and run again:

    ``` js nonum
    const suStr = stdlib.standardUnit;
    const auStr = stdlib.atomicUnit;
    const toAU = (su) => stdlib.parseCurrency(su);
    const toSU = (au) => stdlib.formatCurrency(au, 4);
    const suBal = 1000;
    console.log(`Balance is ${suBal} ${suStr}`);
    const auBal = toAU(suBal);
    console.log(`Balance is ${auBal} ${auStr}`);
    console.log(`Balance is ${toSU(auBal)} ${suStr}`);
    ```

    Output should resemble the following:

    ``` nonum
    The consensus network is ALGO.
    Balance is 1000 ALGO
    Balance is 1000000000 μALGO
    Balance is 1000 ALGO
    ```

1. Replace your additions with the following:

    ``` js nonum
    const suStr = stdlib.standardUnit;
    const toAU = (su) => stdlib.parseCurrency(su);
    const toSU = (au) => stdlib.formatCurrency(au, 4);
    const iBalance = toAU(1000);
    const showBalance = async (acc) => console.log(`Your balance is ${toSU(await stdlib.balanceOf(acc))} ${suStr}.`);
    ```

    You use `iBalance` and `showBalance` in the next steps.

1. Find and replace Line 1 (below) with Line 2 in *index.mjs* to utilize `iBalance`:

    ``` js
    const acc = await stdlib.newTestAccount(stdlib.parseCurrency(1000));
    const acc = await stdlib.newTestAccount(iBalance);
    ```

1. Insert `showBalance` (as shown below) to show the account balance before and after contract deployment, and run again:

    ``` js nonum
    const acc = await stdlib.newTestAccount(stdlib.parseCurrency(1000));
    await showBalance(acc);
    const ctc = acc.deploy(backend);
    await backend.Seller(ctc, sellerInteract);
    await showBalance(acc);
    ```

    Output should resemble the following:

    ``` nonum
    Your role is seller.
    The consensus network is ALGO.
    Your balance is 1000 ALGO.
    Your balance is 1000 ALGO.
    ```

    Soon, the second balance will reflect the results of transactions and network usage.

# Get contract info (seller)

This section shows you how to have the seller (1) deploy the contract and (2) return the contract information used (later) by the buyer to identify and attach to the contract. Contract information format varies depending on the consensus network. Here are examples:

|Conensus Network|Contract Information Example|
|-|-|
|Algorand|`49`|
|Conflux|`"NET999:TYPE.CONTRACT:ACDWGDGH6DKDAJ528Y5CCWMX8NBVPHXU72S3FPF8CY"`|
|Ethereum|`"0x403372276F841d7451E6417Cc7B17fDD159FE34C"`|

Be sure to include the quotation marks (if present) when you copy & paste contract information from the Seller Terminal to the Buyer Terminal.

1. Find the following line in *index.mjs*:

    ``` js nonum
    const sellerInteract = { ...commonInteract };
    ```

1. Replace it with the following:

    ``` js nonum
    const sellerInteract = { 
      ...commonInteract,
      price: toAU(5),
      reportReady: async (price) => {
        console.log(`Your wisdom is for sale at ${toSU(price)} ${suStr}.`);
        console.log(`Contract info: ${JSON.stringify(await ctc.getInfo())}`);
      }
    };
    ```

1. Find the following line in *index.rsh*:

    ``` js nonum
    const sellerInteract = { ...commonInteract };
    ```

1. Replace it with the following:

    ``` js nonum
    const sellerInteract = {
      ...commonInteract,
      price: UInt,
      reportReady: Fun([UInt], Null),
    };
    ```

1. Add Lines 3-6 for the seller in *index.rsh*, and run your DApp as the seller:

    ``` js
    deploy();

    S.only(() => { const price = declassify(interact.price); });
    S.publish(price);
    S.interact.reportReady(price);
    commit();

    exit();
    ```

    Output should resemble the following:

    ``` nonum
    Your role is seller.
    The consensus network is ALGO.
    Your balance is 1000 ALGO.
    Your wisdom is for sale at 5 ALGO.
    Contract info: 3
    Your balance is 999.996 ALGO.
    ```

    The seller creates the contract, retrieves contract information, and makes it available to the buyer who uses it to find smart contract.

Interact objects facilitate communication between the frontend (i.e. `index.mjs`) and backend (i.e. `index.main.mjs`) of Reach applications. Recall that `index.rsh` is the pre-compiled version of `index.main.mjs`.

<button class="btn btn-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#aio" aria-expanded="false">
  <i class="fas fa-info-circle me-2"></i><span>About Interact Objects</span>
</button>

<span class="collapse" id="aio">

Not done yet.

<hr style="background-color:#6c757d;opacity:1;height:5px;"/>
</span>

# Use contract info (buyer)

START WORKING HERE.

This section shows you how to facilitate communication (for the buyer) between the frontend and backend of your DApp using interact objects.

1. Add an interact object and supporting code to *index.mjs* for the buyer:

    ``` js
    // BUYER
    else {

      // BUYER INTERACT
      const buyerInteract = {
        confirmPurchase: async (price) => await ask(`Do you want to purchase wisdom for ${toSU(price)} ${suStr} (y/n)?`, yesno)
      };

      const acc = await stdlib.newTestAccount(iBalance);
      const info = await ask('Paste contract info:', (s) => JSON.parse(s));
      const ctc = acc.attach(backend, info);
      await showBalance(acc);
      await backend.Buyer(ctc, buyerInteract);
      await showBalance(acc);
    }
    ```

1. Add a corresponding interact object to *index.rsh* (under `sellerInteract`) for the buyer:

    ``` js
    // BUYER INTERACT
    const buyerInteract = {
      confirmPurchase: Fun([UInt], Bool)
    };
    ```

1. Find Line 1 below and change it to Line 2:

    ``` js
    const S = Participant('Buyer', {});
    const S = Participant('Buyer', buyerInteract);
    ```

1. Add actions for buyer in *index.rsh*:

    ``` js
    B.only(() => {
      const willBuy = declassify(interact.confirmPurchase(price));
    });
    B.publish(willBuy);

    if (!willBuy) {
      commit();
    } else {
      commit();
    }
    ```

1. Run the app in the Seller and Buyer Terminals. Provide the contract info to the buyer when prompted. Answer `y` or `n` when asked whether to buy wisdom.

The seller creates the contract, retrieves a contract reference in the form of contract info, and makes the info available to the buyer who uses it to find and run the smart contract.

Each Reach backend action (e.g. `declassify(interact.price)`) takes place within the context of a *local step*, *step*, or *consensus step*. Actions involving one participant take place within a *local step*. Those involving all participants take place within a *step*. Those involving the contract itself take place within a *consensus step*. 

<button class="btn btn-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#as" aria-expanded="false">
  <i class="fas fa-info-circle me-2"></i><span>About Steps</span>
</button>

<span class="collapse" id="as">

Not done yet.

<hr style="background-color:#6c757d;opacity:1;height:5px;"/>
</span>

# Add common interact objects

1. Add a common interact object to *index.mjs*, shared by the seller and buyer:

    ``` js
    // COMMON INTERACT
    const commonInteract = {
      reportCancellation: () => { console.log('The buyer cancelled the order.'); }
    };
    ```

1. Add the `...commonInteract` object to `sellerInteract` and `buyerInteract` in *index.mjs*:

    ``` js
    const sellerInteract = {
      ...commonInteract,
    };

    const buyerInteract = {
      ...commonInteract,
    };
    ```

1. Add a common interact object to *index.rsh*:

    ``` js
    // COMMON INTERACT
    const commonInteract = {
      reportCancellation: Fun([], Null)
    };
    ```

1. Add the `...commonInteract` object to `sellerInteract` and `buyerInteract` in *index.rsh*:

    ``` js
    const sellerInteract = {
      ...commonInteract
    };

    const buyerInteract = {
      ...commonInteract
    };
    ```

1. Report cancellation in *index.rsh*:

    ``` js
    if (!willBuy) {
      commit();
      each([S, B], () => interact.reportCancellation());
      exit();
    } else {
      commit();
    }
    ```

1. Run the app in the Seller and Buyer Terminals. Answer `n` when asked whether to buy wisdom. Both terminals should display the following output:

    ``` nonum
    The buyer cancelled the order.
    ```

1. Modify `commonInteract` in *index.mjs* to accept and use a `role` argument:

    ``` js
    const commonInteract = (role) => ({
      reportCancellation: () => { console.log(`${role == 'buyer' ? 'You' : 'The buyer'} cancelled the order.`); }
    });
    ```

1. Modify `sellerInteract` and `buyerInteract` in *index.mjs* to pass `role` to *commonInteract*:

    ```
    const sellerInteract = {
      ...commonInteract(role),
    }

    const buyerInteract = {
      ...commonInteract(role),
    }
    ```

1. Retest. The app (running as the buyer) should output the following:

    ```
    You cancelled the order.
    ```

# Complete the transaction

1. Modify `commonInteract` in *index.mjs*:

    ``` js
    const commonInteract = (role) => ({
      reportPayment: (payment) => console.log(`${role == 'buyer' ? 'You' : 'The buyer'} paid ${toSU(payment)} ${suStr} to the contract.`),
      reportTransfer: (payment) => console.log(`The contract paid ${toSU(payment)} ${suStr} to ${role == 'seller' ? 'you' : 'the seller'}.`),
      reportCancellation: () => { console.log(`${role == 'buyer' ? 'You' : 'The buyer'} cancelled the order.`); }
    });
    ```

1. Modify `commonInteract` in *index.rsh*:

    ``` js
    const commonInteract = {
      reportPayment: Fun([UInt], Null),
      reportTransfer: Fun([UInt], Null),
      reportCancellation: Fun([], Null)
    };
    ```

1. Add pay and transfer steps in *index.rsh*:

    ``` js
    B.pay(price);
    each([S, B], () => interact.reportPayment(price));
    commit();

    S.only(() => { const wisdom = declassify(interact.wisdom); });
    S.publish(wisdom);
    transfer(price).to(S);
    commit();

    each([S, B], () => interact.reportTransfer(price));
    B.interact.reportWisdom(wisdom);
    ```

1. Test.

# Create the webapp
