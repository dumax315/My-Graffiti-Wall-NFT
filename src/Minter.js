import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mintNFT } from "./utils/interact.js";



const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");

	const [image, setImage] = useState("");
	const [button, setButton] = useState("");
    // // On file upload (click the upload button)
    // onFileUpload = () => {
    
    //   // Create an object of formData
    //   const formData = new FormData();
    
    //   // Update the formData object
    //   formData.append(
    //     "myFile",
    //     this.state.selectedFile,
    //     this.state.selectedFile.name
    //   );
    
    //   // Details of the uploaded file
    //   console.log(this.state.selectedFile);
    
    //   // Request made to the backend api
    //   // Send formData object
    //   axios.post("api/uploadfile", formData);
    // };
 
  useEffect(async () => {
		const {address, status} = await getCurrentWalletConnected();
    setWallet(address)
    setStatus(status);
		//removeRefreshOnEnter();
    addWalletListener(); 
  }, []);

	//defult form behaver is bad
	//TODO: doesn't work; need to fix
	const removeRefreshOnEnter  = async () =>  {
		document.getElementById('inputFormMain').addEventListener('submit', function(e) {
    e.preventDefault();
}, false);
	}
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
    const { status } = await mintNFT(name, image);
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
    <div className="Minter">
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
      <h1 id="title">Deploy your own NFT Graffiti Wall</h1>
      <p>
			Upload your own base image and pay the gas fee to get your own (Limited Edition) NFT Graffiti Wall
      </p>
      <form onSubmit={handleSubmit}>
        <h2>Base image:</h2>
				<input type="file" onChange={(event) => setImage(event.target.files[0])} />

        <h2>Title: </h2>
        <input
          type="text"
					id="inputFormMain"
          placeholder="e.g. Theo's Grafitti Wall"
          onChange={(event) => setName(event.target.value)}
        />

      </form>
			
      <button id="mintButton" onClick={onMintPressed} disabled={button}>
        Mint NFT
				
      </button>
			<img src="https://new-minter-tutorial.theohal.repl.co/loading.gif" alt="loading" id="loading" style={{visibility:((button=="true") ? 'visible' : 'hidden')}}></img>
      <p id="status">
        {status}
      </p>
    </div>
  );
};



export default Minter;
