const { task } = require("hardhat/config");

task("burn", "Burn Piggy Bank Tokens")
    .addPositionalParam("contract")    
    .addPositionalParam("account")
    .addPositionalParam("amount")
    .setAction(async function (
  taskArguments,
  hre
) {
    const accounts = await hre.ethers.getSigners();

    const Contract = await hre.ethers.getContractFactory("PiggyBank", accounts[0]);
    const contract = Contract.attach(taskArguments.contract);

    const tx = await contract.connect(accounts[0]).burn(taskArguments.account, taskArguments.amount);
    await tx.wait();
    console.log("Burn tx: ", tx);
});