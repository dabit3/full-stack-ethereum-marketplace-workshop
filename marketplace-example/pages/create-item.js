import { ethers } from 'ethers'
import Web3Modal from "web3modal"
import { create as ipfsHttpClient } from 'ipfs-http-client'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function Home() {
  async function connect() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await contract.fetchMarketItems()
    console.log('data: ', data)
  }
  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      console.log('added: ', added)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      console.log('url: ', url)
    } catch (error) {
      console.log('Error uploading file: ', error);
    }  
  }
  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col">
        <input 
          placeholder="NFT Name"
          className="my-4 border rounded p-4"
        />
        <input
          placeholder="NFT Description"
          className="my-4 border rounded p-4"
        />
        <input
          type="file"
          name="NFT"
          className="my-4"
          onChange={onChange}
        />
      </div>
    </div>
  )
}
