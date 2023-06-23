const { assert, expect } = require("chai");
const { deployments, getNamedAccounts, ethers, network } = require("hardhat");

let chainId = network.config.chainId;
let developmentChain = 31337

if (chainId === developmentChain) {
    describe("ERC20", () => {
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
                assert.equal((await manualToken.totalSupply()).toString(), (ethers.utils.parseEther("10000")).toString())
            })
        })

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
            it("Expected to pass after sending a null amount ", async () => {
                expect(await
                    manualToken.transfer(
                        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                        ethers.utils.parseEther("0")
                    )
                )
            });
            it("Expecting it to emit an event", async () => {
                expect(
                    await manualToken.transfer(
                        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                        ethers.utils.parseEther("0")
                    )
                ).to.emit(
                    manualToken,
                    `Transfer(${0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266},${0x70997970c51812dc3a010c7d01b50e0d17dc79c8},${0})`
                );
            });
            it("Verifying the emmited event", async () => {
                const tr = await manualToken.transfer("0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                    ethers.utils.parseEther("0"));
                const transactionReceipt = await tr.wait();
                const senderaddress = await transactionReceipt.events[0].args.from;
                const receiveraddress = await transactionReceipt.events[0].args.to;
                const value = await transactionReceipt.events[0].args.value;
                assert.equal(senderaddress, deployer);
                assert.equal(
                    receiveraddress.toString(),
                    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
                );
                assert.equal(value.toString(), "0");
            });
        });
        
        describe("Approval", () => {
            it("It sets the allowance mapping", async () => {
                const approvefunc = await manualToken.approve(
                    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                    ethers.utils.parseEther("100")
                );
                assert(approvefunc);
            });
            it("reverts in case of low balance", async () => {
                const approvefunc = await manualToken.approve(
                    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                    ethers.utils.parseEther("1000000")
                );
                assert(approvefunc);
            });
            it("to test transfer from ", async () => {
                const approvefunc = await manualToken.approve(
                    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                    ethers.utils.parseEther("10000")
                );
                let accounts = await ethers.getSigners();
                ApprovedmanualToken = manualToken.connect(accounts[1]);
                const trf = await ApprovedmanualToken.transferFrom(
                    accounts[0].address,
                    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
                    ethers.utils.parseEther("10000")
                );
                assert(trf);
            });
            it("Checks the allowance mapping", async () => {
                const approvefunc = await manualToken.approve(
                    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                    ethers.utils.parseEther("10000")
                );
                assert.equal(
                    (await manualToken.allowance(
                        deployer,
                        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
                    )).toString(),
                    "10000000000000000000000"
                );
            });
            it("Expect transfer from to be reverted", async () => {
                const approvefunc = await manualToken.approve(
                    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                    ethers.utils.parseEther("10000")
                );
                let accounts = await ethers.getSigners();
                ApprovedmanualToken = manualToken.connect(accounts[1]);
                //   const trf = await ApprovedmanualToken.transferFrom(
                //     accounts[0].address,
                //     "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
                //     ethers.utils.parseEther("10001")
                //   );
                await expect(
                    ApprovedmanualToken.transferFrom(
                        accounts[0].address,
                        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
                        ethers.utils.parseEther("10001")
                    )
                ).to.be.revertedWith("low allowance");
            });
        });

        describe("To check the burn functions", () => {
            it("To use the burn function", async () => {
                let bal = await manualToken.balanceOf(deployer);
                let burn = await manualToken.burn(ethers.utils.parseEther("100"));
                let balance = await manualToken.totalSupply();
                let sum = balance.add(ethers.utils.parseEther("100"));
                assert.equal(bal.toString(), sum.toString())
                assert.equal((await manualToken.totalSupply()).toString(), "9900000000000000000000")
                assert(burn);
            });
            it("is used to check if an event is emmited", async () => {
                const transactionResponse = await manualToken.burn(
                    ethers.utils.parseEther("100")
                );
                const transactionReceipt = await transactionResponse.wait();
                assert.equal(transactionReceipt.events[0].args.from, deployer);
            });
        });

        describe("Testing the burn from function", () => {
            it("testing the function", async () => {
                await manualToken.approve(
                    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                    ethers.utils.parseEther("10000")
                );
                const accounts = await ethers.getSigners();
                ApprovedmanualToken = manualToken.connect(accounts[1]);
                const inibalance = await manualToken.totalSupply();
                let burnf = await ApprovedmanualToken.burnFrom(accounts[0].address, ethers.utils.parseEther("100"));
                let tbal = await ApprovedmanualToken.totalSupply();
                let TBal = tbal.add(ethers.utils.parseEther("100"));
                assert(burnf);
                assert.equal(inibalance.toString(), TBal.toString());
            });
        });
    });
}