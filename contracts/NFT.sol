// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNft is ERC721 {
    constructor() ERC721("Example", "EX") {}


    function mint() public
    {
        _safeMint(msg.sender, 1);
    }
}