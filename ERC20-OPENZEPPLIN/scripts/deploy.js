const { ethers } = require("hardhat");

const main = async () => {
    const deployer = await ethers.getSigner();
    const contractFactory = await ethers.getContractFactory("Beri", deployer);

    console.log("deploying contract")
    const beri = await contractFactory.deploy("Beri", "Beri");
    
    console.log("tx", beri.deployTransaction.hash)
    await beri.deployTransaction.wait(1);

    console.log("contract succesfully deployed at:", beri.address);

}


main().then(() => process.exit(1)).catch((e) => {
    console.error(e);
    process.exit(0);
})