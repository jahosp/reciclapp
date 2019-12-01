var Migrations = artifacts.require("./DataValidatorSC.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
