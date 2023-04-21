const {assert, expect} = require("chai")
const { network, ethers } = require("hardhat")
const {developmentChains} = require("../../hardhat-helper-config")

developmentChains.includes(network.name) ? 
describe.skip : 
describe("Sepolia Live Test Network", () => {
    let deployer, userOne, userTwo, userThree, contract;


    //get contract and accounts
    before(async ()=> { 
        [deployer, userOne, userTwo, userThree] = await ethers.getSigners();
        contract = await ethers.getContractAt("Yorokobi", "0xf5641bBA29546bb48032748114b74E041150c69B");

    })

    describe("Token holder can transfer to other accounts", ()=> {
        let initialSenderBalance, initialRecieverBalance, value;

        before(async() => {
            value = 150; //YRKBY
            initialSenderBalance = await contract.balanceOf(deployer.address)
            initialRecieverBalance = await contract.balanceOf(userOne.address)

        })


        it("deducts sent value from sender balance", async ()=> {
            const deployerContract = await contract.connect(deployer)
            const tx = await deployerContract.transfer(userOne.address, value)
            await tx.wait(1)

            const currentSenderBalance = await contract.balanceOf(deployer.address);
            assert.equal(currentSenderBalance.toString(), initialSenderBalance.sub(value).toString());
        })

        it("adds value to reciever balance", async () => {
            const curentRecieverBalance = await contract.balanceOf(userOne.address);
            assert.equal(curentRecieverBalance.toString(), initialRecieverBalance.add(value).toString());
        })
    })




})