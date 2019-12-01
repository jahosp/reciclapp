pragma solidity >=0.4.21 <0.6.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";


contract DataValidatorSC {

    struct transaction_rubbish { //struct
        string data_hash;
        string exist;
    }

    mapping(string => transaction_rubbish) rubbish;

    function saveTransaction (string memory id_transaction, string memory _data_hash) public {
        rubbish[id_transaction].data_hash = _data_hash;
        rubbish[id_transaction].exist = "true";
    }

    function validateHash (string memory id_transaction, string memory _data_hash) public view returns (string memory ){
        if (sha256(abi.encodePacked(rubbish[id_transaction].data_hash)) == sha256(abi.encodePacked(_data_hash))) return("Good");
        else return("Error");
    }
}