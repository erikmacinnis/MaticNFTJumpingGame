import React, {useEffect, useRef, useState} from 'react';
import '../css/stylesheet.css';
import preset from '../MetaData/Images/unsplashImage.jpg';
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

const Block = ({nftChange, setScore, score, setEnded, height, setHeight, bottom, setBottom, initialTilePos, firstTilePos}) => {

    const blockRef = useRef();
    let newImage;
    let pixelHeight = height + "px";
    const initialPos = (parseInt(initialTilePos) + 7) + "%";

    // images would not load link with a path
    const images = [preset, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O];

    useEffect( () => {
        atBottom();
    }, [bottom])

    useEffect( () => {
        if (blockRef != null) {
            lateralMovement();
        }
    }, [])

    useEffect( () => {
        changeBlock();
    }, [nftChange])

    // changes the block skin
    const changeBlock = () => {
        const tokenId = localStorage.getItem("current block");
        newImage = images[tokenId];
        blockRef.current.firstChild.src = newImage;
    }

    // will check if block landed on a tile 
    // if it does land on a tile it will call jump
    // if it does not it will just fall and end the game
    const atBottom = () => {
        let blockPos = parseInt(blockRef.current.style.left);
        if(bottom) {
            // measurements are considering size of block
            if (firstTilePos - 12 < blockPos && blockPos < firstTilePos + 5){
                setScore(1+score);
                jump();
            }
            else {
                // responsible for moving the block down if the tile is missed
                let currentHeight = height;
                const timerDown = setInterval(downFrame, 50);
                function downFrame() {
                    // when the tile hits the floor
                    if (currentHeight <= 25){
                        clearInterval(timerDown);
                        setHeight(currentHeight);
                        setBottom(true);
                        setEnded(true);
                    }
                    // moving the tile down 
                    else {
                        currentHeight -= 5;
                        pixelHeight = currentHeight + "px"
                        blockRef.current.style.bottom = pixelHeight;
                    }
                }
                    
            }
        }
    }

    // when an left or right arrow is pressed it will call a function to move either left or right
    // this function will go loop on until another key is pressed
    const lateralMovement = () => {
        let timerRight;
        let timerLeft;
        let keydown = false;
        // listens for key down
        document.addEventListener("keydown", (event) => {
            event.preventDefault();
            if (keydown) {
                // stops any movement if the block is already moving
                clearInterval(timerRight);
                clearInterval(timerLeft);
                keydown = false;
            }
            else if (blockRef.current.style !== null) {
                // if the block is not moving
                keydown = true;
                // checks if the key is the right key
                if (event.keyCode === 39){
                    timerRight = setInterval(moveRight, 10);
                    function moveRight() {
                        if (parseInt(blockRef.current.style.left) <= 87){
                            blockRef.current.style.left = (parseInt(blockRef.current.style.left) + 1) + "%";
                        }
                        else {
                            clearInterval(timerRight);
                            keydown = false;
                        }
                    }
                }
                // checks if the key is the left key
                if (event.keyCode === 37) {
                    timerLeft = setInterval(moveLeft, 10);
                    function moveLeft() {
                        if (parseInt(blockRef.current.style.left) >= 1){
                            blockRef.current.style.left = (parseInt(blockRef.current.style.left) - 1) + "%";
                        }
                        else {
                            clearInterval(timerLeft);
                            keydown = false;
                        }
                    }
                }
            }
        })
    }

    // will only be called when block is at bottom
    const jump = () => {
        setBottom(false);
        const jumpHeight = 130;
        let currentHeight = height;
        const startingHeight = height;
        const timerUp = setInterval(jumpFrame, 50);
        function jumpFrame() {
            if (currentHeight - startingHeight >= jumpHeight) {
                clearInterval(timerUp);
                setHeight(currentHeight);
                down();
            }
            else{
                currentHeight += 10;
                pixelHeight = currentHeight + "px"
                blockRef.current.style.bottom = pixelHeight;
            }
        }
        
        // will be called when jump reaches jumpHeight
        // this function will only bring the block until the bottom tile
        const down = () => {
            const timerDown = setInterval(downFrame, 50);
            function downFrame() {
                if (currentHeight <= 100){
                    clearInterval(timerDown);
                    setHeight(currentHeight);
                    setBottom(true);
                }
                else {
                    currentHeight -= 10;
                    pixelHeight = currentHeight + "px"
                    blockRef.current.style.bottom = pixelHeight;
                }
            }
        }
    }

    return (
        <div ref={blockRef} className="block" onClick={() => {jump()}} style={{bottom: pixelHeight, left: initialPos}}>
            <img className='blockPic' src={preset}></img>
        </div>
    )

}

export default Block;
