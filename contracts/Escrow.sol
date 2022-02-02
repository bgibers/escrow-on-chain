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
        address seller;
        address buyer;
        address nftCollection;
        uint256 tokenId;
        uint256 price;
        Status dealStatus;
    }

    mapping(string => Deal) public allDeals;
    mapping(address => mapping(string => Deal)) public userDeals;

    modifier onlySeller(string memory dealId) {
        require(msg.sender == allDeals[dealId].seller, "Only the seller can cancel.");
        _;
    }

    modifier onlyBuyer(string memory dealId) {
        require(msg.sender == allDeals[dealId].buyer, "Only the buyer can complete this transaction.");
        _;
    }

    constructor() {
    }

    // First call approve from the front end
    function inititalizeTrade(address nftCollection, address buyer, uint256 tokenId, uint256 expectedPrice) public {

    }

    function cancelTrade(address nftCollection, uint256 tokenId) public onlySeller(getDealId(nftCollection, tokenId)) {
        string memory dealId = getDealId(nftCollection, tokenId);
        allDeals[dealId].dealStatus = Status.CANCELED;
        userDeals[msg.sender][dealId];
    }


    function finalizeTrade(address nftCollection, uint256 tokenId) public onlyBuyer(getDealId(nftCollection, tokenId)){
        
    }

    function getDealId(address nftAddr, uint256 tokenId) internal pure returns(string memory) {
            return string(abi.encodePacked(nftAddr, tokenId));
        }

    function sendNftToBuyer(address nftCollection, address buyer, uint256 tokenId) private {
         ERC721(nftCollection).safeTransferFrom(address(this), buyer, tokenId);
    }

    function onERC721Received(address _operator, address _from, uint256 _tokenId, bytes memory _data) public pure override returns(bytes4) {
       return 0x150b7a02;
 }
}
