const { task } = require("hardhat/config");

task("totalsupply", "Get the Total Supply of Tokens from Piggy Bank Tokens Contract")
    .addPositionalParam("contract")
    .setAction(async function (
  taskArguments,
  hre
) {
    const accounts = await hre.ethers.getSigners();

    const Contract = await hre.ethers.getContractFactory("PiggyBank", accounts[0]);
    const contract = Contract.attach(taskArguments.contract);

    const totalSupply = await contract.connect(accounts[0]).totalSupply();
    console.log("Total Supply: ", totalSupply.toNumber());
});