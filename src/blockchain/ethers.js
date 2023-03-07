import { ethers } from "ethers";

let signer;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // MetaMask requires requesting permission to connect users accounts
    provider.send("eth_requestAccounts", []);

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    signer = provider.getSigner()

    console.log("Account signer:", signer);
} else {
    // If you don't specify a //url//, Ethers connects to the default 
    // (i.e. ``http:/\/localhost:8545``)
    const provider = new ethers.providers.JsonRpcProvider("https://speedy-nodes-nyc.moralis.io/00d2c7794a08b46d3079567b/polygon/mumbai");

    // The provider also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, we need the account signer...
    signer = provider.getSigner()

}


export default signer;
