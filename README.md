-> This is the code to create an ERC-20 token
-> It also has a basic set of tests and a deploy script 

-> Add the required Dependencies 

```shell
yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv
```

-> try running the below tasks 
``` shell 
yarn hardhat help
yarn hardhat deploy
yarn hardhat test
yarn hardhat deploy --network polygon  
```
