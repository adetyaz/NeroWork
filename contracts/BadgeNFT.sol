// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BadgeNFT is ERC721 {
    uint256 public nextTokenId;
    mapping(uint256 => string) public tokenURIs;
    mapping(uint256 => string) public badgeNames;
    mapping(uint256 => string) public badgeDescriptions;

    event BadgeMinted(address indexed to, uint256 indexed tokenId, string name, string description, string imageUrl);

    constructor() ERC721("NeroBadge", "NBADGE") {}

    function mintBadge(address to, string memory name, string memory description, string memory imageUrl) external returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _mint(to, tokenId);
        badgeNames[tokenId] = name;
        badgeDescriptions[tokenId] = description;
        tokenURIs[tokenId] = imageUrl;
        emit BadgeMinted(to, tokenId, name, description, imageUrl);
        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return tokenURIs[tokenId];
    }

    function getBadgeInfo(uint256 tokenId) public view returns (string memory name, string memory description, string memory imageUrl) {
        return (badgeNames[tokenId], badgeDescriptions[tokenId], tokenURIs[tokenId]);
    }
}
