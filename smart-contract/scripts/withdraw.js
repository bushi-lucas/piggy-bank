const { task } = require("hardhat/config");

task("withdraw", "Withdraw ETH funds from selled Orders")
    .addPositionalParam("contract")
    .addPositionalParam("account")
    .setAction(async function (
  taskArguments,
  hre
) {
    const accounts = await hre.ethers.getSigners();
    const id = taskArguments.account ? taskArguments.account : 0;

    const Contract = await hre.ethers.getContractFactory("PiggyBank", accounts[id]);
    const contract = Contract.attach(taskArguments.contract);

    const tx = await contract.connect(accounts[id]).withdraw();
    await tx.wait();
    console.log("Withdraw tx: ", tx);
});