import { useEffect, useState } from "react";

// import { contractAddress } from "./utils/interact.js";

// const alchemyKey = process.env['REACT_APP_ALCHEMY_KEY'];
// const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
// const web3 = createAlchemyWeb3(alchemyKey);

// const contractABI = require('../contract-abi.json')


const WallCollectionViewer = (props) => {
	const [numberOfWalls, setnumberOfWalls] = useState("");
	const [Walls, setWalls] = useState([]);
	
	const getAllGraffitiWalls = async () => {
		const response =await fetch("https://pinata-and-graf-api.theohal.repl.co/currentTokens").then(response => response.json());
		console.log(response)
		return [response.currentT, response.tokenMetaData];

	}

	useEffect(() => {
		async function fetchData() {
	    let graArray = await getAllGraffitiWalls()
			let numOfWalls = graArray[0];
			let wallMetaData= graArray[1];
			console.log(numOfWalls)
			setnumberOfWalls(numOfWalls)
			setWalls(wallMetaData)
			return numOfWalls
	    // ...
	  }
		fetchData()

  }, []);

	return (
    <div className="WallCollectionViewer"><div class="outerView">
			<div>
				<h1>MY NFT Graffiti Wall</h1>
				<h2><i>NFTs Meet r/place</i></h2>
				<p>Make your Graffiti Wall for anyone to graffiti or graffiti you're friends and enemies' Graffiti Walls (and get a static NFT of your edit)</p>
				<p>Each Graffiti Wall is connected with a collection of NFTs that contain its history. Each Graffiti Wall can be graffitied 15 times before it is locked forever as a static NFT. ONLY 20 Graffiti Walls can be made in this limited public alpha of the project. </p>
				<h3>Number Of Created Walls: {numberOfWalls} </h3>
				<h3>View on OpenSea 
					<a href="https://testnets.opensea.io/collection/graffitiwallsv0-1-v2"> https://testnets.opensea.io/collection/graffitiwallsv0-1-v2</a>
				</h3>
			</div></div>
			 <iframe src="https://testnets.opensea.io/collection/graffitiwallsv0-1-v2" width="100%"></iframe> 
			{Walls.map((Walls,index)=>{

	  		return <li key={index}>{Walls}</li>
	
	    })}
    </div>
  );
}

export default WallCollectionViewer;
