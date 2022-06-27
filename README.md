# TronImport
Currently, TronLink (and another software tron wallets) does not support importing a wallet using both a mnemonic phrase and passphrase (this method is described in [BIP-39 (From mnemonic to seed)](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki#From_mnemonic_to_seed))).

This small script helps to generate a few addresses from your mnemonic phrase + passphrase (empty passphrases are also supported). For example, if you broke your hardware wallet and need gain access to your tron assets, you can use this script and gain private key for import to any wallet that supports import by private key.

## Installation
To install dependencies, run `npm install`.

This script tested and successfully runs on current LTS version of NodeJS (16.15) under linux, also it works stable under WSL.

## Execution
To launch the script, run `node index`.
All prompts are made at runtime, with no sensitive data passed through command line arguments or environment variables.

## Security alert
After installing all dependencies, no internet connection is required. The script is designed to work in offline mode, however, for security reasons it is suggested to switch off network access (to prevent potential malicious actions of imported libraries).

**And, as you know, after you enter your mnemonic phrase on ANY resource, you should consider it as compromised. It's recommended to withdraw all your funds to a new wallet and stop using wallet generated from this mnemonic phrase.**

Please, use this or similar scripts only in emergency situation (or for your own research purposes on test data).
