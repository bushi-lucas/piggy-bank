const { task } = require("hardhat/config");

task("removeorder", "Remove Placed Order to Sell Piggy Bank Tokens")
    .addPositionalParam("contract")
    .addPositionalParam("orderId")
    .addPositionalParam("account")
    .setAction(async function (
  taskArguments,
  hre
) {
    const id = taskArguments.account ? taskArguments.account : 0;
    const accounts = await hre.ethers.getSigners();

    const Contract = await hre.ethers.getContractFactory("PiggyBank", accounts[id]);
    const contract = Contract.attach(taskArguments.contract);

    const tx = await contract.connect(accounts[id]).removeOrder(taskArguments.orderId);
    await tx.wait();
    console.log("Remove Order tx: ", tx);
});