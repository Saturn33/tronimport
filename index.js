import bip39 from 'bip39';
import BIP32Factory from 'bip32';
import TronWeb from 'tronweb';
import readline from 'readline';

function getSeed(mnemonic, password) {
    return bip39.mnemonicToSeed(mnemonic, password);
}

function getNode(seed) {
    return new Promise(function (resolve) {
        import('tiny-secp256k1')
            .then(ecc => BIP32Factory.default(ecc))
            .then(bip32 => {
                let node = bip32.fromSeed(seed);
                resolve(node);
            })
    });
}

function getAccountAtIndex(node, index = 0) {
    return new Promise(function (resolve) {
        let child = node.derivePath(`m/44'/195'/${index}'/0/0`);
        let privateKey = child.privateKey.toString('hex');
        let address = TronWeb.address.fromPrivateKey(privateKey);

        resolve({
            privateKey,
            address
        });
    });
}

function getCredentials() {
    return new Promise(function (resolve) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });
        rl.question(`Enter your mnemonic: `, (mnemonic) => {
            rl.question(`Enter your password: `, (password) => {
                rl.close();
                resolve({mnemonic, password});
            });
        });
    })
}

//main flow
getCredentials()
    .then(data => getSeed(data.mnemonic, data.password))
    .then(seed => getNode(seed))
    .then(node => getAccountAtIndex(node, 0))
    .then(data => {
        console.log(data);
    });
