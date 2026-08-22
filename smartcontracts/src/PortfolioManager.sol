// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {CarbonCredit} from "./CarbonCredit.sol";

contract PortfolioManager is Ownable {
    error ArrayLengthMismatch();
    error EmptyAllocation();
    error IncorrectPayment(uint256 expected, uint256 sent);

    event Allocated(address indexed user, uint256 indexed tokenId, uint256 amount, uint256 costWei);
    event Retired(address indexed user, uint256 indexed tokenId, uint256 amount);

    CarbonCredit public immutable creditToken;

    mapping(address => uint256[]) private _holdingsByUser;
    mapping(address => mapping(uint256 => bool)) private _isHeld;

    constructor(address creditToken_, address initialOwner) Ownable(initialOwner) {
        creditToken = CarbonCredit(creditToken_);
    }

    function allocate(uint256[] calldata tokenIds, uint256[] calldata amounts) external payable {
        if (tokenIds.length != amounts.length) revert ArrayLengthMismatch();
        if (tokenIds.length == 0) revert EmptyAllocation();

        uint256 totalCost;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            totalCost += creditToken.priceWei(tokenIds[i]) * amounts[i];
        }
        if (msg.value != totalCost) revert IncorrectPayment(totalCost, msg.value);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            uint256 amount = amounts[i];
            uint256 cost = creditToken.priceWei(tokenId) * amount;

            creditToken.mint(msg.sender, tokenId, amount);

            if (!_isHeld[msg.sender][tokenId]) {
                _isHeld[msg.sender][tokenId] = true;
                _holdingsByUser[msg.sender].push(tokenId);
            }

            emit Allocated(msg.sender, tokenId, amount, cost);
        }
    }

    function retire(uint256 tokenId, uint256 amount) external {
        creditToken.burn(msg.sender, tokenId, amount);
        emit Retired(msg.sender, tokenId, amount);
    }

    function getPortfolio(address user) external view returns (uint256[] memory tokenIds, uint256[] memory balances) {
        tokenIds = _holdingsByUser[user];
        balances = new uint256[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            balances[i] = creditToken.balanceOf(user, tokenIds[i]);
        }
    }

    function withdraw(address payable to) external onlyOwner {
        to.transfer(address(this).balance);
    }
}
