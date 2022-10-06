const { task } = require("hardhat/config");
const { parseOrdersToObj } = require("../utils/helpers");

task("listorders", "List Placed Orders to Sell Piggy Bank Tokens")
    .addPositionalParam("contract")
    .setAction(async function (
  taskArguments,
  hre
) {
    const accounts = await hre.ethers.getSigners();

    const Contract = await hre.ethers.getContractFactory("PiggyBank", accounts[0]);
    const contract = Contract.attach(taskArguments.contract);

    const orders = await contract.connect(accounts[0]).listOrders();
    const parsedOrders = parseOrdersToObj(orders)

    console.log("Orders: ", parsedOrders);
});