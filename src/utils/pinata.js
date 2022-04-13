//const key = process.env['REACT_APP_PINATA_KEY'];
//const secret = process.env['REACT_APP_PINATA_SECRET'];

//const axios = require('axios');


export const pinJSONToIPFS = async(JSONBody) => {
  const response = await fetch("https://pinata-and-graf-api.theohal.repl.co/ipfs", { 
		method: 'POST',
		body: JSONBody
	}).then(response => response.json()).catch((error) => {
	  console.error('Error:', error);
		return {
			success: false,
			message: error.message,
		}
	});
	if(!response.success){
		return {
			success: false,
			message: response.message,
		}
	}
	return {
		success: true,
		pinataUrl: response.pinataUrl,
		pinataImageBase: response.pinataImageBase
	}
}

export const pinGraffittiToIPFS = async(JSONBody) => {
  const response = await fetch("https://pinata-and-graf-api.theohal.repl.co/ipfsGraffiti", { 
		method: 'POST',
		body: JSONBody
	}).then(response => response.json()).catch((error) => {
	  console.error('Error:', error);
		return {
			success: false,
			message: error.message,
		}
	});
	if(!response.success){
		return {
			success: false,
			message: response.message,
		}
	}
	return {
		success: true,
		pinataUrl: response.pinataUrl,
		pinataImageBase: response.pinataImageBase
	}
}