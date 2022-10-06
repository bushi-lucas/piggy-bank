const { task } = require("hardhat/config");

task("buyorder", "Buy Piggy Bank Tokens from placed Order")
    .addPositionalParam("contract")
    .addPositionalParam("orderId")
    .addPositionalParam("amount")    
    .addPositionalParam("account")
    .setAction(async function (
  taskArguments,
  hre
) {
    const id = taskArguments.account ? taskArguments.account : 0;
    const accounts = await hre.ethers.getSigners();

    const Contract = await hre.ethers.getContractFactory("PiggyBank", accounts[id]);
    const contract = Contract.attach(taskArguments.contract);

    const order = await token.getOrder(taskArguments.orderId);
    const price = hre.ethers.utils.formatEther(order.price) * parseInt(taskArguments.amount);
    const tx = await contract.connect(accounts[id]).buyOrder(order.id, taskArguments.amount, { value: hre.ethers.utils.parseEther(price.toString())});
    await tx.wait();

    console.log("Buy Order tx: ", tx);
});