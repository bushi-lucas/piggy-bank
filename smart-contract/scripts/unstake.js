const { task } = require("hardhat/config");

task("unstake", "Unstakes Piggy Bank Tokens")
    .addPositionalParam("contract")
    .addPositionalParam("amount")
    .addPositionalParam("account")
    .setAction(async function (
  taskArguments,
  hre
) {
    const accounts = await hre.ethers.getSigners();
    const id = taskArguments.account ? taskArguments.account : 0;

    const Contract = await hre.ethers.getContractFactory("PiggyBank", accounts[id]);
    const contract = Contract.attach(taskArguments.contract);

    const tx = await contract.connect(accounts[id]).unstake(taskArguments.amount);
    await tx.wait();
    console.log("Unstake tx: ", tx);
});