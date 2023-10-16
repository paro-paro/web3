import type { Web3AuthOptions } from '@web3auth/modal'
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { Web3AuthModalPack } from '@safe-global/auth-kit'

export async function initAuth() {
  const options: Web3AuthOptions = {
    clientId: import.meta.env.VITE_CLIENT_ID,
    web3AuthNetwork: 'testnet',
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: '0x5',
      rpcTarget: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    },
    uiConfig: {
      theme: 'dark',
    },
  }

  const modalConfig = {
    [WALLET_ADAPTERS.TORUS_EVM]: {
      label: 'torus',
      showOnModal: false,
    },
    [WALLET_ADAPTERS.METAMASK]: {
      label: 'metamask',
      showOnDesktop: true,
      showOnMobile: false,
    },
    [WALLET_ADAPTERS.WALLET_CONNECT_V1]: {
      label: 'walletconnect-v1',
      showOnModal: false,
    },
    [WALLET_ADAPTERS.WALLET_CONNECT_V2]: {
      label: 'walletconnect-v2',
      showOnModal: false,
    },
  }

  const openloginAdapter = new OpenloginAdapter({
    loginSettings: {
      mfaLevel: 'optional',
    },
    adapterSettings: {
      uxMode: 'popup',
      whiteLabel: {
        name: 'Safe',
      },
    },
  })

  const auth = new Web3AuthModalPack({
    txServiceUrl: 'https://safe-transaction-goerli.safe.global',
  })

  await auth.init({
    options,
    adapters: [openloginAdapter],
    modalConfig,
  })

  return auth
}