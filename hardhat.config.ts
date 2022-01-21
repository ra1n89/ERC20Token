import * as dotenv from "dotenv";

import { HardhatUserConfig, task, } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers"
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { ethers } from "ethers";
//import { ethers } from "hardhat";
//import hre from "hardhat";
import { watchFile } from "fs";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

//npx hardhat transfer --address <address> --amount <amount of tokens>
task("transfer", "transfer tokens MTN")
.addParam("address", "address where we want to send tokens")
.addParam("amount", "amount money to transfer")
.setAction(async (taskArgs, hre) => {
  const signers = await hre.ethers.getSigners();
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy();
  await myToken.deployed();
  await myToken.transfer(taskArgs.address, taskArgs.amount)
  console.log("balance of " + taskArgs.address + " now is " + parseInt(await myToken.balanceOf(taskArgs.address)));
})

//npx hardhat approve --address <address> --amount <amount of tokens> 
task("approve", "approves tokens transfer for another person")
.addParam("address", "address which can transfer tokens")
.addParam("amount", "amount money to transfer")
.setAction(async (taskArgs, hre) => {
  const [signer] = await hre.ethers.getSigners();
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy();
  await myToken.deployed();
  await myToken.approve(taskArgs.address, taskArgs.amount)
  console.log("allowance for " + taskArgs.address + " now is " + parseInt(await myToken.allowance(signer.address,taskArgs.address)));
})

//npx hardhat transferFrom --signernumber <number from 0 to 20> --spendernumber <number from 0 to 20> --approve <amount of money> --amount <approving of amount of money> 
task("transferFrom", "transfer tokens from  person who gave allowance")
.addParam("signernumber", "choose signer number from 0 to 20 which are provided by Hardhat and who will give allowance to someone transfer tokens")
.addParam("spendernumber", "choose spendernumber, his address will be allowed to transfer tokens from signer account")
.addParam("approve", "amount money to approve")
.addParam("amount", "amount money to transfer")
.setAction(async (taskArgs, hre) => {
  const signer = await hre.ethers.getSigners();
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const myToken = await MyToken.connect(signer[taskArgs.signernumber]).deploy();
  await myToken.deployed();
  await myToken.connect(signer[taskArgs.signernumber]).approve(signer[taskArgs.spendernumber].address, taskArgs.approve)
  console.log("allowance for " + signer[taskArgs.spendernumber].address + " now is " + parseInt(await myToken.allowance(signer[taskArgs.signernumber].address, signer[taskArgs.spendernumber].address)));
  await myToken.connect(signer[taskArgs.spendernumber]).transferFrom(signer[taskArgs.signernumber].address, signer[taskArgs.spendernumber].address, taskArgs.amount)
  console.log("balance of " + signer[taskArgs.spendernumber].address + " now is " + parseInt(await myToken.balanceOf(signer[taskArgs.spendernumber].address)));
  console.log("balance of " + signer[taskArgs.signernumber].address + " now is " + parseInt(await myToken.balanceOf(signer[taskArgs.signernumber].address)));
  //expect(await myToken.balanceOf(signers[1].address)).to.equal(10);
})


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
 
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  // },
  // gasReporter: {
  //   enabled: process.env.REPORT_GAS !== undefined,
  //   currency: "USD",
  // },
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY,
  // },
  },
  
};

export default config;

 // const [Ashly, Bob] = await hre.ethers.getSigners();
/*
  task("transfer", "transfer tokens MTN")
  .addParam("address", "The contract address on Rinkeby")
  .addParam("amount", "amount money to transfer")
  .setAction(async (taskArgs) => {
    const contract = require("C:/Projects/HardHat TS/artifacts/contracts/MyToken.sol/MyToken.json")
    const provider = new ethers.providers.AlchemyProvider("rinkeby", process.env.ALCHEMY_API_KEY);
    const signer = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`, provider);
    const myTokenContract = new ethers.Contract(
      taskArgs.address,
      contract.abi,
      signer
    );
    await myTokenContract.transfer()
    
  })
*/

