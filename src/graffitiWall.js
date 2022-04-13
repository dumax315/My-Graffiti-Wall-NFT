import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { connectWallet, getCurrentWalletConnected, mintNFTGraffiti } from "./utils/interact.js";


const GraffitiWall = (props) => {
	  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");

	const [image, setImage] = useState("");
	const [button, setButton] = useState("");

	
	const [WallName, setWallName] = useState("Loading...");
	const [imgSize, setImgSize] = useState("Loading...");
	const [imgUrl, setImgUrl] = useState("");
	const [openSeaLink, setopenSeaLink] = useState("");
	let navigate = useNavigate();

	let [searchParams, setSearchParams] = useSearchParams();

	const getAGraffitiWall = async (id) => {
		const response =await fetch("https://pinata-and-graf-api.theohal.repl.co/tokensAtId?tokenId="+id).then(response => response.json());
		console.log(response.address)
		setWallName(response.address)
		return [response.address, response.img];

	}
	
	useEffect(async () => {
	// Run! Like go get some data from an API.
		let tokenId = searchParams.get("tokenId")
		setopenSeaLink("https://testnets.opensea.io/assets/mumbai/0xB33AAEaAAde302569E52739f284592Cbd2F16E17/"+(tokenId).toString())
		console.log(tokenId)
		if(tokenId == null){
			return navigate("/");
		}

		
		let resOfSingleGra = await getAGraffitiWall(parseInt(tokenId))
		// console.log(resOfSingleGra)
		// setWallName(resOfSingleGra[0])
		setImgUrl(resOfSingleGra[1])

		const imgGetRes = document.getElementById("graffitiImg");
		imgGetRes.onload = function() {
			// console.log(this.width)
			setImgSize([this.width,this.height].join(", "))
		}
		// imgGetRes.src = imgUrl;
		
		
		const {address, status} = await getCurrentWalletConnected();
    setWallet(address)
    setStatus(status);
		//removeRefreshOnEnter();
    addWalletListener(); 
		//WallName(searchParams.get("name"))
	}, []);

	//code from minter
	const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

	function handleSubmit(event) {
    event.preventDefault();
  }
	
	
  const onMintPressed = async () => {
		setButton("true");//TODO: implement
    const { status } = await mintNFTGraffiti(name, image, WallName, searchParams.get("tokenId"));
    setStatus(status);
		setButton("");
  };

	function addWalletListener() {
	  if (window.ethereum) {
	    window.ethereum.on("accountsChanged", (accounts) => {
	      if (accounts.length > 0) {
	        setWallet(accounts[0]);
	        setStatus("👆🏽 Write a message in the text-field above.");
	      } else {
	        setWallet("");
	        setStatus("🦊 Connect to Metamask using the top right button.");
	      }
	    });
	  } else {
	    setStatus(
	      <p>
	        {" "}
	        🦊{" "}
	        <a target="_blank" href={`https://metamask.io/download.html`}>
	          You must install Metamask, a virtual Ethereum wallet, in your
	          browser.
	        </a>
	      </p>
	    );
	  }
	}
	
  return (

    <div className="main">
			<div id="instructions" className="WallCollectionViewer">
				<img id="graffitiImg" src={imgUrl} alt="A Graffiti Wall NFT" class={WallName}></img>
				<p>
					<h3>Recommended Steps:</h3>
					
					<ol>
					  <li>Right Click and save the image on your computer (make the file name something usefull like "graffitiMe.png"</li>
					  <li>Open the base image in a software like photoshop and create a new blank layer.</li>
					  <li>Add graffiti/edits to your liking and the save the new layer as a PNG.</li>
						<li>Upload your image here and choose a funny name for you edit.</li>
						<li>You will get a static NFT of the Wall at this point in time</li>
					</ol> 


					
				</p>
			</div>
		
			<div className="Minter">
				<div className="innerMinter">
	      <button id="walletButton" onClick={connectWalletPressed}>
	        {walletAddress.length > 0 ? (
	          "Connected: " +
	          String(walletAddress).substring(0, 6) +
	          "..." +
	          String(walletAddress).substring(38)
	        ) : (
	          <span>Connect Wallet</span>
	        )}
	      </button>
	
	      <br></br>
	      <h1 id="title">Add to this NFT Graffiti Wall</h1>
	      <p>
				Upload your own PNG of size: ({imgSize}) and pay the gas fee to <strong>Graffiti</strong> this NFT Graffiti Wall NFT
	      </p>
	      <form onSubmit={handleSubmit}>
	        <h2>Graffiti image:</h2>
					<p>25%+ of pixels must be blank (opacity 0)</p>
					<input type="file" onChange={(event) => setImage(event.target.files[0])} />
					<h2>Name Your Graffiti: </h2>
	        <input
	          type="text"
						id="inputFormMain"
	          placeholder="e.g. Theo's Grafitti on you lolz"
	          onChange={(event) => setName(event.target.value)}
	        />
	
	      </form>
				
	      <button id="mintButton" onClick={onMintPressed} disabled={button}>
	        Graffiti NFT
	      </button>
				<div>
				<img src="https://new-minter-tutorial.theohal.repl.co/loading.gif" alt="loading" id="loading" style={{visibility:((button=="true") ? 'visible' : 'hidden')}}></img>
	      <p id="status">
	        {status}
	      </p>
	    </div>
			 <a href={openSeaLink}>{openSeaLink}</a> 
				</div>
			<iframe src={openSeaLink} width="100%" style={{height : '90vh'}} ></iframe> </div>
    </div>
  );
}

function graffitiWallWraper() {
	return (
		
		<GraffitiWall></GraffitiWall>
  );
}

export default graffitiWallWraper;