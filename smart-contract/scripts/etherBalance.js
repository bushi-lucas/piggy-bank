const { task } = require("hardhat/config");

task("etherbalance", "Get Ether Balance stored at Piggy Bank Contract belonging to an Address")
    .addPositionalParam("contract")    
    .addPositionalParam("account")
    .setAction(async function (
  taskArguments,
  hre
) {
    const id = taskArguments.account ? taskArguments.account : 0;
    const accounts = await hre.ethers.getSigners();

    const Contract = await hre.ethers.getContractFactory("PiggyBank", accounts[id]);
    const contract = Contract.attach(taskArguments.contract);

    const balance = await contract.connect(accounts[id]).getEtherBalance();
    console.log("Ether Balance: ", balance.toNumber());
});