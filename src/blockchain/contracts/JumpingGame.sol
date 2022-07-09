pragma solidity ^0.8.0;

contract JumpingGameFactory{

    uint256 public worldHighScore = 0;
    address public worldHighScoreHolder;
    mapping(address => address) public playersJumpingGameAddress;
    mapping(address => bool) public isPlayedBefore;
    JumpingGame public newGame;

    function newJumpingGame() external {
        require(isPlayedBefore[msg.sender] == false);
        newGame = new JumpingGame();
        address newGameAddress = address(newGame);
        playersJumpingGameAddress[msg.sender] = newGameAddress;
        isPlayedBefore[msg.sender] = true;
    }

    function updateHighScore(uint newWorldHighScore) external {
        require(newWorldHighScore > worldHighScore);
        worldHighScore = newWorldHighScore;
        worldHighScoreHolder = msg.sender;
    }
}

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract JumpingGame is ERC721URIStorage {

    // using Counters for Counters.Counter;
    // Counters.Counter private tokenIds;
    uint256 public highScore = 0;

    constructor() ERC721("Blocks", "BLK") {
    }

    function mint(string memory tokenURI, uint8 tokenId) public returns (uint256) {
        // tokenIds.increment();
        _mint(msg.sender, newBlock);
        _setTokenURI(newBlock, tokenURI);
        return newBlock;
    }

    function setNewHighScore(uint256 newHighScore) external {
        require(newHighScore > highScore);
        highScore = newHighScore;
    }
}