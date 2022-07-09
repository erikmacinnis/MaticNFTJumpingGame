import React, {useEffect, useRef, useState} from 'react';
import Tile from './Tile.js';
import '../css/stylesheet.css';

const TileFrame = ({bottom, setInitialTilePos, setFirstTilePos}) => {

    // these are refs to the tiles 
    // first is the bottom tile, second is the second bottom tile, and so on...
    const fourth = useRef();
    const third = useRef();
    const second = useRef();
    const first = useRef();

    useEffect( () => {

        // retrieves the styles for each tile
        const fourthStyle = fourth.current.getStyle();
        const thirdStyle = third.current.getStyle();
        const secondStyle = second.current.getStyle();
        const firstStyle = first.current.getStyle();

        // set the hieght of the initial tiles
        fourthStyle.bottom = "531px";
        fourthStyle.left = (Math.random() * 80) + "%";
        thirdStyle.bottom = "384px";
        thirdStyle.left = (Math.random() * 80) + "%";
        secondStyle.bottom = "237px";
        secondStyle.left = (Math.random() * 80) + "%";
        firstStyle.bottom = "90px";
        firstStyle.left = (Math.random() * 80) + "%";
        
        setInitialTilePos(parseInt(secondStyle.left));
        setFirstTilePos(parseInt(secondStyle.left));
    }, []);

    useEffect( () => {
        if (!bottom) {
            // checks which tile is the bottom tile
            // if it is then it will be moved to the top
            fourth.current.isBottom();
            third.current.isBottom();
            second.current.isBottom();
            first.current.isBottom();

            const initialize = () => {
                fourth.current.moveDown();
                third.current.moveDown();
                second.current.moveDown();
                first.current.moveDown();
            }
            initialize();
        }
    }, [bottom])

    return (
        <div className="tileframe">
            <Tile className="tile" ref={fourth} style={{bottom: '531px', left: (Math.random() * 80) + "%"}} setFirstTilePos={setFirstTilePos}/>
            <Tile className="tile" ref={third} style={{bottom: '384px', left: (Math.random() * 80) + "%"}} setFirstTilePos={setFirstTilePos}/>
            <Tile className="tile" ref={second} style={{bottom: '237px', left: (Math.random() * 80) + "%"}} setFirstTilePos={setFirstTilePos}/>
            <Tile className="tile" ref={first} style={{bottom: '90px', left: (Math.random() * 80) + "%"}} setFirstTilePos={setFirstTilePos}/>
        </div>
    )
}

export default TileFrame;
