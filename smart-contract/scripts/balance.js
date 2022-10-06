const { task } = require("hardhat/config");

task("balance", "Get Balance of Piggy Bank Tokens from Address")
    .addPositionalParam("contract")    
    .addPositionalParam("account")
    .setAction(async function (
  taskArguments,
  hre
) {
    const accounts = await hre.ethers.getSigners();

    const Contract = await hre.ethers.getContractFactory("PiggyBank", accounts[0]);
    const contract = Contract.attach(taskArguments.contract);

    const balance = await contract.connect(accounts[0]).balanceOf(taskArguments.account);
    console.log("Balance: ", balance.toNumber());
});