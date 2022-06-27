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

function getAccounts(node, amount) {
    let promises = [];
    for (let index = 0; index < amount; index++) {
        promises.push(new Promise(function (resolve) {
            let child = node.derivePath(`m/44'/195'/${index}'/0/0`); //ledger, tronlink
            //if you are using something else, these paths may be ok for you
            // let child = node.derivePath(`m/44'/195'/${index}'/0`);
            // let child = node.derivePath(`m/44'/195'/${index}'`);
            let privateKey = child.privateKey.toString('hex');
            let address = TronWeb.address.fromPrivateKey(privateKey);

            resolve({
                index,
                address,
                privateKey,
            });
        }));
    }
    return Promise.all(promises);
}

function trimMnemonic(mnemonic) {
    return mnemonic.trim().replace(/\s+/g, ' ');
}

function validateAmount(amount) {
    amount = amount | 0;
    if (amount <= 1) {
        amount = 1;
    }
    return amount;
}

function getCredentials() {
    return new Promise(function (resolve) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });
        rl.question(`Enter your mnemonic: `, (mnemonic) => {
            mnemonic = trimMnemonic(mnemonic);
            if (bip39.validateMnemonic(mnemonic)) {
                console.info("Your mnemonic is OK");
            } else {
                console.warn("Your mnemonic is INVALID, but it's not a problem, if you know what you do");
            }
            rl.question(`Enter your mnemonic password (optional): `, (password) => {
                rl.question(`How many adresses you want to generate (1 by default)? `, (amount) => {
                    amount = validateAmount(amount);
                    rl.close();
                    resolve({mnemonic, password, amount});
                });
            });
        });
    })
}

//main flow
getCredentials()
    .then(data => {
            getSeed(data.mnemonic, data.password)
                .then(seed => getNode(seed))
                .then(node => getAccounts(node, data.amount))
                .then(result => {
                    console.info(result);
                });
        }
    );
