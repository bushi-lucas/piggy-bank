const { task } = require("hardhat/config");

task("mint", "Mint Piggy Bank Tokens")
    .addPositionalParam("contract")    
    .addPositionalParam("receiver")
    .addPositionalParam("amount")
    .setAction(async function (
  taskArguments,
  hre
) {
    const accounts = await hre.ethers.getSigners();

    const Contract = await hre.ethers.getContractFactory("PiggyBank", accounts[0]);
    const contract = Contract.attach(taskArguments.contract);

    const tx = await contract.connect(accounts[0]).mint(taskArguments.receiver, taskArguments.amount);
    await tx.wait();
    console.log("Mint tx: ", tx);
});