import { ethers } from 'ethers'
import Web3Modal from "web3modal"
import { useState, useEffect } from 'react'

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loaded, setLoaded] = useState('not-loaded')
  useEffect(() => {

  }, [])
  async function connect() {
    const provider = new ethers.providers.JsonRpcProvider()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await contract.fetchMarketItems()
    console.log('data: ', data)
    setNfts(data)
  }
  return (
    <div className="flex justify-center">
      <div className="w-1/2">
        <input />
        <button onClick={connect}>Connect</button>
      </div>
    </div>
  )
}
