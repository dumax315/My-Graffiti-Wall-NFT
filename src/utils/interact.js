import {pinJSONToIPFS,pinGraffittiToIPFS} from './pinata.js'
const alchemyKey = process.env['REACT_APP_ALCHEMY_KEY'];
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);


const contractABI = require('../contract-abi.json')
const contractChildABI = require('../child-abi.json')
export const contractAddress = "0x43b107f0f0e82E1591c8121a39Cf9F3E5f079b11";


export const mintNFT = async (name, image) => {
	//error handling
 if ((name.trim() == "" || typeof image == "string")) { 
   	return {
	    success: false,
	    status: "❗Please make sure all fields are completed before minting.",
   }
  }

	if(!['image/png'].includes(image.type)) {
    return {
	    success: false,
	    status: "Image Must Be PNG",
   	}
  }

	//make metadata
	// Create an object of formData
	const formData = new FormData();

	// Update the formData object
	formData.append(
		"baseImage",
		image,
		image.name
	);
	formData.append(
		"name",
		name
	)

	
  const metadata = new Object();
  metadata.name = name;
	metadata.baseImage = image;

	console.log(formData)
	console.log(metadata)

  //make pinata call
  const pinataResponse = await pinJSONToIPFS(formData);
  if (!pinataResponse.success) {
	// if (!false) {
      return {
          success: false,
          status: "😢 Something went wrong while uploading your tokenURI.",
      }
  } 
	
	//load smart contract
	console.log(pinataResponse);
	console.log(pinataResponse.pinataUrl);

  const tokenURI = pinataResponse.pinataUrl;
	const bassWallImageURL = pinataResponse.pinataImageBase;

	window.contract = await new web3.eth.Contract(contractABI, contractAddress);

	//set up your Ethereum transaction
	const transactionParameters = {
	        to: contractAddress, // Required except during contract publications.
	        from: window.ethereum.selectedAddress, // must match user's active address.
	        'data': window.contract.methods.mintNewWallNFT(window.ethereum.selectedAddress, tokenURI, bassWallImageURL).encodeABI()//make call to NFT smart contract 
	};
	
	//sign the transaction via Metamask
	 try {
	    const txHash = await window.ethereum
	        .request({
	            method: 'eth_sendTransaction',
	            params: [transactionParameters],
	        });
	    return {
	        success: true,
	        status: "✅ Check out your transaction on Etherscan: https://mumbai.polygonscan.com/tx/" + txHash
	    }
	 } catch (error) {
	    return {
	        success: false,
	        status: "😥 Something went wrong: " + error.message
	    }
	
	 }
}


export const mintNFTGraffiti = async (name, image,contract, baseTokenId) => {
	//error handling
	console.log(contract)
 if ((name.trim == "" || typeof image == "string" || contract == "Loading...")) { 
   	return {
	    success: false,
	    status: "❗Please make sure all fields are completed before minting.",
   }
  }

	if(!['image/png'].includes(image.type)) {
    return {
	    success: false,
	    status: "Image Must Be PNG",
   	}
  }

	
	// const count = pixelData.filter(item => item.status === '0').length; 

	//make metadata
	// Create an object of formData
	const formData = new FormData();

	// Update the formData object
	formData.append(
		"baseImage",
		image,
		image.name
	);
	formData.append(
		"name",
		name
	)
	formData.append(
		"contract",
		contract
	)
	formData.append(
		"baseTokenId",
		baseTokenId
	)
	
 //  const metadata = new Object();
 //  metadata.name = name;
	// metadata.baseImage = image;

	// console.log(formData)
	// console.log(metadata)

  //make pinata call
  const pinataResponse = await pinGraffittiToIPFS(formData);
  if (!pinataResponse.success) {
	// if (!false) {
      return {
          success: false,
          status: "😢 Something went wrong while uploading your tokenURI. " +pinataResponse.message,
      }
  } 
	
	//load smart contract
	console.log(pinataResponse);
	console.log(pinataResponse.pinataUrl);

  const tokenURI = pinataResponse.pinataUrl;
	let contractAddressNew = contract;

	window.contract = await new web3.eth.Contract(contractChildABI, contractAddressNew);
	console.log(contractAddressNew)
	//set up your Ethereum transaction
	const transactionParameters = {
	        to: contractAddressNew, // Required except during contract publications.
	        from: window.ethereum.selectedAddress, // must match user's active address.
	        'data': window.contract.methods.mintWallGraffiti(window.ethereum.selectedAddress, tokenURI).encodeABI()//make call to NFT smart contract 
	};
	
	//sign the transaction via Metamask
	 try {
	    const txHash = await window.ethereum
	        .request({
	            method: 'eth_sendTransaction',
	            params: [transactionParameters],
	        });
	    return {
	        success: true,
	        status: "✅ Check out your transaction on Etherscan: https://mumbai.polygonscan.com/tx/" + txHash
	    }
	 } catch (error) {
	    return {
	        success: false,
	        status: "😥 Something went wrong: " + error.message
	    }
	
	 }
}

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Write a message in the text-field above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};


