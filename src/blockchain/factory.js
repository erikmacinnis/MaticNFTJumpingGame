import signer from './ethers.js';
import { ethers } from "ethers";



const address = "0x4C4BBab8f2A78a560De725C3eC38aF685B91E500";

const ERC20_ABI = [
    'function worldHighScore() public view returns (uint256)',
    'function worldHighScoreHolder() public view returns (address)',
    'function playersJumpingGameAddress(address addr) view returns (address player)',
    'function isPlayedBefore(address addr) view returns (bool before)',
    'function newJumpingGame() external',
    'function updateHighScore(uint num) external',
];

const factory = new ethers.Contract(address, ERC20_ABI, signer);

export default factory;

