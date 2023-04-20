const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20 Yorokobi", () => {

  let contract, deployerContract, userContract, userContractTwo, deployer, user, userTwo, value;

  beforeEach(async () => {
    value = "50";

    deployer = await ethers.getSigner();
    user = await ethers.getSigner(1);
    userTwo = await ethers.getSigner(2);

    // console.log("deploying contract...");

    //arrange the deployment
    const deployerContractFactory = await ethers.getContractFactory("Yorokobi", deployer);
    deployerContract = await deployerContractFactory.deploy();
    await deployerContract.deployed();

    // console.log("contract deployed:", deployerContract.address);

    //create an instance of the deployed contract with the following signers
    const userFactory = await ethers.getContractFactory("Yorokobi", user);
    const userFactoryTwo = await ethers.getContractFactory("Yorokobi", userTwo);

    // attach user accounts to contract
    userContract = await userFactory.attach(deployerContract.address);
    userContractTwo = await userFactoryTwo.attach(deployerContract.address);

    //contract read only
     contract = await ethers.getContractAt("Yorokobi", deployerContract.address);


  });

  describe("general token information", () => {
    it("get the current balance of an account", async () =>{
      assert.equal(await contract.balanceOf(user.address), 0);
    })

    it("get total supply of tokens", async ()=> {
      assert.equal(await contract.totalSupply(), 1e15);
    })

    it("get token name", async () => {
      assert.equal(await contract.name(), "Yorokobi");
    })

    it("get token symbol", async () => {
      assert.equal(await contract.symbol(), "YRKBY");
    })

    it("get token decimals", async () => {
      assert.equal(await contract.decimals(), 0);
    })
  })


  describe("Owner initially owns total supply fo the token", ()=> {
    it("balance of owner is equals total supply", async () => {
      const totalSupply = await contract.totalSupply();
      const deployerBalance = await contract.balanceOf(deployer.address);

      assert.equal(totalSupply.toString(), deployerBalance.toString());
      
    })
  })

  describe("transfer tokens from one account to another",  () => {

    it("reverts if sender does not have enough token", async () => {
      await expect(userContract.transfer(deployer.address, "1")).to.be.revertedWithCustomError(contract, "Yorokobi__InsufficientFunds");
    })

    it("user balance starts at zero", async () => {
      const userInitialBalance = await contract.balanceOf(user.address)
      assert.equal(userInitialBalance.toString(), "0")
    })

    it("token sent is deducted from the senders account", async () => {
      const initialSenderBalance = await contract.balanceOf(deployer.address);
      const tx = await deployerContract.transfer(user.address, value);
      await tx.wait(1);
      const EndingSenderBalance = await contract.balanceOf(deployer.address);

      assert.equal(EndingSenderBalance.toString(), initialSenderBalance.sub(value).toString());

    })

    it("user recieves token from deployer", async () => {
      await deployerContract.transfer(user.address, value);
      const userNewBalance = await contract.balanceOf(user.address);
      assert.equal(userNewBalance.toString(), value)
    })

    it("transfer emits an event", async () => {

      const tx = await deployerContract.transfer(user.address, value);
      await tx.wait(1);

      await new Promise(async (resolve, reject) => {
        contract.once("Transfer", async (_from,_to,_value) => {
          try{
            assert.equal(_from, deployer.address);
            assert.equal(_to, user.address);
            assert.equal(_value, value);
            resolve()
          }catch{
            reject()
          }
        })
      })
    })

  })


});
