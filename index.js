var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");



//import { MyNFTwithGraffiti } from "./getweb3Info.js";

const FormData = require('form-data');
const fs = require('fs');

const uniqid = require('uniqid');
const multer  = require('multer')

//image editing 
const sharp = require("sharp");

var app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));


//stuff for pinata
const key = process.env['REACT_APP_PINATA_KEY'];
const secret = process.env['REACT_APP_PINATA_SECRET'];

const axios = require('axios');

// const upload = multer({ dest: 'uploads/' })

// let upload = multer({
//   dest: 'uploads/',
// 	filename: uniqid() + ".png"
//   // filename: function (req, file, cb) {cb(null, uniqid() + path.extname(file.originalname));},
// });

let upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `${__dirname}/uploads/`);
        },
        filename: function (req, file, cb) {
            cb(null, uniqid() + path.extname(file.originalname));
        },
    }),
});

app.use(cors({ credentials: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//code to use alchmy web 3 api
const API_URL = process.env['API_URL']
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("./main-abi.json");
const contractChild = require("./child-abi.json");

const contractAddress = "0xB33AAEaAAde302569E52739f284592Cbd2F16E17";
const MyNFTwithGraffiti = new web3.eth.Contract(contract, contractAddress);


async function getCurrentNumberOfTokens() {
  const message = await MyNFTwithGraffiti .methods.getCurrentTokenID().call()
  console.log(message);
	return parseInt(message);
	// return 0
}





async function getTokenMetaData(TokenId) {
  const message = TokenId;
	let wallImg = getCurrentWall(parseInt(message))


	// // Installation: https://github.com/alchemyplatform/alchemy-web3
	
	// // Fetch metadata for a particular NFT:
	// // console.log("fetching metadata for a crypto coven NFT...");
	const response = await web3.alchemy.getNftMetadata({
	   contractAddress: contractAddress,
	   tokenId: TokenId
	})


	
	console.log(response);

	// let metaData= [];
	
	
	return [wallImg, []];
}

async function getGraffitiNFTMetaData(TokenID, contract) {
	
}

async function getCurrentWall(TokenID2) {
	let TokenID = TokenID2 -1
	
  const message = await MyNFTwithGraffiti .methods.getWallHistoryCollection(TokenID).call().catch(function (error) {
		console.log(error)
		return error
	});
  console.log(message);

	let contractAddressCurrent = await message;
	let WallHistoryCollection = await new web3.eth.Contract(contractChild, contractAddressCurrent);
	let numOfGraffities = await WallHistoryCollection .methods.getCurrentTokenID().call()

	console.log(numOfGraffities)
	if(numOfGraffities>0){
		// Fetch metadata for a particular NFT:
		console.log("fetching metadata for a crypto NFT...");
		const response = await web3.alchemy.getNftMetadata({
		  contractAddress: contractAddressCurrent,
		  tokenId: numOfGraffities.toString()
		})
	
		console.log(response.metadata);
		

		// console.log(resImage.toString())
		return response.metadata.image;
	}
	
	
	let urlmessage = await WallHistoryCollection .methods.bassWallImage().call()
	console.log(urlmessage.toString())
	return urlmessage;
}

async function getEditAddress(TokenID) {
	TokenID -=1;
  const message = await MyNFTwithGraffiti .methods.getWallHistoryCollection(TokenID).call().catch(function (error) {
		console.log(error)
		return error
	});
  console.log("contractAddressCurrent");

	let contractAddressCurrent = await message.toString();
	console.log(contractAddressCurrent)
	return contractAddressCurrent;
}


const postToPinata = async(JSONBody) => {
	// return({
	// 		success: false,
	// 		message: "not coded yet",
	// })

    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata ⬇️
    return axios 
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret
            }
        })
        .then(function (response) {
					return({
               success: true,
               pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           })
        })
        .catch(function (error) {
					console.log(error)
					return({
                success: false,
                message: error.message,
            })
    });
};

const postImgToPinata = async(img) => {
	// return({
	// 		success: false,
	// 		message: "not coded yet",
	// })

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    //making axios POST request to Pinata ⬇️
    return axios 
        .post(url, img, {
						maxContentLength: Infinity,
						maxBodyLength: Infinity,
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
								'Content-Type': `multipart/form-data; boundary= ${img._boundary}`,
            }
        })
        .then(function (response) {
					return({
               success: true,
               pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           })
        })
        .catch(function (error) {
					console.log(error)
					return({
                success: false,
                message: error.message,
            })
    });
};



/* GET home page. */
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html' );
});

app.get("/getCurrentWallGrifittieV0/:tokenId", async function(req, res) {
	try{
		let intoSend = parseInt(req.params.tokenId)
		// console.log(intoSend)
		if(isNaN(intoSend)){
			throw "not a number";
		}
		// intoSend -= 1
		newUrl = await getCurrentWall(intoSend);
		// res.sendFile(__dirname + '/public/nft0.jpg' );
		res.redirect(newUrl)
	
	}catch(err){
		console.log(err)
		res.sendFile(__dirname + '/public/MetaDataError.png' );
	}
});

