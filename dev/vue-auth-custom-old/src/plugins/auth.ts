import type { Config } from '@paro-paro/web3-auth-old'
import { Web3AuthModal } from '@paro-paro/web3-auth-old'
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base'

type ModalConfig = Config['modalConfig']
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID

export async function initAuth() {
  const modalConfig: ModalConfig = {
    [WALLET_ADAPTERS.TORUS_EVM]: {
      label: 'Torus',
      showOnModal: false,
    },
    [WALLET_ADAPTERS.WALLET_CONNECT_V1]: {
      label: 'WalletConnect v1',
      showOnModal: false,
    },
    [WALLET_ADAPTERS.METAMASK]: {
      label: 'Metamask',
      showOnDesktop: true,
      showOnMobile: false,
    },
    [WALLET_ADAPTERS.OPENLOGIN]: {
      label: 'Openlogin',
      showOnModal: true, // setting it to false will hide all social login methods from modal.
      loginMethods: {
        email_passwordless: {
          name: 'email_passwordless',
          showOnModal: true,
        },
        sms_passwordless: {
          name: 'sms_passwordless',
          showOnModal: false,
        },
        google: {
          name: 'google',
          showOnModal: true,
        },
        facebook: {
          name: 'facebook',
          showOnModal: false,
        },
        twitter: {
          name: 'twitter',
          showOnModal: false,
        },
        reddit: {
          name: 'reddit',
          showOnModal: false,
        },
        discord: {
          name: 'discord',
          showOnModal: false,
        },
        twitch: {
          name: 'twitch',
          showOnModal: false,
        },
        apple: {
          name: 'apple',
          showOnModal: false,
        },
        line: {
          name: 'line',
          showOnModal: false,
        },
        github: {
          name: 'github',
          showOnModal: false,
        },
        kakao: {
          name: 'kakao',
          showOnModal: false,
        },
        linkedin: {
          name: 'linkedin',
          showOnModal: false,
        },
        weibo: {
          name: 'weibo',
          showOnModal: false,
        },
        wechat: {
          name: 'wechat',
          showOnModal: false,
        },
      },
    },
  }

  const config: Config = {
    modalConfig,
    options: {
      clientId: CLIENT_ID,
      web3AuthNetwork: 'testnet',
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: '0x5',
        rpcTarget: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      },
      uiConfig: {
        theme: 'dark',
      },
    },
  }

  const auth = new Web3AuthModal(config)
  await auth.init()

  return auth
}
