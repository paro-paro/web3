import { Web3Auth } from '@web3auth/modal'
import { AuthProviderBase } from '../AuthProviderBase'
import { ERROR } from './errors'
import type {
  Config,
  EventHandler,
  EventName,
  IProvider,
  UserAuthInfo,
  UserInfo,
} from './types'

class Web3AuthModal extends AuthProviderBase {
  authSdk?: Web3Auth
  #config: Config

  constructor(config: Config) {
    super('Web3Auth')
    this.#config = config
  }

  /** START BASE */

  async init(): Promise<void> {
    const { options, adapters, modalConfig } = this.#config // todo: plugins support?

    this.authSdk = new Web3Auth(options)
    adapters?.forEach(adapter => this.authSdk?.configureAdapter(adapter))

    await this.authSdk.initModal({ modalConfig })
  }

  async signIn(): Promise<void> {
    if (!this.authSdk)
      throw ERROR.notInitialized

    if (this.authSdk && this.connected)
      throw ERROR.userAlreadyConnected

    await this.authSdk.connect()
  }

  async signOut(): Promise<void> {
    if (!this.authSdk)
      throw ERROR.notInitialized

    if (this.authSdk && !this.connected)
      throw ERROR.userAlreadyDisconnected

    await this.authSdk.logout()
  }

  async getUserInfo(): Promise<Partial<UserInfo>> {
    if (!this.authSdk)
      throw ERROR.notInitialized

    if (this.authSdk && !this.connected)
      throw ERROR.noInfoForNonConnectedUser

    const data = await this.authSdk.getUserInfo()
    return data
  }

  subscribe(event: EventName, handler: EventHandler): void {
    this.authSdk?.on(event, handler)
  }

  unsubscribe(event: EventName, handler: EventHandler): void {
    this.authSdk?.off(event, handler)
  }

  /** END BASE */

  async getIdToken(): Promise<UserAuthInfo> {
    if (!this.authSdk)
      throw ERROR.notInitialized

    if (this.authSdk && !this.connected)
      throw ERROR.noIdTokenForNonConnectedUser

    const data = await this.authSdk.authenticateUser()
    return data
  }

  get connected(): boolean {
    if (!this.authSdk)
      throw ERROR.notInitialized

    return this.authSdk.connected
  }

  get connectedAdapter(): string | null {
    if (!this.authSdk)
      throw ERROR.notInitialized

    return this.authSdk.connectedAdapterName
  }

  /**
   * @returns standard EIP-1193 provider
   */
  get provider(): IProvider | null {
    if (!this.authSdk)
      throw ERROR.notInitialized

    return this.authSdk.provider
  }

  get chainId(): string | undefined {
    if (!this.authSdk)
      throw ERROR.notInitialized

    return this.authSdk.provider?.chainId
  }
}

export { Web3AuthModal }
export type { Config }
