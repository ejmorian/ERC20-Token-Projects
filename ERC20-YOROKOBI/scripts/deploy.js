const { ethers, network } = require("hardhat");
const {verify} = require("../utils/verify")
const {developmentChains} = require("../hardhat-helper-config")

const main = async () => {
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  const yrkbyContractFactory = await ethers.getContractFactory(
    "Yorokobi",
    deployer
  );
  console.log("deploying contract.")
  const yorokobiErc20 = await yrkbyContractFactory.deploy();

  console.log("tx:", yorokobiErc20.deployTransaction.hash);
  await yorokobiErc20.deployTransaction.wait(6);
  console.log("succefully deployed at:", yorokobiErc20.address);

    if(!developmentChains.includes(network.name)){
      console.log("verifying contract...")
      await verify(yorokobiErc20.address, []);
    }else{
      console.log("cannot verify...")
    }

};

main()
  .then(() => process.exit(1))
  .catch((e) => {
    console.error(e);
    process.exit(0);
  });
