const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

//START APP
app.listen(4000, function() {
    console.log("Listening on port 4000");
})

// Setting for Hyperledger Fabric
const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
var ccpPath;


app.post('/api/queryall', async function (req, res) {
    ccpPath = path.resolve(__dirname, '.',  'connection-' + req.body.org + '.json');
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const adminExists = await wallet.exists('Admin@'+req.body.org+'.example.com');
        if (!adminExists) {
            console.log('An identity for the user "admin" does not exist in the wallet');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'Admin@'+req.body.org+'.example.com', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(req.body.channel);

        // Get the contract from the network.
        const contract = network.getContract('shipcc');

        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('getAll',req.body.initKey, req.body.endKey);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({response: result.toString()});

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
    }
});


app.post('/api/query', async function (req, res) {
    ccpPath = path.resolve(__dirname, '.',  'connection-' + req.body.org + '.json');
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const adminExists = await wallet.exists('Admin@'+req.body.org+'.example.com');
        if (!adminExists) {
            console.log('An identity for the user "admin" does not exist in the wallet');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'Admin@'+req.body.org+'.example.com', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(req.body.channel);

        // Get the contract from the network.
        const contract = network.getContract('shipcc');

        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('get', req.body.key);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({response: result.toString()});

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
    }
});

app.post('/api/queryhist', async function (req, res) {
    ccpPath = path.resolve(__dirname, '.',  'connection-' + req.body.org + '.json');
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const adminExists = await wallet.exists('Admin@'+req.body.org+'.example.com');
        if (!adminExists) {
            console.log('An identity for the user "admin" does not exist in the wallet');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'Admin@'+req.body.org+'.example.com', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(req.body.channel);

        // Get the contract from the network.
        const contract = network.getContract('shipcc');

        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('getHist', req.body.key);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({response: result.toString()});

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
    }
});

app.post('/api/addship', async function (req, res) {
    ccpPath = path.resolve(__dirname, '.',  'connection-' + req.body.org + '.json');
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const adminExists = await wallet.exists('Admin@'+req.body.org+'.example.com');
        if (!adminExists) {
            console.log('An identity for the user "admin" does not exist in the wallet');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'Admin@'+req.body.org+'.example.com', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(req.body.channel);

        // Get the contract from the network.
        const contract = network.getContract('shipcc');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('set', req.body.args.producto, req.body.args.modelo, req.body.args.tipo, req.body.args.dimensiones,
        req.body.args.fechafab, req.body.args.materiales, req.body.args.descripcion, req.body.args.cantidad, req.body.args.precioud,
        req.body.args.preciotot, req.body.args.org, req.body.args.dst, req.body.args.ordenante, req.body.args.fechaenv);
        console.log('Transaction has been submitted');
        res.send('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
    }
})

exports.app = functions.https.onRequest(app);