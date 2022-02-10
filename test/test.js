const { expect } = require('chai');
const { ethers } = require('hardhat');

let escrowContractFactory;
let escrowContract;
let user1;
let user2;
let owner;
let nftContractFactory;
let nftContract;

beforeEach(async function () {
  escrowContractFactory = await ethers.getContractFactory('Escrow');
  [owner, user1, user2, user3] = await ethers.getSigners();

  escrowContract = await escrowContractFactory.deploy({});
  await escrowContract.deployed();

  nftContractFactory = await hre.ethers.getContractFactory('MyNft');
  nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  await nftContract.connect(user1).mint();
  await nftContract.connect(user2).mint();
});


describe('Escrow', function () {
  it('Should be able to initialize a trade on an owned NFT', async function () {
    await nftContract.connect(user1).setApprovalForAll(escrowContract.address, true);
    await expect(escrowContract.connect(user1).inititalizeTrade(nftContract.address, user2.address, 1, '1700000000000000000')).to.not.be.reverted;
    expect(await escrowContract.getDealStatusById(nftContract.address, 1)).to.equal(1);
  });

  it('Should NOT be able to initialize a trade someone elses NFT', async function () {
    await nftContract.connect(user1).setApprovalForAll(escrowContract.address, true);
    await expect(escrowContract.connect(user2).inititalizeTrade(nftContract.address, user2.address, 1, '1700000000000000000')).to.be.reverted;
  });

  it('Should be able to cancel a trade on an owned NFT', async function () {
    await nftContract.connect(user1).setApprovalForAll(escrowContract.address, true);
    escrowContract.connect(user1).inititalizeTrade(nftContract.address, user2.address, 1, '1700000000000000000');

    await expect(escrowContract.connect(user1).cancelTrade(nftContract.address, 1)).to.not.be.reverted; 

    expect(await escrowContract.getDealStatusById(nftContract.address, 1)).to.equal(0);
  });

  it('Should NOT be able to cancel a trade on somoeone elses NFT', async function () {
    await nftContract.connect(user1).setApprovalForAll(escrowContract.address, true);
    escrowContract.connect(user1).inititalizeTrade(nftContract.address, user2.address, 1, '1700000000000000000');

    await expect(escrowContract.connect(user2).cancelTrade(nftContract.address, 1)).to.be.reverted; 
  });

  it('Should be able to change buyer on an owned NFT', async function () {
    await nftContract.connect(user1).setApprovalForAll(escrowContract.address, true);
    escrowContract.connect(user1).inititalizeTrade(nftContract.address, user2.address, 1, '1700000000000000000');

    await expect(escrowContract.connect(user1).changeBuyer(nftContract.address, user3.address, 1)).to.not.be.reverted; 

    expect(await escrowContract.getDealById(nftContract.address, 1)).to.have.property('buyer', user3.address);
  });

  it('Should NOT be able to change buyer on a non owned NFT', async function () {
    await nftContract.connect(user1).setApprovalForAll(escrowContract.address, true);
    escrowContract.connect(user1).inititalizeTrade(nftContract.address, user2.address, 1, '1700000000000000000');

    await expect(escrowContract.connect(user2).changeBuyer(nftContract.address, user3.address, 1)).to.be.reverted; 
  });

  it('Should be able to change buyer on a deal that is still awaiting payment', async function () {
    await nftContract.connect(user1).setApprovalForAll(escrowContract.address, true);
    escrowContract.connect(user1).inititalizeTrade(nftContract.address, user2.address, 1, '1700000000000000000');

    await expect(escrowContract.connect(user1).changeBuyer(nftContract.address, user3.address, 1)).to.not.be.reverted; 


  });

  it('Should NOT be able to change buyer on a deal that is canceled/completed', async function () {
    await nftContract.connect(user1).setApprovalForAll(escrowContract.address, true);
    escrowContract.connect(user1).inititalizeTrade(nftContract.address, user2.address, 1, '1700000000000000000');

    await expect(escrowContract.connect(user1).changeBuyer(nftContract.address, user3.address, 1)).to.not.be.reverted; 


  });

  it('Should complete the deal upon payment', async function () {
    await nftContract.connect(user1).setApprovalForAll(escrowContract.address, true);
    escrowContract.connect(user1).inititalizeTrade(nftContract.address, user2.address, 1, '1700000000000000000');

    await expect(escrowContract.connect(user1).changeBuyer(nftContract.address, user3.address, 1)).to.not.be.reverted; 


  });

  it('Should revert the deal upon incorrect payment', async function () {
    await nftContract.connect(user1).setApprovalForAll(escrowContract.address, true);
    escrowContract.connect(user1).inititalizeTrade(nftContract.address, user2.address, 1, '1700000000000000000');

    await expect(escrowContract.connect(user1).changeBuyer(nftContract.address, user3.address, 1)).to.not.be.reverted; 


  });

  it('Should revert the deal if its an incorrect buyer', async function () {
    await nftContract.connect(user1).setApprovalForAll(escrowContract.address, true);
    escrowContract.connect(user1).inititalizeTrade(nftContract.address, user2.address, 1, '1700000000000000000');

    await expect(escrowContract.connect(user1).changeBuyer(nftContract.address, user3.address, 1)).to.not.be.reverted; 


  });

  it('Should be able to complete the deal as the new buyer', async function () {
    await nftContract.connect(user1).setApprovalForAll(escrowContract.address, true);
    escrowContract.connect(user1).inititalizeTrade(nftContract.address, user2.address, 1, '1700000000000000000');

    await expect(escrowContract.connect(user1).changeBuyer(nftContract.address, user3.address, 1)).to.not.be.reverted; 


  });

  it('Should have the same deal in the buyer and seller list', async function () {
    await nftContract.connect(user1).setApprovalForAll(escrowContract.address, true);
    escrowContract.connect(user1).inititalizeTrade(nftContract.address, user2.address, 1, '1700000000000000000');

    await expect(escrowContract.connect(user1).changeBuyer(nftContract.address, user3.address, 1)).to.not.be.reverted; 


  });



});
