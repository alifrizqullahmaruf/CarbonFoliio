// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {CarbonCredit} from "../src/CarbonCredit.sol";
import {PortfolioManager} from "../src/PortfolioManager.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        address deployer = msg.sender;

        CarbonCredit creditToken = new CarbonCredit(deployer);
        PortfolioManager portfolioManager = new PortfolioManager(address(creditToken), deployer);
        creditToken.setMinter(address(portfolioManager));

        creditToken.createCreditType(
            "Reforestation", "Verra VCS", 2023, "Kalimantan, Indonesia", 82, 0.001 ether, 1000
        );
        creditToken.createCreditType(
            "Renewable Energy", "Gold Standard", 2022, "Gujarat, India", 91, 0.0015 ether, 500
        );

        vm.stopBroadcast();

        console.log("CarbonCredit deployed at:", address(creditToken));
        console.log("PortfolioManager deployed at:", address(portfolioManager));

    }
}