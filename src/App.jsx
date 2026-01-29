import { useState } from 'react'
import './App.css'
import BrunoSvgLogo from './assets/BrunoVaultLogo.svg?react'

function App() {
  return (
    <>
    <div style={{height:'100%',minHeight:'100vh' ,display:'flex',flexDirection:'column',justifyContent:'',}}>
      <div style={ {display:'flex', flexDirection:'row',alignItems:'center', gap:'15px',marginLeft:'0px'} }>
        <BrunoSvgLogo style={{ width: '40px', height: '40px',}} />
        <h1>Bruno Vault</h1>
      </div>
    <div style={{flexGrow:1,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'flex-start'}}>
      <h1 style={{fontSize:'44px',margin:'0px',marginLeft:'10px'}}>Welcome to Bruno Vault!</h1>
      <p style={{marginLeft:'10px'}}>Import or Generate Seed Phrase for your Solana and Ethereum wallet.</p>

      <button style={{marginLeft:'10px',marginTop:'10px', padding:'10px', fontSize:'16px', cursor:'pointer'}}>Get Started</button>
       </div>
       
       <div>
        <p style={{fontSize:'12px', color:'gray', marginLeft:'10px'}}>© 2024 Bruno Vault. All rights reserved.</p>
      </div>
    </div>
   
    </>
  )
}

export default App