app.post("/ipfs", upload.single('baseImage'), async function(req, res) {
	
	let currentTokens = await getCurrentNumberOfTokens()
	// let currentTokens = 0;
	currentTokens += 1;
	console.log(currentTokens)
	console.log("req.body");
	let metaData = {name:req.body.name,
							 description:"Go to https://new-minter-tutorial.theohal.repl.co/graffitiWall?tokenId="+currentTokens+" to Graffiti this NFT (NFTs r/place style)",
							 image:"https://pinata-and-graf-api.theohal.repl.co/getCurrentWallGrifittieV0/"+currentTokens
							}
	console.log(metaData);
	console.log(req.file.path);
	console.log("pinta");
	
	PintataRes = await postToPinata(metaData)
		//we gather a local file from the API for this example, but you can gather the file from anywhere
	let data = new FormData();
	data.append('file', fs.createReadStream(req.file.path));
	PintataResImage = await postImgToPinata(data)
	console.log(PintataRes)
	console.log(PintataResImage)
	if(PintataRes.success == false || PintataResImage.success == false){
		return({
			success: false,
			message: "Backend Pinata API error",
		})
	}
	resToSend = {
		success: true,
		pinataUrl: PintataRes.pinataUrl,
		pinataImageBase:PintataResImage.pinataUrl
	}
	console.log(resToSend)
	res.json(resToSend)
});


async function downloadImage(url) {
    const imgPath = path.resolve(__dirname, "images", uniqid()+".png");
    const writer = fs.createWriteStream(imgPath);

    const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
    });

    let stream = response.data.pipe(writer);
		await new Promise(fulfill => stream.on("finish", fulfill));

    return imgPath;
}


async function compositeImages(base,img2) {
  try {
		let pathToRes = path.resolve("images", uniqid()+".png");
		console.log(pathToRes)
    await sharp(base)
      .composite([
        {
          input: img2,
          top: 0,
          left: 0,
        },
      ])
      .toFile(pathToRes);
		return pathToRes;
  } catch (error) {
    console.log(error);
  }
}


// await downloadImage();

app.post("/ipfsGraffiti", upload.single('baseImage'), async function(req, res) {
	

	// Fetch metadata for a particular NFT:
	console.log("fetching metadata for a crypto NFT...");
	const response = await web3.alchemy.getNftMetadata({
		contractAddress: contractAddress,
		tokenId: req.body.baseTokenId
	})

	// console.log(response.metadata.image)

	let baseImage = await downloadImage(response.metadata.image)
	console.log([baseImage,req.file.path])
	
	let resComp = await compositeImages(baseImage,req.file.path)
	//process image TODO

	let data = new FormData();
	data.append('file', fs.createReadStream(resComp));
	PintataResImage = await postImgToPinata(data)
	
	let metaData = {name:req.body.name,
							 description:"Here is a static piece of NFT Graffiti history (NFTs r/place style)",
							 image:PintataResImage.pinataUrl
							}
	console.log(metaData);
	// console.log(req.file.path);
	// console.log("pinta");
	
	PintataRes = await postToPinata(metaData)
		//we gather a local file from the API for this example, but you can gather the file from anywhere
	
	// console.log(PintataRes)
	// console.log(PintataResImage)
	if(PintataRes.success == false || PintataResImage.success == false){
		return({
			success: false,
			message: "Backend Pinata API error",
		})
	}
	resToSend = {
		success: true,
		pinataUrl: PintataRes.pinataUrl,
	}
	console.log(resToSend)
	res.json(resToSend)
});


app.get("/currentTokens", async function(req, res) {
	let currentTokens = await getCurrentNumberOfTokens()
	// let resFromMeta = await getTokenMetaData(0)
	// let img = resFromMeta[0]
	// let data =  resFromMeta[1]
	// console.log(data)
	// console.log(img)
	// for (let i = 0; i < currentTokens; i++) {
		
	// }
	
	res.json({
		currentT: currentTokens.toString(),
		tokenMetaData: []
	})
});

app.get("/tokensAtId", async function(req, res) {
	let tokenId = req.query.tokenId;
	try{
		let intoSend = parseInt(tokenId)
		// console.log(intoSend)
		if(isNaN(intoSend)){
			throw "not a number";
		}
		// intoSend -=1;
		let newUrl = await getCurrentWall(intoSend);
		let address = await getEditAddress(intoSend)
		// res.sendFile(__dirname + '/public/nft0.jpg' );
		res.json({
			img:newUrl,
			address:address
			
		})
	
	}catch(err){
		console.log(err)
		 res.status(400).send({
		  message: 'Error Getting NFT Data'
		});
	}
	
});



// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get("env") === "development" ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.json("error");
// });

app.listen(3000, () => {
  console.log('server started');
});
