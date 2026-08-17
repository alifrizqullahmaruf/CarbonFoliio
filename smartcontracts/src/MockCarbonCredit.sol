// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MockCarbonCredit is ERC1155, ERC1155Burnable, Ownable {
    struct CreditMetadata {
        string projectType;
        string certificationStandard;
        uint16 vintageYear;
        string location;
        uint8 qualityScore;
        bool exists;
    }

    error CreditDoesNotExist(uint256 tokenId);
    error InvalidQualityScore(uint8 score);
    error NotMinter();
    error InsufficientSupply(uint256 tokenId, uint256 requested, uint256 available);

    event CreditTypeCreated(uint256 indexed tokenId, string projectType, uint16 vintageYear, uint256 priceWei, uint256 supply);
    event QualityScoreUpdated(uint256 indexed tokenId, uint8 oldScore, uint8 newScore);
    event Restocked(uint256 indexed tokenId, uint256 amountAdded, uint256 newSupply);
    event MinterUpdated(address indexed oldMinter, address indexed newMinter);

    mapping(uint256 => CreditMetadata) public creditMetadata;
    mapping(uint256 => uint256) public priceWei;
    mapping(uint256 => uint256) public availableSupply;
    uint256 public nextTokenId;
    address public minter;

    modifier onlyMinter() {
        if (msg.sender != minter) revert NotMinter();
        _;
    }

    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

    function setMinter(address newMinter) external onlyOwner {
        emit MinterUpdated(minter, newMinter);
        minter = newMinter;
    }

    function createCreditType(
        string calldata projectType,
        string calldata certificationStandard,
        uint16 vintageYear,
        string calldata location,
        uint8 qualityScore,
        uint256 priceWei_,
        uint256 initialSupply
    ) external onlyOwner returns (uint256 tokenId) {
        if (qualityScore > 100) revert InvalidQualityScore(qualityScore);

        tokenId = nextTokenId++;
        creditMetadata[tokenId] = CreditMetadata({
            projectType: projectType,
            certificationStandard: certificationStandard,
            vintageYear: vintageYear,
            location: location,
            qualityScore: qualityScore,
            exists: true
        });
        priceWei[tokenId] = priceWei_;
        availableSupply[tokenId] = initialSupply;

        emit CreditTypeCreated(tokenId, projectType, vintageYear, priceWei_, initialSupply);
    }

    function restock(uint256 tokenId, uint256 amount) external onlyOwner {
        if (!creditMetadata[tokenId].exists) revert CreditDoesNotExist(tokenId);
        availableSupply[tokenId] += amount;
        emit Restocked(tokenId, amount, availableSupply[tokenId]);
    }

    function updateQualityScore(uint256 tokenId, uint8 newScore) external onlyOwner {
        if (!creditMetadata[tokenId].exists) revert CreditDoesNotExist(tokenId);
        if (newScore > 100) revert InvalidQualityScore(newScore);
        uint8 oldScore = creditMetadata[tokenId].qualityScore;
        creditMetadata[tokenId].qualityScore = newScore;
        emit QualityScoreUpdated(tokenId, oldScore, newScore);
    }

    function mint(address to, uint256 tokenId, uint256 amount) external onlyMinter {
        if (!creditMetadata[tokenId].exists) revert CreditDoesNotExist(tokenId);
        uint256 available = availableSupply[tokenId];
        if (available < amount) revert InsufficientSupply(tokenId, amount, available);
        availableSupply[tokenId] = available - amount;
        _mint(to, tokenId, amount, "");
    }
}
