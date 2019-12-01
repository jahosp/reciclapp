var express = require('express');
var app = express();
const port = 2002 || process.env.PORT;
var contract = require('truffle-contract');
const Web3 = require('web3');
var MongoClient = require('mongodb').MongoClient;


const dataValidator_artifact = require('./build/contracts/HackathonCoin.json');

var sender = "0xCf0001a029B55d00bD40A260a326CAB4F4A883ec";

app.use(express.json());

/////////////START CONNECTION\\\\\\\\\\\\\
async function connect() {
    try {

        /////////////ETHEREUM CONNECTION\\\\\\\\\\\\\

        console.log("Connecting to Ethereum node...");
        var dataValidator = await contract(dataValidator_artifact)
        await dataValidator.setProvider(web3.currentProvider);
        instance = await dataValidator.deployed();
        console.log("Successful connected to the Ethereum node!");

        /////////////MONGODB CONNECTION\\\\\\\\\\\\\

        console.log("Connecting to mongodb ...");
        /*
        MongoClient.connect(urlMongo, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function (err, db) {
            if (err) throw console.log(err);
            dbo = db.db("mydb");
            dbo.createCollection("basura", function (err, res) {
                if (err) throw console.log(err);
                console.log("Collection created!");
                db.close();
            });
        });*/

        console.log("***** TOT CONNECTAT *****");
        
    } catch(error) {
        console.log(error);
        process.exit();
    }
}

app.post('/veureMoney', async function(req, res) {

    try {
        req.setTimeout(900000);
        console.log(req.body);
        console.log("Buscant el money que tens....");
        let money = (await instance.balanceOf(req.body.data.address)).toString();
        console.log("Tens " + (money));

        res.status(200).send(money);
    } catch(error) { console.log(error); res.sendStatus(400); } 
})

app.post('/enviarRecompensa', async function(req, res) {

    try {
        req.setTimeout(900000);

        console.log("Enviant recompensa....");
        console.log(req.body);
        (await instance.transfer(req.body.address, req.body.money, {from: sender, gas: 700000, gasPrice: 700000000}));

        //console.log((await instance.approve(sender, req.body.address, {from: sender, gas: 700000, gasPrice: 700000000})));
        console.log("Recompensa enviada!....");

        res.sendStatus(200);
    } catch(error) { console.log(error); res.sendStatus(400); } 
})

app.post('/enviarTransaccio', async function(req, res) {

    try {
        req.setTimeout(900000);

        console.log("Enviant transaccio....");

        //await instance.transferFrom(req.body.sender, req.body.recipient, req.body.money, {from: sender, gas: 700000, gasPrice: 700000000});
        
        (await instance.transferFrom(req.body.sender, req.body.recipient, req.body.money, {from: sender, gas: 700000, gasPrice: 700000000}));

        console.log("Transaccio enviada!....");

        res.sendStatus(200)
    } catch(error) { console.log(error); res.sendStatus(400); } 
})

app.post('/approveTransaccio', async function(req, res) {

    try {
        req.setTimeout(900000);

        console.log("Enviant transaccio....");

        await instance.approve(req.body.sender, req.body.money + 1000000, {from: sender, gas: 700000, gasPrice: 700000000});

        //(await instance.transferFrom(req.body.sender, req.body.recipient, req.body.money, {from: sender, gas: 700000, gasPrice: 700000000}));

        console.log("Transaccio enviada!....");

        res.sendStatus(200)
    } catch(error) { console.log(error); res.sendStatus(400); } 
})

app.post('/seeAllowance', async function(req, res) {

    try {
        req.setTimeout(900000);

        console.log("Enviant transaccio....");

        console.log((await instance.allowance(sender, req.body.sender, {from: sender, gas: 700000, gasPrice: 700000000})).toString());

        //(await instance.transferFrom(req.body.sender, req.body.recipient, req.body.money, {from: sender, gas: 700000, gasPrice: 700000000}));

        console.log("Transaccio enviada!....");

        res.sendStatus(200);
    } catch(error) { console.log(error); res.sendStatus(400); } 
})

app.post('/increaseAllowance', async function(req, res) {

    try {
        req.setTimeout(900000);

        console.log("Enviant transaccio....");

        console.log((await instance.increaseAllowance(sender, req.body.sender, {from: sender, gas: 700000, gasPrice: 700000000})).toString());

        //(await instance.transferFrom(req.body.sender, req.body.recipient, req.body.money, {from: sender, gas: 700000, gasPrice: 700000000}));

        console.log("Transaccio enviada!....");

        res.sendStatus(200);
    } catch(error) { console.log(error); res.sendStatus(400); } 
})

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

app.listen(port, async function() {
    try {
        web3 = await new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider('http://localhost:7545'), null, {});
        console.log("Express Listening at http://localhost:" + port);
        connect();
    }
    catch (error) {
        console.log(error);
        process.exit();
    }
})

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
