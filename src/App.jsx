import {useState} from 'react'
import './App.css'
import BrunoSvgLogo from './assets/BrunoVaultLogo.svg?react'
import * as bip39 from 'bip39'

function App() {
    const [userState, setUserState] = useState('WELCOME')

    const [mnemonic, setMnemonic] = useState(Array.from({length: 12}).fill(''));


    const [isValidSeed, setIsValidSeed] = useState(false)


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
        const mnemonic2 = bip39.generateMnemonic()
        setMnemonic(mnemonic2)
        const seedPhrase = bip39.mnemonicToSeedSync(mnemonic2).toString('hex')
        setUserState('WALLET_CHOICE')

        console.log('Generate Seed clicked, userState set to ' + seedPhrase)
    }
    const onValidateSeed = () => {

        const mnemonic2 = mnemonic.join(' ')

        if (mnemonic.every(word => word.toString().trim() !== '') && bip39.validateMnemonic(mnemonic2)) {
            setIsValidSeed(true)
            const seedPhrase = bip39.mnemonicToSeedSync(mnemonic2).toString('hex')
            console.log(seedPhrase)
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
    const onEthereumClick = () => {
        setUserState('WALLET_READY')
    }
    const onSolanaClick = () =>{
        setUserState('WALLET_READY')
    }


    return (<div style={{
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
                <h1 style={{fontSize: '44px', margin: '0px', marginLeft: '10px'}}>Import your Recovery
                    Phrase</h1>
                <p style={{marginLeft: '10px'}}>Enter your 12-word seed phrase below:</p>
                <div style={{
                    marginLeft: '10px', display: 'grid', gridTemplateColumns: 'auto auto auto', gap: '10px'
                }}>
                    {mnemonic.map((word, index) => (
                        <textarea key={index} style={{padding: '6px', width: '120px'}} type="text"
                               id={`seed${index + 1}`} name={`seed${index + 1}`} value={word}

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
                justifyContent: 'center',
                alignItems: 'flex-start'
            }}>


            </div>}


            <div>
                <p style={{fontSize: '12px', color: 'gray', marginLeft: '10px'}}>© 2026 BrunoVault. All rights
                    reserved.</p>
            </div>
        </div>

    )
}

export default App
