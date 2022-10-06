const { task } = require("hardhat/config");

task("stakereport", "Get the Report of Stakes from Account")
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

    const stakeReport = await contract.connect(accounts[id]).stakeReport();
    console.log("Amount Staked: ", stakeReport[1].toNumber());
    console.log("Reward to be claimed: ", stakeReport[0].toNumber());
});