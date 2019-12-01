var express = require('express');
var app = express();
const port = 3003 || process.env.PORT;
var contract = require('truffle-contract');
const Web3 = require('web3');
var MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');


const dataValidator_artifact = require('./build/contracts/DataValidatorSC.json');

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

app.post('/saveHash', async function(req, res) {

    try {
        req.setTimeout(900000);
        var hash_sha1 = crypto.createHash('sha1');

        console.log("Guardant el hash....");

        let id_transaction = hash_sha1.update(req.body.timestamp).digest("hex").substr(0,30);
        let cont = 1;
        await instance.saveTransaction(id_transaction, req.body.data_hash, {from: sender, gas: 700000, gasPrice: 700000000});

        console.log("Hash guardat!");        
        res.sendStatus(200);

    } catch(error) { console.log(error); res.sendStatus(400); } 
})

app.post('/validateHash', async function(req, res) {

    try {
        req.setTimeout(900000);

        console.log("Començant a validar un hash...");
        var hash_sha1 = crypto.createHash('sha1');
        let id_transaction = hash_sha1.update(req.body.timestamp).digest("hex").substr(0,30);
        let cont = 1;

        result = false;

        if (await instance.validateHash(id_transaction, req.body.data_hash) == "Good") {
            console.log("Són iguals sou els faking amos!");
            res.status(200).send(result);
            result = true;
        } else {
            console.log("WTF no són iguals!");
        }

        console.log("Validació realitzada!");

        res.status(200).send(result);
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
