//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Escrow is IERC721Receiver {

    enum Status {
        CANCELED,
        AWAITING_PAYMENT,
        COMPLETE
    }

    struct Deal {
        address payable seller;
        address buyer;
        address nftCollection;
        uint256 tokenId;
        uint256 price;
        Status dealStatus;
    }

    mapping(string => Deal) public allDeals;
    mapping(address => mapping(string => Deal)) public userDeals;

    constructor() {
    }

    function inititalizeTrade(address nftCollection, address buyer, uint256 tokenId, uint256 expectedPrice) public {
        ERC721(nftCollection).isApprovedForAll(msg.sender, address(this));
        ERC721(nftCollection).safeTransferFrom(msg.sender, address(this), tokenId);

        string memory dealId = getDealId(nftCollection, tokenId);

        Deal memory deal = Deal({
            seller: payable(msg.sender),
            buyer: buyer,
            nftCollection: nftCollection,
            tokenId: tokenId,
            price: expectedPrice,
            dealStatus: Status.AWAITING_PAYMENT
        });

        allDeals[dealId] = deal;
        userDeals[msg.sender][dealId] = deal;
    }

    function cancelTrade(address nftCollection, uint256 tokenId) public 
    {
        string memory dealId = getDealId(nftCollection, tokenId);
        require(msg.sender == allDeals[dealId].seller, "Only the seller can cancel.");
        allDeals[dealId].dealStatus = Status.CANCELED;
        userDeals[msg.sender][dealId].dealStatus = Status.CANCELED;
    }

    function changeBuyer(address nftCollection, address newBuyer, uint256 tokenId) public 
    {
        string memory dealId = getDealId(nftCollection, tokenId);
        require(msg.sender == allDeals[dealId].seller, "Only the seller can change buyers.");


    }

    function finalizeTrade(address nftCollection, uint256 tokenId) public 
    {
        string memory dealId = getDealId(nftCollection, tokenId);
        require(msg.sender == allDeals[dealId].buyer, "Only the buyer can complete this transaction.");
		require(allDeals[dealId].dealStatus == Status.AWAITING_PAYMENT);

        // check deposit amount
    }

    function getDealId(address nftAddr, uint256 tokenId) internal pure returns(string memory) {
        return string(abi.encodePacked(nftAddr, tokenId));
    }

    function getDealById(address nftCollection, uint256 tokenId) external view returns(Deal memory) {
        string memory dealId = getDealId(nftCollection, tokenId);
        return allDeals[dealId];
    }

    function getDealStatusById(address nftCollection, uint256 tokenId) external view returns(Status) {
        string memory dealId = getDealId(nftCollection, tokenId);
        return allDeals[dealId].dealStatus;
    }

    function sendNftToBuyer(address nftCollection, address buyer, uint256 tokenId) private {
        ERC721(nftCollection).safeTransferFrom(address(this), buyer, tokenId);
    }

    function onERC721Received(address _operator, address _from, uint256 _tokenId, bytes memory _data) public pure override returns(bytes4) {
        return this.onERC721Received.selector;
    }
}
