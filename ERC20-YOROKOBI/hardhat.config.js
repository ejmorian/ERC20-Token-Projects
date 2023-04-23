require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PRIVATE_KEY_ONE = process.env.PRIVATE_KEY_ONE;
const PRIVATE_KEY_TWO = process.env.PRIVATE_KEY_TWO;
const PRIVATE_KEY_THREE = process.env.PRIVATE_KEY_THREE;
const SEPOLIA_URL = process.env.SEPOLIA_URL;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
  solidity: "0.8.18",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
    sepolia: {
      url: SEPOLIA_URL,
      chainId: 11155111,
      accounts: [PRIVATE_KEY, PRIVATE_KEY_ONE, PRIVATE_KEY_TWO, PRIVATE_KEY_THREE]
    }
  },
  etherscan: {
    
    apiKey: {sepolia : ETHERSCAN_API_KEY,}

  },
  mocha: {
    setTimeout: 100000,
  }
};
