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

    describe("Token holder can transfer to other accounts", async()=> {

        
    })


})