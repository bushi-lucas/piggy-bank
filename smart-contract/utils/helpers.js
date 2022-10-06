const parseOrdersToObj = (orders) => {
    const parsedOrders = orders.map((order) => {
        return {
            id: order.id.toNumber(),
            amount: order.amount.toNumber(),
            price: parseFloat(ethers.utils.formatEther(order.price)),
            seller: order.seller,
            active: order.active
        }
    });

    return parsedOrders;
}

module.exports = { parseOrdersToObj };