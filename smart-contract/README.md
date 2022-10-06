# Piggy Bank Smart Contract

Project of a Fungible Token Smart Contract built following the ERC-20 protocol. This contract also have features for Staking and Trading tokens. It was developed using Solidity and Hardhat.

This project was implemented to educational purposes. Use as you wish.

There are a few commands that we can use.

To compile contract:
```shell
npx hardhat compile
```

To deploy contract:

```shell
npx hardhat deploy --network {{network}}
```

To run tests:
```shell
npx hardhat test
```

To transfer tokens:
```shell
npx hardhat transfer {{contractAddress}} {{receiverAddress}} {{amount}} {{accountId}} --network {{network}}
```

To stake tokens:
```shell
npx hardhat stake {{contractAddress}} {{amount}} {{accountId}} --network {{network}}
```

To get token balance of an address:
```shell
npx hardhat balance {{contractAddress}} {{accountAddress}} --network {{network}}
```

To get the stake report of an account:
```shell
npx hardhat stakereport {{contractAddress}} {{accountId}} --network {{network}}
```

To get the total supply of tokens from the contract:
```shell
npx hardhat totalsupply {{contractAddress}} --network {{network}}
```

To approve account to manage your tokens:
```shell
npx hardhat approve {{contractAddress}} {{spenderAddress}} {{amount}} {{accountId}} --network {{network}}
```

To get the amount of tokens an account can manage from another:
```shell
npx hardhat allowance {{contractAddress}} {{spenderAddress}} {{ownerAddress}} --network {{network}}
```

To transfer tokens from managed account:
```shell
npx hardhat transferfrom {{contractAddress}} {{spenderAddress}} {{receiverAddress}} {{amount}} {{accountId}} --network {{network}}
```

To mint tokens to an account:
```shell
npx hardhat mint {{contractAddress}} {{receiverAddress}} {{amount}} --network {{network}}
```

To burn tokens to an account:
```shell
npx hardhat burn {{contractAddress}} {{accountAddress}} {{amount}} --network {{network}}
```

To claim rewards from staked tokens:
```shell
npx hardhat claimreward {{contractAddress}} {{accountId}} --network {{network}}
```

To unstake tokens:
```shell
npx hardhat unstake {{contractAddress}} {{amount}} {{accountId}} --network {{network}}
```

To place an order to sell tokens:
```shell
npx hardhat placeorder {{contractAddress}} {{amount}} {{price}} {{accountId}} --network {{network}}
```

To buy tokens from a placed order:
```shell
npx hardhat buyorder {{contractAddress}} {{orderId}} {{amount}} {{accountId}} --network {{network}}
```

To withdraw eth funds from selled orders:
```shell
npx hardhat withdraw {{contractAddress}} {{accountId}} --network {{network}}
```

To update price per token from placed order:
```shell
npx hardhat updateorderprice {{contractAddress}} {{orderId}} {{price}} {{accountId}} --network {{network}}
```

To get ether balance from an account:
```shell
npx hardhat etherbalance {{contractAddress}} {{accountId}} --network {{network}}
```

To get place order:
```shell
npx hardhat getorder {{contractAddress}} {{orderId}} --network {{network}}
```

To list place orders:
```shell
npx hardhat listorders {{contractAddress}} --network {{network}}
```

To get current token price:
```shell
npx hardhat currenttokenprice {{contractAddress}} --network {{network}}
```