// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {MockCarbonCredit} from "../src/MockCarbonCredit.sol";

contract MockCarbonCreditTest is Test {
    event QualityScoreUpdated(uint256 indexed tokenId, uint8 oldScore, uint8 newScore);
    event MinterUpdated(address indexed oldMinter, address indexed newMinter);

    MockCarbonCredit credit;
    address owner = address(0xA11CE);
    address minter = address(0xB0B);

    function setUp() public {
        credit = new MockCarbonCredit(owner);
    }

    function test_CreateCreditType_StoresMetadataPriceAndSupply() public {
        vm.prank(owner);
        uint256 tokenId = credit.createCreditType(
            "Reforestation", "Verra VCS", 2023, "Kalimantan, Indonesia", 82, 0.001 ether, 1000
        );

        assertEq(tokenId, 0);
        (string memory projectType,,,,,) = credit.creditMetadata(tokenId);
        assertEq(projectType, "Reforestation");
        assertEq(credit.priceWei(tokenId), 0.001 ether);
        assertEq(credit.availableSupply(tokenId), 1000);
    }

    function test_CreateCreditType_RevertsIfQualityScoreOver100() public {
        vm.prank(owner);
        vm.expectRevert(abi.encodeWithSelector(MockCarbonCredit.InvalidQualityScore.selector, 101));
        credit.createCreditType("Reforestation", "Verra VCS", 2023, "Kalimantan", 101, 0.001 ether, 1000);
    }

    function test_CreateCreditType_RevertsIfNotOwner() public {
        vm.prank(address(0xBAD));
        vm.expectRevert();
        credit.createCreditType("Reforestation", "Verra VCS", 2023, "Kalimantan", 80, 0.001 ether, 1000);
    }

    function test_Restock_IncreasesAvailableSupply() public {
        vm.startPrank(owner);
        uint256 tokenId = credit.createCreditType("Reforestation", "Verra VCS", 2023, "Kalimantan", 80, 0.001 ether, 1000);
        credit.restock(tokenId, 500);
        vm.stopPrank();

        assertEq(credit.availableSupply(tokenId), 1500);
    }

    function test_Restock_RevertsIfCreditDoesNotExist() public {
        vm.prank(owner);
        vm.expectRevert(abi.encodeWithSelector(MockCarbonCredit.CreditDoesNotExist.selector, 99));
        credit.restock(99, 100);
    }

    function test_UpdateQualityScore_UpdatesScoreAndEmits() public {
        vm.startPrank(owner);
        uint256 tokenId = credit.createCreditType("Reforestation", "Verra VCS", 2023, "Kalimantan", 80, 0.001 ether, 1000);

        vm.expectEmit(true, false, false, true);
        emit QualityScoreUpdated(tokenId, 80, 60);
        credit.updateQualityScore(tokenId, 60);
        vm.stopPrank();

        (,,,, uint8 qualityScore,) = credit.creditMetadata(tokenId);
        assertEq(qualityScore, 60);
    }

    function test_UpdateQualityScore_RevertsIfOver100() public {
        vm.startPrank(owner);
        uint256 tokenId = credit.createCreditType("Reforestation", "Verra VCS", 2023, "Kalimantan", 80, 0.001 ether, 1000);
        vm.expectRevert(abi.encodeWithSelector(MockCarbonCredit.InvalidQualityScore.selector, 150));
        credit.updateQualityScore(tokenId, 150);
        vm.stopPrank();
    }

    function test_SetMinter_UpdatesMinterAndEmits() public {
        vm.prank(owner);
        vm.expectEmit(true, true, false, false);
        emit MinterUpdated(address(0), minter);
        credit.setMinter(minter);

        assertEq(credit.minter(), minter);
    }

    function test_Mint_RevertsIfNotMinter() public {
        vm.prank(owner);
        uint256 tokenId = credit.createCreditType("Reforestation", "Verra VCS", 2023, "Kalimantan", 80, 0.001 ether, 1000);

        vm.expectRevert(MockCarbonCredit.NotMinter.selector);
        credit.mint(address(0xCAFE), tokenId, 1);
    }

    function test_Mint_RevertsIfInsufficientSupply() public {
        vm.startPrank(owner);
        uint256 tokenId = credit.createCreditType("Reforestation", "Verra VCS", 2023, "Kalimantan", 80, 0.001 ether, 10);
        credit.setMinter(minter);
        vm.stopPrank();

        vm.prank(minter);
        vm.expectRevert(abi.encodeWithSelector(MockCarbonCredit.InsufficientSupply.selector, tokenId, 11, 10));
        credit.mint(address(0xCAFE), tokenId, 11);
    }

    function test_Mint_DecrementsSupplyAndIncreasesBalance() public {
        vm.startPrank(owner);
        uint256 tokenId = credit.createCreditType("Reforestation", "Verra VCS", 2023, "Kalimantan", 80, 0.001 ether, 10);
        credit.setMinter(minter);
        vm.stopPrank();

        vm.prank(minter);
        credit.mint(address(0xCAFE), tokenId, 4);

        assertEq(credit.availableSupply(tokenId), 6);
        assertEq(credit.balanceOf(address(0xCAFE), tokenId), 4);
    }
}
