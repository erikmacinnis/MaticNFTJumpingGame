import React, {useEffect, useRef, useState} from 'react';
import {ethers} from 'ethers';
import A from '../MetaData/Images/1.png';
import B from '../MetaData/Images/2.png';
import C from '../MetaData/Images/3.png';
import D from '../MetaData/Images/4.png';
import E from '../MetaData/Images/5.png';
import F from '../MetaData/Images/6.png';
import G from '../MetaData/Images/7.png';
import H from '../MetaData/Images/8.png';
import I from '../MetaData/Images/9.png';
import J from '../MetaData/Images/10.png';
import K from '../MetaData/Images/11.png';
import L from '../MetaData/Images/12.png';
import M from '../MetaData/Images/13.png';
import N from '../MetaData/Images/14.png';
import O from '../MetaData/Images/15.gif';
import Swal from 'sweetalert2';
import '../css/stylesheet.css';

const NftPage = ({setNftPage, gameContract, setNftChange, nftChange, highScore}) => {

    // Writes I'm free over currently used NFT
    useEffect( () => {
        const currentTokenId = localStorage.getItem("current block");
        if (currentTokenId > 0) {
            const currentBlockElement = document.getElementById(currentTokenId).parentElement.firstChild;
            currentBlockElement.firstChild.innerHTML = "I'm Free";
        }
    }, [])

    // Writes I'm free over newly chosen NFT and writes Free Me over previous NFT
    const noteCurrentBlock = (previousTokenId) => {
        if (previousTokenId > 0){
            const previousBlockElement = document.getElementById(previousTokenId).parentElement.firstChild;
            previousBlockElement.firstChild.innerHTML = "Free Me!!";

        }
        const currentTokenId = localStorage.getItem("current block");
        if (currentTokenId > 0){
            const currentBlockElement = document.getElementById(currentTokenId).parentElement.firstChild;
            currentBlockElement.firstChild.innerHTML = "I'm Free";
        }
    }

    const equipeOrMint = async(e) => {
        e.preventDefault();
        const tokenId = e.target.id;
        const tokenScore = tokenId * 10;
        let owner;
        const CID = 'QmbEvMM5x3rQuXgcAgkBJUaFPRHv7DyDnMbVxR3xkAhWPA';
        const tokenURI = `https://ipfs.io/ipfs/${CID}/${tokenId}.json`;
        try {
            await gameContract.ownerOf(ethers.BigNumber.from(tokenId));
            owner = true;
        } catch {
            owner = false;
        }
        const previousTokenId = localStorage.getItem("current block");;
        if (owner) {
            // If you click on the NFT you already own you revert to using the original NFT block
            if (previousTokenId == tokenId) {
                localStorage.setItem("current block", 0);
            }
            else {
                localStorage.setItem("current block", tokenId);
                noteCurrentBlock(previousTokenId);
            }
            setNftChange(!nftChange);
        }
        // If you do have a high enough score to choose this NFT
        // You will have the option to mint the NFT
        else if (highScore > tokenScore) {
            Swal.fire({
                title: 'Congrats dog would you like to mint this sick NFT?',
                showCancelButton: true,
                confirmButtonText: 'Duh',
              }).then((result) => {
                mintNftResponse(result);
              })
        }
        // If user doens't have a high enough score
        else {
            Swal.fire({
                title: 'Weakling',
                text: `Your high score must be at least ${tokenScore} to mint this NFT`,
                icon: 'info',
            })
            noteCurrentBlock(previousTokenId);
        }

        // Mints the NFT
        const mintNftResponse = async (result) => {
            if (result.isConfirmed) {
                const tx = await gameContract.mint(tokenURI, tokenId);
                localStorage.setItem("current block", tokenId);
                await tx.wait();
                noteCurrentBlock(previousTokenId);
                setNftChange(!nftChange);
            }
        }
    }

    // Individually list all NFTs
    // Could be done in a list like my Todo App
    return (
        <>
            <div className="titleButtons">
                <button className="ui green icon button" style={{margin: "10px", marginTop: "4px"}}
                onClick={e => {
                    window.location.reload(false);
                    setNftPage(false);
                }}>
                    <i className="reply icon"></i>
                </button>
                <button className="ui green basic button" style={{width: "400px", fontSize: "20px", marginTop: "20px"}}>
                    Choose Your Block
                </button>
            </div>
            <div className="ui three column grid">
                <div className="three column centered row">
                    <div className="column">
                        <button className="ui green basic button" id="1" onClick={e => {equipeOrMint(e)}}>
                            <p style={{color: "lawngreen", marginTop: "3px", fontSize: "13px"}}>Free Me!!</p> 
                            <img src={A} id={1}></img>
                        </button>
                    </div>
                    <div className="column">
                        <button className="ui green basic button" id="2" onClick={e => {equipeOrMint(e)}}>
                            <p style={{color: "lawngreen", marginTop: "3px", fontSize: "13px"}}>Free Me!!</p> 
                            <img src={B} id={2}></img>
                        </button>
                    </div>
                    <div className="column">
                        <button className="ui green basic button" id="3" onClick={e => {equipeOrMint(e)}}>
                            <p style={{color: "lawngreen", marginTop: "3px", fontSize: "13px"}}>Free Me!!</p> 
                            <img src={C} id={3}></img>
                        </button>

                    </div>
                </div>
                <div className="three column centered row">
                    <div className="column">
                        <button className="ui green basic button"  id="4" onClick={e => {equipeOrMint(e)}}>
                            <p style={{color: "lawngreen", marginTop: "3px", fontSize: "13px"}}>Free Me!!</p> 
                            <img src={D} id={4}></img>
                        </button>
                    </div>
                    <div className="column">
                        <button className="ui green basic button" id="5" onClick={e => {equipeOrMint(e)}}>
                            <p style={{color: "lawngreen", marginTop: "3px", fontSize: "13px"}}>Free Me!!</p> 
                            <img src={E} id={5}></img>
                        </button>
                    </div>
                    <div className="column">
                        <button className="ui green basic button" id="6" onClick={e => {equipeOrMint(e)}}>
                            <p style={{color: "lawngreen", marginTop: "3px", fontSize: "13px"}}>Free Me!!</p>   
                            <img src={F} id={6}></img>
                        </button>
                    </div>
                </div>
                <div className="three column centered row">
                    <div className="column">
                        <button className="ui green basic button" id="7" onClick={e => {equipeOrMint(e)}}>
                            <p style={{color: "lawngreen", marginTop: "3px", fontSize: "13px"}}>Free Me!!</p> 
                            <img src={G} id={7}></img>
                        </button>
                    </div>
                    <div className="column">
                        <button className="ui green basic button" id="8" onClick={e => {equipeOrMint(e)}}>
                            <p style={{color: "lawngreen", marginTop: "3px", fontSize: "13px"}}>Free Me!!</p> 
                            <img src={H} id={8}></img>
                        </button>
                    </div>
                    <div className="column">
                        <button className="ui green basic button" id="9" onClick={e => {equipeOrMint(e)}}>
                            <p style={{color: "lawngreen", marginTop: "3px", fontSize: "13px"}}>Free Me!!</p> 
                            <img src={I} id={9}></img>
                        </button>
                    </div>
                </div>
                <div className="three column centered row">
                    <div className="column">
                        <button className="ui green basic button" id="10" onClick={e => {equipeOrMint(e)}}>
                            <p style={{color: "lawngreen", marginTop: "3px", fontSize: "13px"}}>Free Me!!</p> 
                            <img src={J} id={10}></img>
                        </button>
                    </div>
                    <div className="column">
                        <button className="ui green basic button" id="11" onClick={e => {equipeOrMint(e)}}>
                            <p style={{color: "lawngreen", marginTop: "3px", fontSize: "13px"}}>Free Me!!</p> 
                            <img src={K} id={11}></img>
                        </button>
                    </div>
                    <div className="column">
                        <button className="ui green basic button" id="12" onClick={e => {equipeOrMint(e)}}>
                            <p style={{color: "lawngreen", marginTop: "3px", fontSize: "13px"}}>Free Me!!</p>   
                            <img src={L} id={12}></img>
                        </button>
                    </div>
                </div>
                <div className="three column centered row">
                    <div className="column">
                        <button className="ui green basic button" id="13" onClick={e => {equipeOrMint(e)}}>
                            <p style={{color: "lawngreen", marginTop: "3px", fontSize: "13px"}}>Free Me!!</p> 
                            <img src={M} id={13}></img>
                        </button>
                    </div>
                    <div className="column">
                        <button className="ui green basic button" id="14" onClick={e => {equipeOrMint(e)}}>
                            <p style={{color: "lawngreen", marginTop: "3px", fontSize: "13px"}}>Free Me!!</p> 
                            <img src={N} id={14}></img>
                        </button>
                    </div>
                    <div className="column">
                        <button className="ui green basic button" id="15" onClick={e => {equipeOrMint(e)}}>
                            <p style={{color: "lawngreen", marginTop: "3px", fontSize: "13px"}}>Free Me!!</p> 
                            <img src={O} id={15}></img>
                        </button>
                    </div>
                </div>
            </div>
            <div>

            </div>
        </>
    );

}

export default NftPage;