const { task } = require("hardhat/config");

task("placeorder", "Place Order to Sell Piggy Bank Tokens")
    .addPositionalParam("contract")
    .addPositionalParam("amount")
    .addPositionalParam("price")
    .addPositionalParam("account")
    .setAction(async function (
  taskArguments,
  hre
) {
    const id = taskArguments.account ? taskArguments.account : 0;
    const accounts = await hre.ethers.getSigners();

    const Contract = await hre.ethers.getContractFactory("PiggyBank", accounts[id]);
    const contract = Contract.attach(taskArguments.contract);

    const tx = await contract.connect(accounts[id]).placeOrder(taskArguments.amount, taskArguments.price);
    await tx.wait();
    console.log("Place Order tx: ", tx);
});