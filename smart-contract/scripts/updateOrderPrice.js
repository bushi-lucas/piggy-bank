const { task } = require("hardhat/config");

task("updateorderprice", "Update Price per Token from placed Order")
    .addPositionalParam("contract")
    .addPositionalParam("orderId")
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

    const tx = await contract.connect(accounts[id]).updateOrderPirce(taskArguments.orderId, taskArguments.price);
    await tx.wait();
    console.log("Update Order Price tx: ", tx);
});