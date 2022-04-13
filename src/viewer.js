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
    <div className="WallCollectionViewer">
			<div>
			
				<h3>Number Of Created Walls: {numberOfWalls} </h3>
				<h3>View on OpenSea 
					<a href="https://testnets.opensea.io/collection/graffitiwalls-qgrdzdavzb"> https://testnets.opensea.io/collection/graffitiwalls-qgrdzdavzb</a>
				</h3>
			</div>
			 <iframe src="https://testnets.opensea.io/collection/graffitiwalls-qgrdzdavzb" width="100%" style={{height : '90vh'}} ></iframe> 
			{Walls.map((Walls,index)=>{

	  		return <li key={index}>{Walls}</li>
	
	    })}
    </div>
  );
}

export default WallCollectionViewer;
