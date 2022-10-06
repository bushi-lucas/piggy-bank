const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

const { parseOrdersToObj } = require("../utils/helpers");

describe("Token Trade", function () {
    let accounts;
    let contractFactory;
    let token;
    let owner;
    let lucas;
    let matheus;

    it("Contract initial order setup", async function () {
        accounts = await ethers.getSigners();
        contractFactory = await ethers.getContractFactory("PiggyBank");
        token = await contractFactory.deploy(5000000, "PiggyBank", "PIG", 18);
        await token.deployed();
        owner = accounts[0];

        const orders = await token.listOrders();

        assert.equal(
            orders.length,
            1,
            "Contract was not initialized with 1 order."
        );

        assert.equal(
            orders[0].amount.toNumber(),
            5000000,
            "Initial order amount is not correct."
        );

        assert.equal(
            ethers.utils.formatEther(orders[0].price),
            0.01,
            "Initial token price is not correct."
        );

        assert.equal(
            orders[0].seller,
            await owner.getAddress(),
            "Initial seller is not the owner."
        );

        const currentTokenPrice = await token.getCurrentTokenPrice();

        assert.equal(
            ethers.utils.formatEther(currentTokenPrice),
            0.01,
            "Initial token price is not correct."
        );
    });

    it("Should be possible to buy an amount of tokens from a placed order", async function () {
        let ownerEtherBalance = await token.getEtherBalance();
        lucas = accounts[1];

        assert.equal(
            ethers.utils.formatEther(ownerEtherBalance),
            0,
            "Initial owner ether balance is not correct."
        );

        let order = await token.getOrder(0);
        const amount = 10000;
        const price = ethers.utils.formatEther(order.price) * amount;
        const tx = await token.connect(lucas).buyOrder(order.id, amount, { value: ethers.utils.parseEther(price.toString())});
        await tx.wait();

        order = await token.getOrder(0);
        assert.equal(
            order.amount.toNumber(),
            4990000,
            "Order remaining amount did not update correctly."
        );

        const lucasBalance = await token.balanceOf(await lucas.getAddress());

        assert.equal(
            lucasBalance.toNumber(),
            amount,
            "Lucas balance did not update correctly."
        );

        ownerEtherBalance = await token.getEtherBalance();

        assert.equal(
            ethers.utils.formatEther(ownerEtherBalance),
            price,
            "Owner ether balance did not updated correctly."
        );
    });

    it("Should be possible to place a new order", async function () {
        const cheapAmount = 1000;
        const expensiveAmount = 4000;
        const cheapPrice = ethers.utils.parseEther("0.005");
        const expensivePrice = ethers.utils.parseEther("0.1");
        const cheapTx = await token.connect(lucas).placeOrder(cheapAmount, cheapPrice);
        await cheapTx.wait();

        let orders = await token.listOrders();

        assert.equal(
            orders.length,
            2,
            "Number of orders did not update correctly."
        );

        let order = await token.getOrder(orders[orders.length - 1].id);

        assert.equal(
            ethers.utils.formatEther(order.price),
            0.005,
            "Order price is not correct."
        );

        assert.equal(
            order.seller,
            await lucas.getAddress(),
            "Order seller is not correct."
        );

        assert.equal(
            order.amount,
            cheapAmount,
            "Order amount is not correct."
        );

        const expensiveTx = await token.connect(lucas).placeOrder(expensiveAmount, expensivePrice);
        await expensiveTx.wait();

        orders = await token.listOrders();
        assert.equal(
            orders.length,
            3,
            "Number of orders did not update correctly."
        );

        order = await token.getOrder(orders[orders.length - 1].id);

        assert.equal(
            ethers.utils.formatEther(order.price),
            0.1,
            "Order price is not correct."
        );

        assert.equal(
            order.seller,
            await lucas.getAddress(),
            "Order seller is not correct."
        );

        assert.equal(
            order.amount,
            expensiveAmount,
            "Order amount is not correct."
        );
    });

    it("Should update current price when a order with different price is bought", async function () {
        const orders = await token.listOrders();

        const parsedOrders = parseOrdersToObj(orders);

        const ordersByPrice = parsedOrders.sort((a,b) => a.price - b.price);

        matheus = accounts[2];

        const amount = ordersByPrice[0].amount / 2;
        const price = ordersByPrice[0].price * amount;

        let lucasEtherBalance = await token.connect(lucas).getEtherBalance();

        assert.equal(
            ethers.utils.formatEther(lucasEtherBalance),
            0,
            "Initial lucas ether balance is not correct."
        );

        const tx = await token.connect(matheus).buyOrder(ordersByPrice[0].id, amount, { value: ethers.utils.parseEther(price.toString())});
        await tx.wait();

        const order = await token.getOrder(ordersByPrice[0].id);

        assert.equal(
            order.amount.toNumber(),
            ordersByPrice[0].amount - amount,
            "Order remaining amount did not update correctly."
        );

        const matheusBalance = await token.balanceOf(await matheus.getAddress());

        assert.equal(
            matheusBalance.toNumber(),
            amount,
            "Matheus balance did not update correctly."
        );

        lucasEtherBalance = await token.connect(lucas).getEtherBalance();

        assert.equal(
            ethers.utils.formatEther(lucasEtherBalance),
            price * 0.99,
            "Lucas ether balance did not updated correctly."
        );

        const currentPrice = await token.getCurrentTokenPrice();

        assert.equal(
            parseFloat(ethers.utils.formatEther(order.price)),
            parseFloat(ethers.utils.formatEther(currentPrice)),
            "Current token price did not update correctly."
        );
    });

    it("Should be possible to remove a placed order", async function () {
        const orders = await token.listOrders();
        const parsedOrders = parseOrdersToObj(orders);
        const lucasAddress = await lucas.getAddress();
        const lucasOrders = await parsedOrders.filter((order) => order.seller === lucasAddress);
        const lucasBalance = await token.balanceOf(lucasAddress);
        const tx = await token.connect(lucas).removeOrder(lucasOrders[0].id);
        await tx.wait();
        const order = await token.getOrder(lucasOrders[0].id);

        assert.equal(
            order.active,
            false,
            "Order did not became inactive."
        );

        const newBalance = await token.balanceOf(lucasAddress);

        assert.equal(
            lucasBalance.toNumber() + lucasOrders[0].amount,
            newBalance.toNumber(),
            "Lucas balance did not update correctly."
        );
    });

    it("Should be possible to withdraw ether funds", async function () {
        const lucasAccountBalanceBefore = await lucas.getBalance();
        const lucasEtherBalanceBefore = await token.connect(lucas).getEtherBalance();

        const tx = await token.connect(lucas).withdraw();
        await tx.wait();

        const lucasAccountBalanceAfter = await lucas.getBalance();

        // console.log("Gas Price: ", ethers.utils.formatEther(tx.gasPrice) * 45328);
        // console.log("Account Ether Difference: ", ethers.utils.formatEther(lucasAccountBalanceAfter) - ethers.utils.formatEther(lucasAccountBalanceBefore));
        // console.log("Difference ether retrieved from ether balance: ", 2.475 - (ethers.utils.formatEther(lucasAccountBalanceAfter) - ethers.utils.formatEther(lucasAccountBalanceBefore)));

        // 0.001 is to take gas in account. It is certainly greater than the amount of gas acctually spent
        assert.isAbove(
            ethers.utils.formatEther(lucasAccountBalanceAfter) - ethers.utils.formatEther(lucasAccountBalanceBefore),
            ethers.utils.formatEther(lucasEtherBalanceBefore) - 0.001,
            "Lucas Account Ether Balance did not update correctly"
        )
    });

    it("Should be to update order price", async function () {        
        const orders = await token.listOrders();
        const parsedOrders = parseOrdersToObj(orders);
        const lucasAddress = await lucas.getAddress();
        const lucasOrders = await parsedOrders.filter((order) => order.seller === lucasAddress);
    
        const tx = await token.connect(lucas).updateOrderPrice(lucasOrders[1].id, ethers.utils.parseEther("0.01"));
        await tx.wait();

        const order = await token.getOrder(lucasOrders[1].id);

        assert.equal(
            ethers.utils.formatEther(order.price),
            0.01,
            "Order price did not update correctly."
        );
    });

    it("Should not be possible to place an order with more than you own", async function () {
        const lucasBalance = await token.balanceOf(await lucas.getAddress());

        await expect(token.connect(lucas).placeOrder(lucasBalance.toNumber() + 1000, ethers.utils.parseEther("0.1"))).to.be.revertedWith(
            "Token: cannot place an order with more than you own"
        );
    });

    it("Should not be possible to place an order with null price or amount", async function () {
        await expect(token.connect(lucas).placeOrder(0, ethers.utils.parseEther("0.1"))).to.be.revertedWith(
            "Tradable: you can only place a sell order of a positive non null amount"
        );

        await expect(token.connect(lucas).placeOrder(10, 0)).to.be.revertedWith(
            "Trabable: you order token price must be postive and not null"
        );
    });

    it("Should not be possible to remove an order which is not yours", async function () {
        await expect(token.removeOrder(2)).to.be.revertedWith(
            "Tradable: that order is not yours"
        );
    });

    it("Should not be possible to remove an order inactive", async function () {
        await expect(token.connect(lucas).removeOrder(1)).to.be.revertedWith(
            "Tradable: order was already removed or buyed"
        );
    });

    it("Should not be possible to buy an amount greater than placed at order", async function () {
        const order = await token.getOrder(2);
        const amount = order.amount.toNumber() + 100;
        const price = ethers.utils.formatEther(order.price) * amount;
        await expect(token.buyOrder(order.id, amount, { value: ethers.utils.parseEther(price.toString())})).to.be.revertedWith(
            "Tradable: cannot buy amount greater than placed on order."
        );
    });

    it("Should not be possible to buy an order with less than it costs", async function () {
        const order = await token.getOrder(2);
        const amount = order.amount.toNumber();
        const price = (ethers.utils.formatEther(order.price) * amount) / 2;
        await expect(token.buyOrder(order.id, amount, { value: ethers.utils.parseEther(price.toString())})).to.be.revertedWith(
            "Token: ether sent must be greater or equal orderPrice."
        );
    });

    it("Should not be possible to buy your own order", async function () {
        const order = await token.getOrder(2);
        const amount = order.amount.toNumber();
        const price = (ethers.utils.formatEther(order.price) * amount);
        await expect(token.connect(lucas).buyOrder(order.id, amount, { value: ethers.utils.parseEther(price.toString())})).to.be.revertedWith(
            "Tradable: you cannot buy your own order"
        );
    });
    

    it("Should not be possible to buy an inactive order", async function () {
        const order = await token.getOrder(1);
        const amount = order.amount.toNumber();
        const price = (ethers.utils.formatEther(order.price) * amount);
        await expect(token.buyOrder(order.id, amount, { value: ethers.utils.parseEther(price.toString())})).to.be.revertedWith(
            "Tradable: order was already removed or buyed"
        );
    });

    it("Should not be possible to withdraw from empty ether balance", async function () {
        await expect(token.connect(lucas).withdraw()).to.be.revertedWith(
            "Token: no ether left to withdraw."
        );
    });
});