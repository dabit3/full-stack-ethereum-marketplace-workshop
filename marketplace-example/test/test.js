const { BigNumber } = ethers
const axios = require('axios')

describe("NFTMarket", function() {
  it("Should interact with the token contract", async function() {

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();
    await nft.deployed()
    const nftContractAddress = nft.address;

    const Market = await ethers.getContractFactory("NFTMarket");
    const market = await Market.deploy();
    await market.deployed()
    const marketAddress = market.address; 

    let transaction = await nft.createToken("https://ipfs.fleek.co/ipfs/bafybeicfghmsa3qukuz3dl4cwsoe7muscoaym5z6jhsxdlxwguun43cpfy")
    
    let tx = await transaction.wait()
    let event = tx.events.pop()
    let value = event.args[2]
    value = BigNumber.from(value).toNumber()
    // console.log('value: ', value)

    transaction = await nft.createToken("https://ipfs.fleek.co/ipfs/bafybeicfghmsa3qukuz3dl4cwsoe7muscoaym5z6jhsxdlxwguun43cpfy")

    tx = await transaction.wait()
    event = tx.events.pop()
    value = event.args[2]
    value = BigNumber.from(value).toNumber()
    // console.log('value: ', value)

    transaction = await nft.createToken("https://ipfs.fleek.co/ipfs/bafybeicfghmsa3qukuz3dl4cwsoe7muscoaym5z6jhsxdlxwguun43cpfy")

    await nft.createToken("https://ipfs.fleek.co/ipfs/bafybeicfghmsa3qukuz3dl4cwsoe7muscoaym5z6jhsxdlxwguun43cpfy")

    await nft.setApprovalForAll(marketAddress, true)
  
    await market.createMarketItem(nftContractAddress, 1, 1000)
    await market.createMarketItem(nftContractAddress, 2, 1000)
    await market.createMarketItem(nftContractAddress, 3, 1000)

    let items = await market.fetchMarketItems()
    console.log('length: ',items.length)

    const [_, userAddress, userAddress2] = await ethers.getSigners();

    await market.connect(userAddress).createMarketSale(nftContractAddress, 1, { value: 1000})
    await market.connect(userAddress2).createMarketSale(nftContractAddress, 2, { value: 1000})

    items = await market.fetchMarketItems()
    console.log('length: ',items.length)
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId)
      const tokenMeta = await axios.get(tokenUri)
      let item = {
        price: BigNumber.from(i.price).toNumber(),
        tokenId: BigNumber.from(i.tokenId).toNumber(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
  });
});
