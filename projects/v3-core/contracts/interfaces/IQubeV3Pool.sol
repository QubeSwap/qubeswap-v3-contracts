// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.5.0;

import './pool/IQubeV3PoolImmutables.sol';
import './pool/IQubeV3PoolState.sol';
import './pool/IQubeV3PoolDerivedState.sol';
import './pool/IQubeV3PoolActions.sol';
import './pool/IQubeV3PoolOwnerActions.sol';
import './pool/IQubeV3PoolEvents.sol';

/// @title The interface for a QubeSwap V3 Pool
/// @notice A QubeSwap pool facilitates swapping and automated market making between any two assets that strictly conform
/// to the ERC20 specification
/// @dev The pool interface is broken up into many smaller pieces
interface IQubeV3Pool is
    IQubeV3PoolImmutables,
    IQubeV3PoolState,
    IQubeV3PoolDerivedState,
    IQubeV3PoolActions,
    IQubeV3PoolOwnerActions,
    IQubeV3PoolEvents
{

}
