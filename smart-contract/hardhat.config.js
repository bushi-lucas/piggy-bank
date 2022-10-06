require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
require("./scripts/deploy.js");
require("./scripts/transfer.js");
require("./scripts/stake.js");
require("./scripts/balance.js");
require("./scripts/stakeReport.js");
require("./scripts/totalSupply.js");
require("./scripts/approve.js");
require("./scripts/allowance.js");
require("./scripts/transferFrom.js");
require("./scripts/mint.js");
require("./scripts/burn.js");
require("./scripts/claimReward.js");
require("./scripts/unstake.js");
require("./scripts/placeOrder.js");
require("./scripts/buyOrder.js");
require("./scripts/withdraw.js");
require("./scripts/updateOrderPrice.js");
require("./scripts/etherBalance.js");
require("./scripts/getOrder.js");
require("./scripts/listOrders.js");
require("./scripts/currentTokenPrice.js");

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [process.env.OWNER_PRIVATE_KEY, process.env.USER1_PRIVATE_KEY],
    },
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [process.env.OWNER_PRIVATE_KEY, process.env.USER1_PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: true,
    currency: "BRL",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
