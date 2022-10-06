const { task } = require("hardhat/config");
const { parseOrdersToObj } = require("../utils/helpers");

task("getorder", "Get Placed Order to Sell Piggy Bank Tokens")
    .addPositionalParam("contract")
    .addPositionalParam("orderId")
    .setAction(async function (
  taskArguments,
  hre
) {
    const accounts = await hre.ethers.getSigners();

    const Contract = await hre.ethers.getContractFactory("PiggyBank", accounts[0]);
    const contract = Contract.attach(taskArguments.contract);

    const order = await contract.connect(accounts[0]).getOrder(taskArguments.orderId);
    const parsedOrder = parseOrdersToObj(order)

    console.log("Order: ", parsedOrder);
});