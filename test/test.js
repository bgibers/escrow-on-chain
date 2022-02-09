const { expect } = require("chai");
const { ethers } = require("hardhat");

let escrowContractFactory;
let escrowContract;
let user1;
let user2;
let owner;
let nftContractFactory;
let nftContract;

beforeEach(async function () {
  escrowContractFactory = await ethers.getContractFactory('Escrow');
  [owner, user1, user2] = await ethers.getSigners();

  escrowContract = await escrowContractFactory.deploy({});
  await escrowContract.deployed();

  nftContractFactory = await hre.ethers.getContractFactory('MyNft');
  nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  await nftContract.connect(user1).mint();
});


describe("Seller Only", function () {
  it("Should be able to initialize a trade on an owned NFT", async function () {
    await nftContract.connect(user1).setApprovalForAll(escrowContract.address, true);
    await expect(escrowContract.connect(user1).inititalizeTrade(nftContract.address, user2.address, 1, 1000)).to.not.be.reverted;
    expect(await escrowContract.getDealStatusById(nftContract.address, 1)).to.equal(1);
  });

  it("Should NOT be able to initialize a trade someone elses NFT", async function () {
    await nftContract.connect(user1).setApprovalForAll(escrowContract.address, true);
    await expect(escrowContract.connect(user1).inititalizeTrade(nftContract.address, user2.address, 2, 1000)).to.be.reverted;
  });

});
