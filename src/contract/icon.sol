// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMinter is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    constructor() ERC721("3D Animted Icon", "ICON") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function mint(address to, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 tokenId = tokenCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        tokenCounter++;
        return tokenId;
    }

    function getDownloadLink(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }
}
