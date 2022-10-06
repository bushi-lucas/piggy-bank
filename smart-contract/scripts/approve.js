const { task } = require("hardhat/config");

task("approve", "Approve Account to manage your Piggy Bank Tokens")
    .addPositionalParam("contract")    
    .addPositionalParam("spender")
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

    const tx = await contract.connect(accounts[id]).approve(taskArguments.spender, taskArguments.amount);
    await tx.wait();
    console.log("Approve tx: ", tx);
});