const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Token Setup", function () {
  let accounts;
  let contractFactory;
  let token;
  let owner;

  it("Should have the correct setup", async function () {
    accounts = await ethers.getSigners();
    contractFactory = await ethers.getContractFactory("PiggyBank");
    token = await contractFactory.deploy(5000000, "Piggy Bank", "PIG", 18);
    await token.deployed();
    owner = accounts[0];
    const supply = await token.totalSupply();
    const ownerBalance = await token.balanceOf(await owner.getAddress());
    const tokenName = await token.name();
    const tokenSymbol = await token.symbol();
    const tokenDecimals = await token.decimals();

    assert.equal(
      supply.toNumber(),
      5000000,
      "Contract has not the correct initial supply"
    );

    assert.equal(
      ownerBalance.toNumber(),
      5000000,
      "Owner has not all tokens at begining"
    );

    assert.equal(
      tokenName,
      "Piggy Bank",
      "Contract has not the correct name"
    );

    assert.equal(
      tokenSymbol,
      "PIG",
      "Contract has not the correct symbol"
    );

    assert.equal(
      tokenDecimals,
      18,
      "Contract decimals is not correct"
    );
  });
});
