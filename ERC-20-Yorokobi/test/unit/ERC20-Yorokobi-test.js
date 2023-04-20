const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20 Yorokobi", () => {

  let contract, deployerContract, userContract, userContractTwo, deployer, user, userTwo, value;

  //initilise contracts and connection to accounts.
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

  describe("Allow other accounts to spend another accounts token", () => {

    it("amount of allowance is approved by the token holder to be used by third-party account", async () => {
      const approve = await deployerContract.approve(user.address, "100");
      await approve.wait(1);

      assert.equal(await contract.balanceOf(user.address), "0");

      await new Promise(async (resolve) => {
        contract.once("Approval", (_owner,_spender, _value) => {
            assert.equal(_owner, deployer.address);
            assert.equal(_spender, user.address);
            assert.equal(_value, "100");
            resolve();
        })
      })
    
    })

    it("returns the allowance of third-party accounts for an account", async () => {
      const approve = await deployerContract.approve(user.address, "100");
      await approve.wait(1);

      const allowance = await contract.allowance(deployer.address, user.address);
      assert.equal(allowance, "100");
    })

    it("approve whether an amount of token from an account can be spent by a third-party account", async () => {
      const approve = await deployerContract.approve(user.address, "100");
      await approve.wait(1);

      assert.equal(await contract.balanceOf(user.address), "0");

      const transferFrom = await userContract.transferFrom(deployer.address, userTwo.address, "100");
      await transferFrom.wait(1);

      assert.equal(await contract.balanceOf(userTwo.address), "100");
    })

    it("reverts if the _spender does not have allowance to transfer tokens from another account", async () => {
      await expect( userContractTwo.transferFrom(deployer.address, user.address, "1000")).to.be.revertedWithCustomError(contract, "Yorokobi__UnAuthorisedRequest");
      console.log(await contract.balanceOf(user.address));
    })

    it("reverts if a token holder wants to approve allowance but has insufficient funds", async () => {

      await expect( userContract.approve(deployer.address, "1")).to.be.revertedWithCustomError(contract, "Yorokobi__InsufficientFunds");
    })

    it("deducts the token used by third-party account to the allowance balance", async () => {
      const approve = await deployerContract.approve(user.address, "100");
      await approve.wait(1);

      assert.equal(await contract.balanceOf(user.address), "0");

      const transferFrom = await userContract.transferFrom(deployer.address, userTwo.address, "50");
      await transferFrom.wait(1);

      const allowance = await contract.allowance(deployer.address, user.address);
      assert.equal(allowance, "50");
    })
  })

});
