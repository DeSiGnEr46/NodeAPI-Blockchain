/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '.', 'connection-org1.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('Admin@org1.example.com');
        if (adminExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccpPath, { wallet, identity: 'Admin@org1.example.com', discovery: { enabled: true, asLocalhost: true } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('channelall');

            // Get the contract from the network.
            const contract = network.getContract('shipcc');
            //const result = await contract.submitTransaction('set','2', 'Tuerca', 'MNB4', 'Hexagonal', '2mmX2mmX1mm', '24-01-2020',
            //'Hierro', 'Tuerca compatible con tornillo modelo XC32', '4500', '0.02', '80', 'Org1', 'org1', 'Oliver', '26-01-2020');
            const result = await contract.evaluateTransaction('get','2');
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            return;
        }
        // Enroll the admin user, and import the new identity into the wallet.
        const cert = fs.readFileSync('/home/saw_vi/Documents/fabric-samples/3org2ch_143/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem').toString();
        const key = fs.readFileSync('/home/saw_vi/Documents/fabric-samples/3org2ch_143/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/4e329156ff60dd807d5ce6d2eddd6a7d4c8f59beda0917715b63af7225f819c4_sk').toString();

        const identityLabel = 'Admin@org1.example.com';
        const identity = X509WalletMixin.createIdentity('Org1MSP', cert, key);

        await wallet.import(identityLabel, identity);

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
}

main();
