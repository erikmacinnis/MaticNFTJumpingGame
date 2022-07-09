import { FixedNumber } from 'ethers';
import React, { useEffect, useState, useRef } from 'react';
import factory from '../blockchain/factory.js';
import { ethers } from 'ethers';
import '../css/stylesheet.css';
import Swal from 'sweetalert2';

const Score = ({connected, setHighScore, setWorldHighScore, setWorldHighScoreHolder, gameContract, highScore, worldHighScore, worldHighScoreHolder, setScore, setEnded, setHeight, setBottom, score, ended, setNftPage, bottom}) => {

    useEffect( () => {
    }, [highScore])

    
    useEffect(() => {
        if (ended && connected) {
            updateScores();
        }
    }, [score, ended])

    const updateScores = async() => {
        // User has beaten the Highscore and World Highscore
        if (score > highScore && score > worldHighScore) {
            Swal.fire({
                title: "Congratulations you've beaten your Highscore and the World Highscore\nWould you like to update the Highscore and World Highscore?",
                showCancelButton: true,
                confirmButtonText: "Obviously",
            }).then((result) => {
                if (result.isConfirmed) {
                    logic1();
                }
                else {
                    Swal.fire({
                        title: "Weird decision, but do you at least want to update your own Highscore?",
                        showCancelButton: true,
                        confirmButtonText: "Sure",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            logic2();
                        }
                    })
                }
            })
        }
        // User has only beaten the World Highscore
        else if (score > worldHighScore) {
            Swal.fire({
                title: "Congratulations you've betten the World Highscore\nWould you like to update the World Highscore?",
                showCancelButton: true,
                confirmButtonText: "Sure",
            }).then((result) => {
                if (result.isConfirmed) {
                    logic3();
                }
            })
        }
        // User has beaten their Highscore
        else if (score > highScore) {
            Swal.fire({
                title: "Congratulations on your new Highscore!\nWould you like to update your Highscore?",
                showCancelButton: true,
                confirmButtonText: "Sure",
            }).then((result) => {
                if (result.isConfirmed) {
                    logic4();
                }
            })
        }

        const logic1 = async() => {
            const tx1 = await gameContract.setNewHighScore(ethers.BigNumber.from(score));
            const tx2 = await factory.updateHighScore(ethers.BigNumber.from(score));
            await tx1.wait();
            const tempHighScore = await gameContract.highScore();
            setHighScore(ethers.BigNumber.from(tempHighScore).toNumber());
            await tx2.wait();
            const tempWorldHighScore = await factory.worldHighScore();
            setWorldHighScore(ethers.BigNumber.from(tempWorldHighScore).toNumber());
            const tempWorldHighScoreHolder = await factory.worldHighScoreHolder()
            setWorldHighScoreHolder(ethers.BigNumber.from(tempWorldHighScoreHolder).toHexString());
        }

        const logic2 = async() => {
            const tx = await gameContract.setNewHighScore(ethers.BigNumber.from(score));
            await tx.wait();
            const tempHighScore = await gameContract.highScore();
            setHighScore(ethers.BigNumber.from(tempHighScore).toNumber());
        }

        const logic3 = async() => {
            const tx = await factory.updateHighScore(ethers.BigNumber.from(score));
            await tx.wait();
            const tempWorldHighScore = await factory.worldHighScore();
            setWorldHighScore(ethers.BigNumber.from(tempWorldHighScore).toNumber());
            const tempWorldHighScoreHolder = await factory.worldHighScoreHolder()
            setWorldHighScoreHolder(ethers.BigNumber.from(tempWorldHighScoreHolder).toHexString());            
        }

        const logic4 = async() => {
            const tx = await gameContract.setNewHighScore(ethers.BigNumber.from(score));
            await tx.wait();
            const tempHighScore = await gameContract.highScore();
            setHighScore(ethers.BigNumber.from(tempHighScore).toNumber());
        }
    }
    
    // User is playing the game
    if (!ended){
        return (
            <>
                <div className="highscore_div">
                    High Score {highScore}
                </div>
                <div className="worldhighscore_div">
                    World High Score {worldHighScore}
                </div>
                <div className="score_div">
                    {score}
                </div>
            </>
        )
    }
    // Player just started the game
    else if (bottom) {
        return(
            <>  
                <div className="highscore_div">
                    High Score {highScore}
                </div>
                <div className="worldhighscore_div">
                    World High Score {worldHighScore} 
                </div>
                <div className="worldhighscoreholder_div">
                    World High Score Holder
                    <br/>{worldHighScoreHolder}
                </div>
                <div className="score_div">
                    {score}
                </div>
                <div className="gameover">
                    You're Trash
                </div>
                <button type="button" className="nft_button" onClick={ event => {
                    event.preventDefault();
                    setNftPage(true);
                }}>
                   Get NFT!
                </button>
                <button type="button" className="play_again_button1" onClick={ event => {
                    event.preventDefault();
                    setScore(0);
                    setEnded(false);
                    setHeight(100);
                    setBottom(false);
                }}>
                   Play
                </button>
            </>
        )
    }
    // Player has just lost the game
    else {
        return(
            <>  
                <div className="highscore_div">
                    High Score {highScore}
                </div>
                <div className="worldhighscore_div">
                    World High Score {worldHighScore}
                </div>
                <div className="worldhighscoreholder_div">
                    World High Score Holder
                    <br/>{worldHighScoreHolder}            
                </div>
                <div className="score_div">
                    {score}
                </div>
                <button type="button" className="nft_button" onClick={ event => {
                    event.preventDefault();
                    const delay1 = setTimeout(changeNftPage1, 800);
                    function changeNftPage1() {
                        setNftPage(true);
                        clearInterval(delay1);
                    };
                }}>
                   Get NFT!
                </button>
                <button type="button" className="play_again_button1" onClick={ event => {
                    event.preventDefault();
                    setScore(0);
                    setEnded(false);
                    setHeight(100);
                    setBottom(false);
                }}>
                   Play
                </button>
            </>
        )
    }
}

export default Score;