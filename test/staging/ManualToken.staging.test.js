const { assert, expect } = require("chai");
const { deployments, getNamedAccounts, ethers, network } = require("hardhat");

let chainId = network.config.chainId;
let developmentChain = 31337;


if (chainId !== developmentChain) {
    describe("The final staging test", () => {
        let manualToken;

        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer;
            const { fixture } = deployments;
            await fixture(["1"]);
            manualToken = await ethers.getContract("TokenERC20", deployer);
        });

        describe("Constructor", () => {
            it("It initalises the contract", async () => {
                const tokenname = await manualToken.name();
                const tokensymbol = await manualToken.symbol();
                assert.equal(tokenname.toString(), "OurManualToken");
                assert.equal(tokensymbol.toString(), "OMT");
                assert.equal((await manualToken.decimals()).toString(), "18");
                assert.equal(
                    (await manualToken.totalSupply()).toString(),
                    ethers.utils.parseEther("10000").toString()
                );
            });
        });

        describe("to check the balance mapping", () => {
            it("It checks the initial balance of the deployer", async () => {
                let bal = "10000000000000000000000";
                assert.equal(
                    (await manualToken.balanceOf(deployer)).toString(),
                    bal
                );
            });
        });

        describe("to check the transfer function", () => {
            it("Doing the first transfer expected to reverted bcoz low balance", async () => {
                await expect(
                    manualToken.transfer(
                        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                        ethers.utils.parseEther("100000")
                    )
                ).to.be.revertedWith('low balance');
            });
            it("Expected to reverted bcoz of being sent to a null address", async () => {
                await expect(
                    manualToken.transfer(
                        "0x0",
                        ethers.utils.parseEther("100")
                    )
                ).to.be.revertedWith("");
            });
        });
    });
}