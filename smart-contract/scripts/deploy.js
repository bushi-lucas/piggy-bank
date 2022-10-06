const { task } = require("hardhat/config");

task("deploy", "Deploys Token.sol contract").setAction(async function (
  taskArguments,
  hre
) {
  const [deployer] = await hre.ethers.getSigners();

  const Token = await hre.ethers.getContractFactory("PiggyBank", deployer);
  const token = await Token.deploy(5000000, "PiggyBank", "PIG", 18);

  await token.deployed();
  console.log(`Piggy Bank Contract deployed to address: ${token.address}`);
});
