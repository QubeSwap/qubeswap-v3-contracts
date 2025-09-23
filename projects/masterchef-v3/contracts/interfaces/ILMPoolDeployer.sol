// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./IQubeV3Pool.sol";
import "./ILMPool.sol";

interface ILMPoolDeployer {
    function deploy(IQubeV3Pool pool) external returns (ILMPool lmPool);
}
