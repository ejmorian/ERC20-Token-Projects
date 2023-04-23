const {run, network} = require("hardhat");
const {developmentChains} = require("../hardhat-helper-config");

const verify = async (_address, _args) => {
    if(!developmentChains.includes(network.name)){
        try{
            await run("verify", {address: _address, constructorArgsParams: _args})
        }catch(e){
            if (e.message.includes("verified")){
                console.log("contract is already verified.")
            }else{
                console.error(e);
            }
        }
    }else{
        console.log("in a development chain. can not verify contract...")
    }
}

module.exports = {
    verify
}