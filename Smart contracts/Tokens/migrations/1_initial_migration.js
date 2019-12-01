var Migrations = artifacts.require("./HackathonCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
