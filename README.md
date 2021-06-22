# Building a Digital Marketplace on Ethereum

This workshop will walk you through creating a digital marketplace on Ethereum.

### Getting started

The first thing we need to do is write the smart contracts.

The marketplace will consist of two main smart contracts:

- NFT Contract for minting NFTs
- Markeplace contract for facilitating the sale of NFTs

For writing an NFT, we can use the [ERC721](https://eips.ethereum.org/EIPS/eip-721) standard that is easily available vial [OpenZeppelin](https://docs.openzeppelin.com/contracts/3.x/erc721).

To get started, head over to [https://remix.ethereum.org/](https://remix.ethereum.org/) and create a new file called __Marketplace.sol__.

Here, get started by importing the contracts that we'll be needing to get started from Open Zeppelin:

```solidity
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";
```