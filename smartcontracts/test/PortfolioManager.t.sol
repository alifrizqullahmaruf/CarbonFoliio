// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {MockCarbonCredit} from "../src/MockCarbonCredit.sol";
import {PortfolioManager} from "../src/PortfolioManager.sol";

contract PortfolioManagerTest is Test {
    event Allocated(address indexed user, uint256 indexed tokenId, uint256 amount, uint256 costWei);
    event Retired(address indexed user, uint256 indexed tokenId, uint256 amount);

    MockCarbonCredit credit;
    PortfolioManager manager;
    address owner = address(0xA11CE);
    address user = address(0xCAFE);

    uint256 reforestationId;
    uint256 renewableId;

    function setUp() public {
        credit = new MockCarbonCredit(owner);
        manager = new PortfolioManager(address(credit), owner);

        vm.startPrank(owner);
        credit.setMinter(address(manager));
        reforestationId = credit.createCreditType("Reforestation", "Verra VCS", 2023, "Kalimantan", 82, 0.001 ether, 1000);
        renewableId = credit.createCreditType("Renewable Energy", "Gold Standard", 2022, "Gujarat", 91, 0.002 ether, 500);
        vm.stopPrank();

        vm.deal(user, 10 ether);
    }

    function test_Allocate_RevertsOnArrayLengthMismatch() public {
        uint256[] memory tokenIds = new uint256[](2);
        uint256[] memory amounts = new uint256[](1);

        vm.prank(user);
        vm.expectRevert(PortfolioManager.ArrayLengthMismatch.selector);
        manager.allocate(tokenIds, amounts);
    }

    function test_Allocate_RevertsOnEmptyAllocation() public {
        uint256[] memory tokenIds = new uint256[](0);
        uint256[] memory amounts = new uint256[](0);

        vm.prank(user);
        vm.expectRevert(PortfolioManager.EmptyAllocation.selector);
        manager.allocate(tokenIds, amounts);
    }

    function test_Allocate_RevertsOnIncorrectPayment() public {
        uint256[] memory tokenIds = new uint256[](1);
        uint256[] memory amounts = new uint256[](1);
        tokenIds[0] = reforestationId;
        amounts[0] = 10;

        vm.prank(user);
        vm.expectRevert(abi.encodeWithSelector(PortfolioManager.IncorrectPayment.selector, 0.01 ether, 0.005 ether));
        manager.allocate{value: 0.005 ether}(tokenIds, amounts);
    }

    function test_Allocate_MintsAndTracksPortfolio() public {
        uint256[] memory tokenIds = new uint256[](1);
        uint256[] memory amounts = new uint256[](1);
        tokenIds[0] = reforestationId;
        amounts[0] = 10;

        vm.prank(user);
        vm.expectEmit(true, true, false, true);
        emit Allocated(user, reforestationId, 10, 0.01 ether);
        manager.allocate{value: 0.01 ether}(tokenIds, amounts);

        assertEq(credit.balanceOf(user, reforestationId), 10);
        assertEq(credit.availableSupply(reforestationId), 990);

        (uint256[] memory heldIds, uint256[] memory balances) = manager.getPortfolio(user);
        assertEq(heldIds.length, 1);
        assertEq(heldIds[0], reforestationId);
        assertEq(balances[0], 10);
    }

    function test_Allocate_MultipleTokensInOneCall() public {
        uint256[] memory tokenIds = new uint256[](2);
        uint256[] memory amounts = new uint256[](2);
        tokenIds[0] = reforestationId;
        tokenIds[1] = renewableId;
        amounts[0] = 10;
        amounts[1] = 5;

        uint256 totalCost = 10 * 0.001 ether + 5 * 0.002 ether;

        vm.prank(user);
        manager.allocate{value: totalCost}(tokenIds, amounts);

        (uint256[] memory heldIds, uint256[] memory balances) = manager.getPortfolio(user);
        assertEq(heldIds.length, 2);
        assertEq(balances[0], 10);
        assertEq(balances[1], 5);
    }

    function test_Allocate_RevertsIfInsufficientSupply() public {
        uint256[] memory tokenIds = new uint256[](1);
        uint256[] memory amounts = new uint256[](1);
        tokenIds[0] = reforestationId;
        amounts[0] = 5000;

        vm.prank(user);
        vm.expectRevert(
            abi.encodeWithSelector(MockCarbonCredit.InsufficientSupply.selector, reforestationId, 5000, 1000)
        );
        manager.allocate{value: 5000 * 0.001 ether}(tokenIds, amounts);
    }

    function test_Retire_RevertsWithoutApproval() public {
        _allocateReforestation(10);

        vm.prank(user);
        vm.expectRevert();
        manager.retire(reforestationId, 5);
    }

    function test_Retire_BurnsAfterApproval() public {
        _allocateReforestation(10);

        vm.startPrank(user);
        credit.setApprovalForAll(address(manager), true);
        vm.expectEmit(true, true, false, true);
        emit Retired(user, reforestationId, 5);
        manager.retire(reforestationId, 5);
        vm.stopPrank();

        assertEq(credit.balanceOf(user, reforestationId), 5);
    }

    function test_Withdraw_OnlyOwner() public {
        _allocateReforestation(10);

        vm.prank(user);
        vm.expectRevert();
        manager.withdraw(payable(user));

        uint256 ownerBalanceBefore = owner.balance;
        vm.prank(owner);
        manager.withdraw(payable(owner));
        assertEq(owner.balance, ownerBalanceBefore + 0.01 ether);
    }

    function _allocateReforestation(uint256 amount) internal {
        uint256[] memory tokenIds = new uint256[](1);
        uint256[] memory amounts = new uint256[](1);
        tokenIds[0] = reforestationId;
        amounts[0] = amount;

        vm.prank(user);
        manager.allocate{value: amount * 0.001 ether}(tokenIds, amounts);
    }
}
