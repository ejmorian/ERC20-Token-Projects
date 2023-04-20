const { ethers } = require("hardhat");

const main = async () => {
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  const yrkbyContractFactory = await ethers.getContractFactory(
    "Yorokobi",
    deployer
  );
  const yorokobiErc20 = await yrkbyContractFactory.deploy();
  await yorokobiErc20.deployed();
  console.log("succefully deployed at:", yorokobiErc20.address);

  console.log(`Token Name: ${await yorokobiErc20.name()}`);
  console.log(`Token Symbol: ${await yorokobiErc20.symbol()}`);
  console.log(`Total Supply: ${await yorokobiErc20.totalSupply()}`);
  console.log(
    `Deployer Balance: ${await yorokobiErc20.balanceOf(deployer.address)}`
  );
};

main()
  .then(() => process.exit(1))
  .catch((e) => {
    console.error(e);
    process.exit(0);
  });
