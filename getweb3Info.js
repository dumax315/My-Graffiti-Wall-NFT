const API_URL = process.env['API_URL']
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("./main-abi.json");

const contractAddress = "0x274Da3016D30bB5E305Ce0a8400e3EaAE37Cbc8D";
const MyNFTwithGraffiti = new web3.eth.Contract(contract, contractAddress);

async function getCurrentNumberOfTokens() {
	const MyNFTwithGraffiti = await new web3.eth.Contract(contract, contractAddress);
  const message = await MyNFTwithGraffiti .methods.getCurrentTokenID().call();
  console.log(message);
}
//getCurrentNumberOfTokens()