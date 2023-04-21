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

    describe("Token Holder can grant allowance to other accounts", () => {

        let initialRecieverBalance, value, allowance;

        before(async() => {
            value = 250;
            allowance = "1000";
            initialRecieverBalance = await contract.balanceOf(userTwo.address)

        })

        it("grants allowance to third-party accounts", async () => {


            const deployerContract = await contract.connect(deployer);
            const tx = await deployerContract.approve(userOne.address, allowance)
            await tx.wait(1)
            assert.equal((await contract.allowance(deployer.address, userOne.address)).toString(), allowance)
        })

        it("third-party accounts can transfer token from another account", async () => {
            const userContract = await contract.connect(userOne);
            const tx = await userContract.transferFrom(deployer.address, userTwo.address, value)
            await tx.wait(1)

            currentRecieverBalance = await contract.balanceOf(userTwo.address)

            assert.equal(currentRecieverBalance.toString(), initialRecieverBalance.add(value).toString())
        })

        it("allowance is updated when consumed", async () => {
            const remainingAllowance = await contract.allowance(deployer.address, userOne.address);
            assert.equal(remainingAllowance, Number(allowance)-value);
        })

    })


})