const { network } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let developmentChain = 31337;

    let args = [10000, "OurManualToken", "OMT"];

    log("deploying contract...........")
    const manualToken = await deploy("TokenERC20", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    log("contract has been deployed!!!!!!😃");
    log(`${manualToken.address} is the address of the contract`)

    if (chainId != developmentChain && process.env.PolygonScan_API_KEY) {
      log("Verifying the contracts.....");
      await verify(manualToken.address, args);
      log("contract has been verified......");
    }
};

module.exports.tags = ["1"];