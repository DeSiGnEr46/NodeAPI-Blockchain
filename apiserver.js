var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')
var https = require('https');
var fs = require('fs');

const PORT = 8080;

var app = express();
app.use(cors());
app.use(bodyParser.json());


// Setting for Hyperledger Fabric
const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
var ccpPath;

app.get('/api/test', async function (req,res){
    res.send("Api funcionando!");
});

app.post('/api/queryall', async function (req, res) {
    ccpPath = path.resolve(__dirname, '.', 'connection-org1.json');
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const adminExists = await wallet.exists('Admin@org1.example.com');
        if (!adminExists) {
            console.log('An identity for the user "admin" does not exist in the wallet');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'Admin@org1.example.com', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(req.body.channel);

        // Get the contract from the network.
        const contract = network.getContract('shipcc');

        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('getAll', req.body.initKey, req.body.endKey);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({ response: result.toString() });

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
    }
});


app.post('/api/query', async function (req, res) {
    ccpPath = path.resolve(__dirname, '.', 'connection-org1.json');
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const adminExists = await wallet.exists('Admin@org1.example.com');
        if (!adminExists) {
            console.log('An identity for the user "admin" does not exist in the wallet');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'Admin@org1.example.com', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(req.body.channel);

        // Get the contract from the network.
        const contract = network.getContract('shipcc');

        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('get', req.body.key);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({ response: result.toString() });

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
    }
});

app.post('/api/queryhist', async function (req, res) {
    ccpPath = path.resolve(__dirname, '.', 'connection-org1.json');
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const adminExists = await wallet.exists('Admin@org1.example.com');
        if (!adminExists) {
            console.log('An identity for the user "admin" does not exist in the wallet');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'Admin@org1.example.com', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(req.body.channel);

        // Get the contract from the network.
        const contract = network.getContract('shipcc');

        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('getHist', req.body.key);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({ response: result.toString() });

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
    }
});

app.post('/api/addship', async function (req, res) {
    ccpPath = path.resolve(__dirname, '.', 'connection-org1.json');
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const adminExists = await wallet.exists('Admin@org1.example.com');
        if (!adminExists) {
            console.log('An identity for the user "admin" does not exist in the wallet');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'Admin@org1.example.com', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(req.body.channel);

        // Get the contract from the network.
        const contract = network.getContract('shipcc');

        // Submit the specified transaction.
        console.log(req.body);
        await contract.submitTransaction('set', req.body.key, req.body.producto, req.body.modelo, req.body.tipo, req.body.dimensiones,
            req.body.fechafab, req.body.materiales, req.body.descripcion, req.body.cantidad, req.body.precioud,
            req.body.preciotot, req.body.org, req.body.dst, req.body.ordenante, req.body.fechaenv);
        console.log('Transaction has been submitted');
        res.status(200).json({response : 'Transaction has been submitted'});

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).json({ error: error });
    }
});

app.post('/api/editship', async function (req, res) {
    ccpPath = path.resolve(__dirname, '.', 'connection-org1.json');
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const adminExists = await wallet.exists('Admin@org1.example.com');
        if (!adminExists) {
            console.log('An identity for the user "admin" does not exist in the wallet');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'Admin@org1.example.com', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(req.body.channel);

        // Get the contract from the network.
        const contract = network.getContract('shipcc');

        // Submit the specified transaction.
        console.log(req.body);
        await contract.submitTransaction('edit', req.body.key, req.body.producto, req.body.modelo, req.body.tipo, req.body.dimensiones,
            req.body.fechafab, req.body.materiales, req.body.descripcion, req.body.cantidad, req.body.precioud,
            req.body.preciotot, req.body.org, req.body.dst, req.body.ordenante, req.body.fechaenv);
        console.log('Transaction has been submitted');
        res.status(200).json({response : 'Transaction has been submitted'});

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).json({ error: error });
    }
});

https.createServer({
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem'),
    passphrase: 'pass'
}, app)
.listen(PORT);
