const { task } = require("hardhat/config");

task("currenttokenprice", "Get Current Token price of Piggy Bank Token")
    .addPositionalParam("contract")
    .setAction(async function (
  taskArguments,
  hre
) {
    const accounts = await hre.ethers.getSigners();

    const Contract = await hre.ethers.getContractFactory("PiggyBank", accounts[0]);
    const contract = Contract.attach(taskArguments.contract);

    const currentTokenPrice = await contract.connect(accounts[0]).getCurrentTokenPrice();
    console.log("Current Token Price: ", currentTokenPrice.toNumber());
});