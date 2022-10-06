const { task } = require("hardhat/config");

task("allowance", "Get Amount of Tokens an Account can manage from another.")
    .addPositionalParam("contract")    
    .addPositionalParam("spender")
    .addPositionalParam("owner")
    .setAction(async function (
  taskArguments,
  hre
) {
    const accounts = await hre.ethers.getSigners();

    const Contract = await hre.ethers.getContractFactory("PiggyBank", accounts[0]);
    const contract = Contract.attach(taskArguments.contract);

    const allowance = await contract.connect(accounts[0]).allowance(taskArguments.owner, taskArguments.spender);
    console.log("Allowance: ", allowance.toNumber());
});