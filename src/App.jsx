import {useState} from 'react'
import './App.css'
import BrunoSvgLogo from './assets/BrunoVaultLogo.svg?react'
import * as bip39 from 'bip39'
import {derivePath} from "ed25519-hd-key";
import nacl from "tweetnacl";
import {Keypair as KeyPair} from "@solana/web3.js";
import bs58 from "bs58";
import {Wallet} from "ethers";


function App() {
    const [userState, setUserState] = useState('WALLET_READY')

    const [mnemonic, setMnemonic] = useState(Array.from({length: 12}).fill(''));


    const [isValidSeed, setIsValidSeed] = useState(false)

    const [walletList, setWalletList] = useState([])


    const generateWalletFromMnemonic = (
        pathType,
        mnemonic,
        accountIndex,
    ) => {
        try {
            console.log(mnemonic.join(' '));
            const seedBuffer = bip39.mnemonicToSeedSync(mnemonic.join(' '))
            const derivationpath = `m/44'/${pathType}'/0'/${accountIndex}'`
            console.log(derivationpath)
            const derivedSeed = derivePath(derivationpath, seedBuffer.toString('hex')).key

            let publicKey;
            let privateKey;
            console.log("pathType", pathType)
            if (pathType === "501") {
                //Solana
                const secretKey = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
                const keyPair = KeyPair.fromSecretKey(secretKey)
                publicKey = keyPair.publicKey.toBase58()
                privateKey = bs58.encode(secretKey)


            } else if (pathType === "60") {
                //Ethereum
                privateKey = Buffer.from(derivedSeed).toString('hex')
                publicKey =new Wallet(privateKey).address


            } else {
                alert("Invalid path type")

            }
            return {
                publicKey,
                privateKey,
                mnemonic,
                derivationpath
            };

        } catch (err) {
            console.error(err)
        }



    }
    const onEthereumClick = () => {

        let wallet = generateWalletFromMnemonic("60", mnemonic, 0)
        console.log('Ethereum clicked, userState set to '+wallet.publicKey+wallet.privateKey)


        setWalletList(...walletList, wallet)

    }
    const onSolanaClick = () => {

        let wallet = generateWalletFromMnemonic("501", mnemonic, 0)
        setWalletList(...walletList, wallet)
        console.log('Ethereum clicked, userState set to '+wallet.publicKey+wallet.privateKey)

        // setUserState('WALLET_READY')
    }


    const onPasteCheck = (e) => {
        e.preventDefault()
        const paste = e.clipboardData.getData('text/plain')
        const words = paste
            .trim()
            .toLowerCase()
            .split(/\s+/g)

        if (words.length === 12) {
            const newMnemonic = words.slice(0, 12)
            setMnemonic(newMnemonic)
        }

    }
    const onGetStartedClick = () => {
        setUserState('SEED_CHOICE')
        console.log('Get Started clicked, userState set to ' + userState)
    }
    const onExistingSeedClick = () => {
        setUserState('IMPORT_SEED')
        console.log('Import Seed clicked, userState set to ' + userState)
    }
    const onGenerateSeedClick = () => {
        setUserState('GENERATE_SEED')
        let mnemonic = bip39.generateMnemonic().split(' ')
        setMnemonic(mnemonic)
    }
    const onValidateSeed = () => {

        const mnemonic2 = mnemonic.join(' ')

        if (mnemonic.every(word => word.toString().trim() !== '') && bip39.validateMnemonic(mnemonic2)) {
            setIsValidSeed(true)
            setUserState('WALLET_CHOICE')

        } else {
            alert("Enter valid phrase")
            setIsValidSeed(false)
        }
    }
    const onBackClick = () => {
        setUserState('WELCOME')
        console.log('Back clicked, userState set to ' + userState)
    }


    return (


        <div style={{
            height: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: '',
        }}>
            <div style={{
                display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '15px', marginLeft: '0px'
            }}>
                <BrunoSvgLogo style={{width: '40px', height: '40px',}}/>
                <h1>BrunoVault</h1>
            </div>
            {userState === 'WELCOME' && <div style={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start'
            }}>
                <h1 style={{fontSize: '44px', margin: '0px', marginLeft: '10px'}}>Welcome to Bruno Vault!</h1>
                <p style={{marginLeft: '10px'}}>Import or Generate Seed Phrase for your Solana and Ethereum
                    wallet.</p>
                <button
                    style={{
                        marginLeft: '10px', marginTop: '10px', padding: '10px', fontSize: '16px', cursor: 'pointer'
                    }}
                    onClick={onGetStartedClick}>Get Started
                </button>
            </div>}
            {userState === 'SEED_CHOICE' && <div style={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start'
            }}>
                <h1 style={{fontSize: '44px', margin: '0px', marginLeft: '10px'}}>Set up your Web3 Wallet</h1>
                <p style={{marginLeft: '10px'}}>Would you like to import an existing seed phrase or generate a
                    new one?</p>
                <button
                    style={{
                        width: '220px',
                        marginLeft: '10px',
                        marginTop: '10px',
                        padding: '10px',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}
                    onClick={onExistingSeedClick}>Enter existing seed phrase
                </button>
                <button
                    style={{
                        width: '220px',
                        marginLeft: '10px',
                        marginTop: '10px',
                        padding: '10px',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}
                    onClick={onGenerateSeedClick}>Generate new seed phrase
                </button>
            </div>}
            {userState === 'IMPORT_SEED' && <div style={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start'
            }}>
                <h1 style={{fontSize: '44px', margin: '0px', marginLeft: '10px'}}>Import your Recovery
                    Phrase</h1>
                <p style={{marginLeft: '10px'}}>Enter your 12-word seed phrase below:</p>
                <div style={{
                    marginLeft: '10px', display: 'grid', gridTemplateColumns: 'auto auto auto', gap: '10px'
                }}>
                    {mnemonic.map((word, index) => (
                        <input key={index} style={{padding: '6px', width: '120px'}} type="text"
                               id={`seed${index + 1}`} name={`seed${index + 1}`} value={word}

                               onPaste={(e) => onPasteCheck(e)}
                               onChange={(e) => {
                                   word = e.target.value;
                                   const newMnemonic = [...mnemonic];
                                   newMnemonic[index] = word;
                                   setMnemonic(newMnemonic);

                               }}

                        />))}
                </div>
                <button
                    style={{

                        marginLeft: '10px',
                        marginTop: '20px',
                        padding: '10px',
                        fontSize: '16px',
                        cursor: isValidSeed ? 'pointer' : 'auto'
                    }}
                    onClick={onValidateSeed}>Continue
                </button>
            </div>}
            {userState === 'GENERATE_SEED' && <div style={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start'
            }}>
                <h1 style={{fontSize: '44px', margin: '0px', marginLeft: '10px'}}>Save your Recovery
                    Phrase</h1>
                <p style={{marginLeft: '10px'}}>We never store your seed phrase:</p>
                <div style={{
                    marginLeft: '10px', display: 'grid', gridTemplateColumns: 'auto auto auto', gap: '10px'
                }}>
                    {mnemonic.map((word, index) => (
                        <textarea style={{
                            resize: 'none',
                            fontFamily: 'sans-serif',
                            fontSize: '16px',
                            textAlign: 'center',
                            alignContent: 'center',
                            width: '120px', pointerEvents: 'none'
                        }}
                                  readOnly={true}
                                  key={index} value={word}


                        />))}
                </div>
                <button
                    style={{

                        marginLeft: '10px',
                        marginTop: '20px',
                        padding: '10px',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}
                    onClick={onValidateSeed}>Continue
                </button>
            </div>}
            {userState === 'WALLET_CHOICE' && <div style={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start'
            }}>
                <h1 style={{fontSize: '60px', margin: '0px 0px 0px 10px'}}>BrunoVault supports </h1>
                <h1 style={{fontSize: '44px', margin: '0px 0px 0px 10px'}}>multiple blockchains</h1>
                <p style={{marginLeft: '10px', marginTop: '0px'}}>Choose a blockchain to get started</p>
                <div style={{

                    width: '240px', display: 'flex', margin: '0px', flexDirection: 'row', justifyContent: 'flex-start'
                }}>
                    <button
                        style={{
                            flex: 1,
                            marginLeft: '10px',
                            marginTop: '20px',
                            padding: '10px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                        onClick={onSolanaClick}>Solana
                    </button>
                    <button
                        style={{

                            flex: 1,
                            width: '100px',
                            marginLeft: '10px',
                            marginTop: '20px',
                            padding: '10px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                        onClick={onEthereumClick}>Ethereum
                    </button>
                </div>


            </div>}

            {userState === 'WALLET_READY' && <div style={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: '',
                alignItems: 'flex-start'
            }}>

                <h1 style={{fontSize: '60px', margin: '0px 0px 0px 10px'}}>Your Wallet is ready</h1>
                <h1 style={{fontSize: '44px', margin: '0px 0px 0px 10px'}}>Solana</h1>
                <h1 style={{fontSize: '44px', margin: '0px 0px 0px 10px'}}></h1>
                <p style={{marginLeft: '10px', marginTop: '0px'}}></p>






            </div>}


            <div>
                <p style={{fontSize: '12px', color: 'gray', marginLeft: '10px'}}>© 2026 BrunoVault. All rights
                    reserved.</p>
            </div>
        </div>

    )
}

export default App
