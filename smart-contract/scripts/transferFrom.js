const { task } = require("hardhat/config");

task("transferfrom", "Transfers Piggy Bank Tokens from managed account.")
    .addPositionalParam("contract")
    .addPositionalParam("spender")    
    .addPositionalParam("receiver")
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

    const tx = await contract.connect(accounts[id]).transferFrom(taskArguments.spender, taskArguments.receiver, taskArguments.amount);
    await tx.wait();
    console.log("Transfer From tx: ", tx);
});