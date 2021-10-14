---
menuItem: mi-docs
---

# Wisdom for Sale

This tutorial introduces you to Reach DApp development and prepares you for more advanced Reach tutorials and projects. It is primarily task-based, but it includes several Learn More buttons throughout. Be sure to complete [Quick Start](/en/books/essentials/quick-start/) and [Development Environment](/en/books/essentials/developer-environment/) before proceeding.

# Overview

During this tutorial, you will build command-line and webapp versions of [Wisdom for Sale](https://github.com/hagenhaus/wisdom-for-sale), an application that enables two participants, a seller and a buyer, to trade wisdom for currency via a smart contract running on a private Algorand, Ethereum, or Conflux consensus network (e.g. devnet) residing in a Docker container on your computer. Your DApp will create and fund two accounts, one for each participant. Then, it will enable the seller and buyer to make a deal.

<button class="btn btn-success btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#deal" aria-expanded="false">
  <i class="fas fa-info-circle me-2"></i><span>Seller-Buyer Diagram</span>
</button>

<span class="collapse" id="deal">

The following diagram represents the wisdom-for-sale deal.

<div><img src="seller-buyer.png" class="img-fluid my-4 d-block" width=800 height=317 loading="lazy"></div>

This particular transaction took place on an Ethereum devnet. The Ethereum cryptocurrency standard token unit is the *Ether* or *ETH*. The tutorial also allows you to perform this transaction on an Algorand or Conflux devnet. The Algorand standard unit is the *ALGO*, and the Conflux standard unit is the *CFX*. As indicated by the final balances in the diagram, the seller received 0.0019 ETH less than the agreed upon price, and the buyer paid 0.0003 ETH more. These expenses represent *gas*, the cost of doing business on a consensus network. The seller paid a little more gas than the buyer because the seller deployed the contract.

<hr style="background-color:green;opacity:1;height:5px;"/>
</span>

Creating a Reach DApp does *not* entail implementing a smart contract. Rather, it involves using the Reach programming language to describe, step by step, participant interactions from which the Reach compiler derives a smart contract.

<button class="btn btn-success btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#stf" aria-expanded="false">
  <i class="fas fa-info-circle me-2"></i><span>Develop-Deploy Video</span>
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

<hr style="background-color:green;opacity:1;height:5px;"/>
</span>

# Clone the repository

# Run the app

# Pass arguments

# Use the Reach Stdlib

Add the following just below `const stdlib = loadStdlib(process.env)`:

``` js
const suStr = stdlib.standardUnit;
const toAU = (su) => stdlib.parseCurrency(su);
const toSU = (au) => stdlib.formatCurrency(au, 4);
const iBalance = toAU(1000);
const showBalance = async (acc) => console.log(`Your balance is ${toSU(await stdlib.balanceOf(acc))} ${suStr}.`);
```

Explain each of these.

Replace `stdlib.parseCurrency(1000)` with `iBalance`.

Add `showBalance` in two places like this:

``` js
const acc = await stdlib.newTestAccount(iBalance);
await showBalance(acc);
const ctc = acc.deploy(backend);
await backend.Seller(ctc, {});
await showBalance(acc);
```

Run the app in the Seller Terminal. Here is the output:

``` nonum
The consensus network is ETH.
Your role is seller.
Your balance is 1000 ETH.
Your balance is 1000 ETH.
```

# Add seller interact

## Add seller frontend interact

Add an interact object to *index.mjs* for the seller.

``` js
// SELLER INTERACT
const sellerInteract = {
  price: toAU(5),
  wisdom: 'Scatter sunshine.',
  reportReady: async (price) => {
    console.log(`Your wisdom is for sale at ${toSU(price)} ${suStr}.`);
    console.log(`Contract info for buyer: ${await ctc.getInfo()}.`);
  }
};
```

Replace `await backend.Seller(ctc, {})` with `await backend.Seller(ctc, sellerInteract);`.

## Add seller backend interact

Add a corresponding interact object to *index.rsh* for the seller.

``` js
// SELLER INTERACT
const sellerInteract = {
  price: UInt,
  wisdom: Bytes(128),
  reportReady: Fun([UInt], Null)
};
```

Replace `const S = Participant('Seller', {})` with `const S = Participant('Seller', sellerInteract)`.

## Add seller local step

Add a local step for seller:

``` js
S.only(() => { const price = declassify(interact.price); });
S.publish(price);
S.interact.reportReady(price);
commit();
```

## Test seller interact

Run in the Seller Terminal:

``` nonum
The consensus network is ETH.
Your role is seller.
Your balance is 1000 ETH.
Your wisdom is for sale at 5 ETH.
Contract info for buyer: 0xbBD687F2cCa8AC0cB4c51ff0Da9632eF32aC1F7D.
Your balance is 999.9998 ETH.
```

# Add buyer interact

## Add buyer frontend interact

``` js
// BUYER INTERACT
const buyerInteract = {
  confirmPurchase: async (price) => await ask(`Do you want to purchase wisdom for ${toSU(price)} ${suStr} (y/n)?`, yesno)
};
```

```
const acc = await stdlib.newTestAccount(iBalance);
const info = await ask('Paste contract info:', (s) => s);
const ctc = acc.attach(backend, info);
await showBalance(acc);
await backend.Buyer(ctc, buyerInteract);
await showBalance(acc);
```

## Add buyer backend interact

``` js
// BUYER INTERACT
const buyerInteract = {
  confirmPurchase: Fun([UInt], Bool)
};
```

Replace `const B = Participant('Buyer', {})` with `const B = Participant('Buyer', buyerInteract)`.

## Add buyer local step

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

## Test buyer interact

Run both the seller and buyer roles. Copy the contract information from the Seller Terminal to the Buyer Terminal.

# Add common interact

## Add common frontend interact

``` js
// COMMON INTERACT
const commonInteract = {
  reportCancellation: () => { console.log('The buyer cancelled the order.'); }
};
```

Add a `...commonInteract,` property to `sellerInteract` and `buyerInteract`.

## Add common backend interact

``` js
// COMMON INTERACT
const commonInteract = {
  reportCancellation: Fun([], Null)
};
```

Add a `...commonInteract,` property to `sellerInteract` and `buyerInteract`.

## Add willBuy conditional

Modify the `if` statement:

``` js
if (!willBuy) {
  commit();
  each([S, B], () => interact.reportCancellation());
  exit();
} else {
  commit();
}
```

## Test common interact

Run both the seller and buyer roles. When prompted, cancel the transaction.

```
The buyer cancelled the order.
```

## Add "who" and retest

``` js
const commonInteract = (who) => ({
  reportCancellation: () => { console.log(`${who == 'buyer' ? 'You' : 'The buyer'} cancelled the order.`); }
});
```

Add a `...commonInteract(role),` property to `sellerInteract` and `buyerInteract`.

Retest.

```
You cancelled the order.
```

# Complete the transaction

## Modify frontend common interact

```
const commonInteract = (who) => ({
  reportPayment: (payment) => console.log(`${who == 'buyer' ? 'You' : 'The buyer'} paid ${toSU(payment)} ${suStr} to the contract.`),
  reportTransfer: (payment) => console.log(`The contract paid ${toSU(payment)} ${suStr} to ${who == 'seller' ? 'you' : 'the seller'}.`),
  reportCancellation: () => { console.log(`${who == 'buyer' ? 'You' : 'The buyer'} cancelled the order.`); }
});
```

## Modify backend common interact

```
const commonInteract = {
  reportPayment: Fun([UInt], Null),
  reportTransfer: Fun([UInt], Null),
  reportCancellation: Fun([], Null)
};
```

## Add pay and transfer steps

```
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

## Test pay and transfer steps

