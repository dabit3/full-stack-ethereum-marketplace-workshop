import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import web3 from 'web3'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loaded, setLoaded] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketCcontract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketCcontract.fetchMarketItems()
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = web3.utils.fromWei(i.price.toString(), 'ether');
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
      }
      return item
    }))
    console.log('items: ', items)
    setNfts(items)
  }
  async function buyNft(nft) {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    console.log('tokenId: ', nft.tokenId)
    
    const price = web3.utils.toWei(nft.price.toString(), 'ether');
    
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }
  return (
    <div className="flex justify-center">
      <div style={{ width: 900 }}>
        <div class="grid grid-cols-2 gap-4 pt-8">
          {
            nfts.map(nft => (
              <div className="border p-4 shadow">
                <img src={nft.image} className="rounded" />
                <p className="text-2xl my-4 font-bold">Price: {nft.price}</p>
                <button className="bg-green-600 text-white py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy NFT</button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
