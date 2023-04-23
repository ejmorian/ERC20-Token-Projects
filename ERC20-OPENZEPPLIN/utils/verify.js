const {run} = require("hardhat")

const verify = async (_address, _args) => {
    try{
        await run("verify", {address: _address, 
            constructorArgsParams: _args})
    }catch(e){
        e.message.toLowerCase().includes("verified") ? console.log("contract already verified..") : 
        console.error(e)
    }

}

module.exports = {
    verify
}