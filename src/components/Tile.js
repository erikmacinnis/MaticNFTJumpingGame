import React, {useRef, forwardRef, useImperativeHandle} from 'react';
import '../css/stylesheet.css';

const Tile = forwardRef((props, forwardedRef) => {

    const tile = useRef();

    // allows me to individually get use the tiles
    useImperativeHandle(forwardedRef, () => ({

        // Move the tile down
        moveDown() {
            let total = 147;
            const timerDown = setInterval(downFrame, 60);
            function downFrame() {
                
                const height = parseInt(tile.current.style.bottom);
                total -= 7;

                if (total >= 0) {
                    if (height > 15) {
                        tile.current.style.bottom = (height - 7) + "px";
                    }
                    else {
                        tile.current.style.bottom = "594px";
                        tile.current.style.left = (Math.random() * 80) + "%";
                    }
                }
                else {
                    clearInterval(timerDown);
                }
            }
        },
        
        // Checks if the tile is at the bottom
        isBottom() {
            const height = parseInt(tile.current.style.bottom);
            if (height === 237){
                props.setFirstTilePos(parseInt(tile.current.style.left));
                return true;
            }
        },

        // Returns the style so I can alter the style of the element
        getStyle() {
            return tile.current.style;
        }
    }))

    return (
        <div className="tile" ref={tile} ></div>
    )
})

export default Tile;