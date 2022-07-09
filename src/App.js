// Todo 
// give the app a nice background and feel
// Handle the block null value issue in Block file
// Document the rest
// change the alert and confirm buttons with https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
// test the game a little
// put on GitHub and host it on web with https://fleek.co/

import React, {useEffect, useState, useRef} from 'react';
import Block from './components/Block.js';
import TileFrame from './components/TileFrame.js';
import Score from './components/Score.js';
import NftPage from './components/NftPage.js';
import factory from './blockchain/factory.js';
import './css/stylesheet.css';
import { ethers } from 'ethers';
import Swal from 'sweetalert2';

const App = () => {

    // connect button
    const button = useRef();

    // changing current NFT listener
    const [nftChange, setNftChange] = useState(null);
    const [nftPage, setNftPage] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [worldHighScore, setWorldHighScore] = useState(0);
    const [worldHighScoreHolder, setWorldHighScoreHolder] = useState(null);
    const [ended, setEnded] = useState(true);
    const [height, setHeight] = useState(100);
    const [bottom, setBottom] = useState(false);
    // tile position of first tile of game
    const [initialTilePos, setInitialTilePos] = useState(0);
    // tile position of next incoming tile
    const [firstTilePos, setFirstTilePos] = useState(0);
    const [gameContract, setGameContract] = useState(null);
    const [connected, setConnected] = useState(false);

    // reloads the game every new highscore
    useEffect( () => {
        if (score !== 0) {
            loadGame();
        }
    }, [highScore])

    // loads game at the start
    useEffect( () => {
        loadGame();
    }, [])

    useEffect( () => {
        if (!ended) {
            startGame();
        }
    }, [ended]);

    useEffect(() => {
        if (connected){
            button.current.innerHTML = "Disconnect";
        }
        else {
            button.current.innerHTML = "Connect to MetaMask";
        }
    }, [connected])

    useEffect(() => {
        detectAccountChange();
    }, [])

    // reloads game when a wallet disconnects, account changes, or chain changed
    const detectAccountChange = () => {
        window.ethereum.on("disconnect", () => {
            setConnected(false);
            loadGame();
        })
        window.ethereum.on("accountsChanged", () => {
            setConnected(false);
            loadGame();
          });

        window.ethereum.on("chainChanged", () => {
            loadGame();
        })
    }

    const loadGame = async() => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            let signer;
            // A Web3Provider wraps a standard Web3 provider, which is
            // what MetaMask injects as window.ethereum into each page
            const provider = new ethers.providers.Web3Provider(window.ethereum)

            // MetaMask requires requesting permission to connect users accounts
            await provider.send("eth_requestAccounts", []);

            // The MetaMask plugin also allows signing transactions to
            // send ether and pay to change state within the blockchain.
            // For this, you need the account signer...
            signer = provider.getSigner()

            const chainId = 80001;
            // Connecting the user to the Mumbai chain if they are not already connected
            if (window.ethereum.networkVersion !== chainId) {
                try {
                    await provider.send('wallet_switchEthereumChain', [{chainId: "0x" + chainId.toString(16)}])
                }
                catch (err) {
                    if (err.code === 4902) {
                        await provider.send('wallet_addEthereumChain', [{chainName: 'Polygon Testnet Mumbai', chainId: "0x" + chainId.toString(16), nativeCurrency: { name: 'tMATIC', decimals: 18, symbol: 'tMATIC' }, rpcUrls: ['https://rpc-mumbai.maticvigil.com']}])
                    } 
                }
            }
            if (window.ethereum.isConnected() && window.ethereum.networkVersion == chainId) {
                const walletAddress = await signer.getAddress();
                const ERC20_ABI = [
                    'constructor()',
                    'function highScore() public view returns (uint256)',
                    'function mint(string memory tokenURI, uint256 tokenId) public returns (uint256)',
                    'function setNewHighScore(uint256 newHighScore) external',
                    'function ownerOf(uint256 tokenId) public view returns (address)'
                ];

                try {
                    // checking if the wallet has created its own game smart contract
                    if (!(await factory.isPlayedBefore(walletAddress))){
                        // sets nft block to basic block

                        // Creates account for new user then loads the game again 
                        // On the next reload the user will now have an account
                        async function newGame() {
                            const tx = await factory.newJumpingGame();
                            tx.wait();
                            setTimeout(function() {
                                loadGame();
                            }, 20000)
                        }
                        Swal.fire({
                            title: "Would you like to create an account to keep track of your scores and NFTs?",
                            showCancelButton: true,
                            confirmButtonText: "Yup",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                localStorage.setItem("current block", 0);
                                newGame();
                            }
                            else {
                                // sets default functionality
                                setConnected(false);
                                setWorldHighScore(0);
                                setHighScore(0);
                                setWorldHighScoreHolder(""); 
                                return;
                            }
                        })
                    } else {
                        // setting all aspects of smart contract to variables 
                        setConnected(true);
                        const gameAddress = await factory.playersJumpingGameAddress(walletAddress);
                        const gameContract = new ethers.Contract(gameAddress, ERC20_ABI, signer);
                        setGameContract(gameContract);
                        const tempHighScore = await gameContract.highScore();
                        setHighScore(ethers.BigNumber.from(tempHighScore).toNumber());
                        const tempWorldHighScore = await factory.worldHighScore();
                        setWorldHighScore(ethers.BigNumber.from(tempWorldHighScore).toNumber());
                        const tempWorldHighScoreHolder = await factory.worldHighScoreHolder()
                        setWorldHighScoreHolder(ethers.BigNumber.from(tempWorldHighScoreHolder).toHexString());
                        }
                }
                catch(err) {
                    setConnected(false);
                    setWorldHighScore(0);
                    setHighScore(0);
                    setWorldHighScoreHolder(""); 
                    return;
                    }
            }
            else {
                setConnected(false);
                setWorldHighScore(0);
                setHighScore(0);
                setWorldHighScoreHolder(""); 
            }

        } 
        else {
            Swal.fire({
                title: 'You do not have MetaMask installed',
                text: `Download MetaMask at https://metamask.io/download/`,
                icon: 'info',
            })
            // If you don't specify a //url//, Ethers connects to the default 
            // (i.e. ``http:/\/localhost:8545``)
            setConnected(false);
            setWorldHighScore(0);
            setHighScore(0);
            setWorldHighScoreHolder(""); 
        }
    }

    const startGame = async() => {

        // Creates a countdown then starts the game
        let countdown, textnode;
        const timer1 = setTimeout( run, 1000);
        function run() {
            countdown = document.createElement("div");
            countdown.className = "number";
            textnode = document.createTextNode("3");
            countdown.appendChild(textnode);
            document.getElementById("container").appendChild(countdown);
            clearInterval(timer1);
        }
        const timer2 = setTimeout( run2, 2000);
        function run2() {
            textnode.nodeValue = "2";
            clearInterval(timer2);
        }
        const timer3 = setTimeout( run3, 3000);
        function run3() {
            textnode.nodeValue = "1";
            
            clearInterval(timer3);
        }
        const start = setTimeout(bot, 4000);
        function bot() {
            // triggers the start of the game in TileFram and Block pages
            setBottom(true);
            countdown.remove();
            clearInterval(start);
        }
    }

    // Action for the on click button
    const connectButton = async() => {
        if (connected) {
            setScore(0);
            setConnected(false);
            setWorldHighScore(0);
            setHighScore(0);
            setWorldHighScoreHolder(""); 
        }
        else {
            loadGame();
        }
    }

    // game page
    if (!nftPage) {
        return (
            <>
                <div className="background">
                    <div className="bigContainer">
                        <button 
                                ref={button} 
                                className="ui inverted green button" 
                                onClick={e => connectButton(e)}>
                        </button>
                        <div className="reminder">
                            Remember that a MetaMask transaction can take up to 30 seconds
                        </div>
                        <div className='faucet'>
                            You can get your TMATIC tokens through this faucet 
                            <a href="https://faucet.polygon.technology/"> HERE</a>
                        </div>
                        <div className='testnet'>
                            Check out the leader on the Mumbai explorer 
                            <a href="https://mumbai.polygonscan.com/"> HERE</a>
                        </div>
                        <div className="ui container" id="container">
                            <Score connected={connected} setHighScore={setHighScore} setWorldHighScore={setWorldHighScore} setWorldHighScoreHolder={setWorldHighScoreHolder} gameContract={gameContract} highScore={highScore} worldHighScore={worldHighScore} worldHighScoreHolder={worldHighScoreHolder} setNftPage={setNftPage} setScore={setScore} setEnded={setEnded} setHeight={setHeight} setBottom={setBottom} score={score} ended={ended} bottom={bottom}/>
                            <div className="floor"></div>
                            <TileFrame nftPage={nftPage} bottom={bottom} setInitialTilePos={setInitialTilePos} setFirstTilePos={setFirstTilePos}/>
                            <Block nftChange={nftChange} score={score} setScore={setScore} setEnded={setEnded} height={height} setHeight={setHeight} bottom={bottom} setBottom={setBottom} initialTilePos={initialTilePos} firstTilePos={firstTilePos}/>
                        </div>
                    </div>
                </div>
           </>
        )

        // nft page
    } else {
        return (
            <div className="background">
                <div className="bigContainer">
                    <div className="reminder">
                            Minting an NFT may take up to 30 seconds
                    </div>
                    <div className='faucet'>
                            You can trade your NFTs on  
                            <a href="https://testnets.opensea.io/"> Opensea!</a>
                        </div>
                    <div className="ui container" style={{backgroundColor: "black"}}>
                        <NftPage gameContract={gameContract} setNftPage={setNftPage} highScore={highScore} setNftChange={setNftChange} nftChange={nftChange}/>
                    </div>
                </div>
            </div>
        )
    }
    

};

export default App;