const { ethers, network } = require("hardhat");
const {verify} = require("../utils/verify")

const main = async () => {
    const deployer = await ethers.getSigner();
    const contractFactory = await ethers.getContractFactory("Beri", deployer);

    console.log("deploying contract")
    const beri = await contractFactory.deploy("Beri", "Beri");
    
    console.log("tx", beri.deployTransaction.hash)
    await beri.deployTransaction.wait(4);

    console.log("contract succesfully deployed at:", beri.address);

    args = ["Beri", "Beri"];

    if(network.name.includes("sepolia")){
        await verify(beri.address, args);
    }else{
        console.log("can not verify in this network...")
    }

}

main().then(() => process.exit(1)).catch((e) => {
    console.error(e);
    process.exit(0);
})