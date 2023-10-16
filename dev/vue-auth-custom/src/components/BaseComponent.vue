<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { ethers } from 'ethers'
import { GelatoRelayPack } from '@safe-global/relay-kit'
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'
import type { Web3AuthModal } from '@paro-paro/web3-auth'
import type { IProvider } from '@web3auth/base'

const instance = getCurrentInstance()
const auth = instance?.appContext.config.globalProperties.$auth as Web3AuthModal
let provider: ethers.providers.Web3Provider | null = null

// hardcoded for demo purposes
const EOA: string = import.meta.env.VITE_EOA as string
const SAFE_ADDRESS: string = import.meta.env.VITE_SAFE_ADDRESS as string
const AMOUNT = '0.0000001'

async function onCheck() {
  console.log('auth', auth)
}

async function onSignIn() {
  try {
    await auth.signIn()
    provider = new ethers.providers.Web3Provider(auth.provider as IProvider)
  }
  catch (e) {
    if (e instanceof Error)
      console.log('error:', e.message)
  }
}

async function onSignOut() {
  try {
    await auth.signOut()
    provider = null
  }
  catch (e) {
    if (e instanceof Error)
      console.log('error:', e.message)
  }
}

async function onRelay() {
  try {
    console.log('Sending RELAY TX')
    const relayPack = new GelatoRelayPack()
    const signer = provider?.getSigner()

    if (!signer)
      throw new Error('No signer')

    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer })
    const safeSdk = await Safe.create({
      ethAdapter,
      safeAddress: SAFE_ADDRESS,
    })

    const transactions = [
      {
        to: EOA,
        data: '0x',
        value: ethers.utils.parseUnits(AMOUNT, 'ether').toString(),
      },
    ]

    const safeTransaction = await relayPack.createRelayedTransaction({ safe: safeSdk, transactions })
    const safeTransactionSigned = await safeSdk.signTransaction(safeTransaction)

    const res = await relayPack.executeRelayTransaction(safeTransactionSigned, safeSdk)
    console.log('url: ', `https://relay.gelato.digital/tasks/status/${res.taskId}`)
  }
  catch (e) {
    if (e instanceof Error)
      console.log('error:', e.message)
  }
}
</script>

<template>
  <div style="display: flex; gap: 1rem;">
    <button @click="onSignIn">
      Sign In
    </button>
    <button @click="onSignOut">
      Sign Out
    </button>
    <button @click="onCheck">
      Check
    </button>
    <button @click="onRelay">
      Relay
    </button>
  </div>
</template>
