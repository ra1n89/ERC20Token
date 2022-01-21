import { expect } from "chai";
import { assert } from "console";
import { ethers } from "hardhat";

describe("MyToken", function () {
  //тест на деплой контракта
  it("Checking a contract is deployed", async function () {
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.deployed();
    assert(myToken.address);
  });
  //тест на соответствии первоначальной эмиссии токена
  it("Checking _totalSupply equal 1000000", async function () {
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.deployed();
    expect(await myToken._totalSupply()).to.equal(1000000);
  });
  //проверка view функций
  it("Checking that functions name(), symbol(), symbol(), totalSupply() work correctly", async function () {
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.deployed();
    expect(await myToken.name()).to.equal("My Token");
    expect(await myToken.symbol()).to.equal("MTN");
    expect(await myToken.decimals()).to.equal(18);
    expect(await myToken.totalSupply()).to.equal(1000000);
  });
  //проверка функции balanceOf()
  it("Checking function balanceOf() works correctly", async function () {
    const signers = await ethers.getSigners();
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.deployed();
    expect(await myToken.balanceOf(signers[0].address)).to.equal(1000000);
    await myToken.transfer(signers[1].address, 10)
    expect(await myToken.balanceOf(signers[0].address)).to.equal(999990);
    expect(await myToken.balanceOf(signers[1].address)).to.equal(10);
  });
  //проверка функции transfer() и эвента
  it("Checking function transfer() works correctly", async function () {
    const signers = await ethers.getSigners();
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.deployed();
    await expect(myToken.transfer(signers[1].address, 2000000)).to.be.revertedWith("lack of balance")
    const tx = await myToken.transfer(signers[1].address, 10)
    //тестируем эвент Transfer
    await expect(tx).to.emit(myToken, "Transfer").withArgs(signers[0].address, signers[1].address, 10);
    expect(await myToken.balanceOf(signers[0].address)).to.equal(999990);
    expect(await myToken.balanceOf(signers[1].address)).to.equal(10);
   
  });
  //проверка функций aprove(), её эвента, а также функций allowance(), increaseAllowance(), decreaseAllowance()
  it("Checking function aprove(), allowance(), increaseAllowance(), decreaseAllowance() work correctly", async function () {
    const signers = await ethers.getSigners();
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.deployed();
    const tx = await myToken.approve(signers[1].address, 11);
    //тестируем эвент Approval
    expect(tx).to.emit(myToken, "Approval").withArgs(signers[0].address, signers[1].address, 11)
    expect(await myToken.allowance(signers[0].address, signers[1].address)).to.equal(11)
    await myToken.increaseAllowance(signers[1].address, 2)
    expect(await myToken.allowance(signers[0].address, signers[1].address)).to.equal(13)
    await myToken.decreaseAllowance(signers[1].address, 3)
    expect(await myToken.allowance(signers[0].address, signers[1].address)).to.equal(10)
  });
  //проверка функции transferFrom() 
  it("Checking function transferFrom() works correctly", async function () {
    const signers = await ethers.getSigners();
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.deployed();
    await expect(myToken.connect(signers[1]).transferFrom(signers[0].address, signers[1].address, 12)).to.be.revertedWith("Not Approved");
    await myToken.approve(signers[1].address, 11)
  });
  //проверка функции burn()
  it("Checking function burn() works correctly", async function () {
    const signers = await ethers.getSigners();
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.deployed();
    await myToken.burn(100);
    await expect(myToken.burn(2000000)).to.be.revertedWith("lack of balance")
    expect(parseInt(await myToken.balanceOf(signers[0].address))).to.equal(999900)
    expect(parseInt(await myToken._totalSupply())).to.equal(999900)
  });
  //проверка функции mint() 
  it("Checking function mint() works correctly", async function () {
    const signers = await ethers.getSigners();
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.deployed();
    await myToken.mint(100);
    await expect(myToken.connect(signers[1]).mint(100)).to.be.revertedWith("only owner can mint new tokens")
    await expect(myToken.mint(2000000)).to.be.revertedWith("lack of balance")
    expect(parseInt(await myToken.balanceOf(signers[0].address))).to.equal(1000100)
    expect(parseInt(await myToken._totalSupply())).to.equal(1000100)
  });
});

