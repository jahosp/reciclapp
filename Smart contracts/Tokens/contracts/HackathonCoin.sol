pragma solidity >=0.4.21 <0.6.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";


contract HackathonCoin is ERC20, ERC20Detailed {

    constructor () public ERC20Detailed("HackathonCoin", "HKC", 18) {
        _mint(msg.sender, 10000 * (10 ** uint256(decimals())));
    }

}