import { Web3Auth } from '@web3auth/modal'
import { AuthProviderBase } from '../AuthProviderBase'
import { ERROR } from './errors'
import type { Config } from './types'

class Web3AuthModal extends AuthProviderBase {
  authSdk?: Web3Auth
  provider?: any
  #config: Config

  constructor(config: Config) {
    super('Web3Auth')
    this.#config = config
  }

  async init(): Promise<void> {
    const { options, adapters, modalConfig } = this.#config // todo: plugins support?

    this.authSdk = new Web3Auth(options)
    adapters?.forEach(adapter => this.authSdk?.configureAdapter(adapter))

    await this.authSdk.initModal({ modalConfig })
  }

  async signIn(): Promise<void> {
    if (!this.authSdk)
      throw ERROR.notInitialized

    this.provider = await this.authSdk.connect()
  }

  async signOut(): Promise<void> {
    if (!this.authSdk)
      throw ERROR.notInitialized

    await this.authSdk.logout()
  }
}

export { Web3AuthModal }
export type { Config }
