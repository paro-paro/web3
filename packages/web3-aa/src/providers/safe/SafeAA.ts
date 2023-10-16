import Safe, { EthersAdapter, SafeFactory, predictSafeAddress } from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'
import { ERROR } from './errors'
import type {
  Config,
  InitOptions,
  MetaTransactionData,
  MetaTransactionOptions,
  RelayPack,
  SafeAccountConfig,
  Signer,
  SignerInfo,
  TransactionResponse,
} from './types'

class SafeAA {
  safeSdk?: Safe
  #signer?: Signer
  #signerInfo?: SignerInfo
  #ethAdapter?: EthersAdapter
  #relayPack?: RelayPack
  #safeApi?: SafeApiKit
  #config: Config

  constructor(config: Config) {
    this.#config = config
  }

  async init(options: InitOptions): Promise<void> {
    const { signer, relayPack } = options

    if (!signer.provider)
      throw ERROR.signerNoProvider

    this.#signer = signer
    this.#initEthAdapter(signer)
    this.#initRelayPack(relayPack)
    this.#initSafeApi()

    await this.#getSignerInfo() // signer === authenticated user
    await this.#createSafe()
  }

  #initEthAdapter(signer: Signer): void {
    const ethers = this.#config.ethereumLib
    this.#ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer })
  }

  #initRelayPack(relayPack: RelayPack): void {
    this.#relayPack = relayPack
  }

  #initSafeApi(): void {
    const ethAdapter = this.#ethAdapter
    if (!ethAdapter)
      throw ERROR.ethAdapterNotInitialized

    const { txServiceUrl } = this.#config.apiKit
    this.#safeApi = new SafeApiKit({ ethAdapter, txServiceUrl })
  }

  async #getSignerInfo(): Promise<void> {
    const eoa = await this.#getSignerAddress()
    const safes = await this.#getSignerSafes(eoa)
    this.#signerInfo = { eoa, safes }
  }

  async #getSignerAddress(): Promise<string> {
    const signer = this.#signer
    if (!signer)
      throw ERROR.signerNotInitialized

    const eoa = await signer.getAddress()
    return eoa
  }

  async #getSignerSafes(eoa: string): Promise<string[]> {
    const safeApi = this.#safeApi
    if (!safeApi)
      throw ERROR.safeApiNotInitialized

    const safesByOwner = await safeApi.getSafesByOwner(eoa)
    return safesByOwner.safes
  }

  async #createSafe(): Promise<void> {
    const ethAdapter = this.#ethAdapter
    if (!ethAdapter)
      throw ERROR.ethAdapterNotInitialized

    const safeAccountConfig = await this.#getSafeAccountConfig() // 1/1
    const predictedSafeAddress = await predictSafeAddress({ ethAdapter, safeAccountConfig })
    const isSafeDeployed = await ethAdapter.isContractDeployed(predictedSafeAddress)

    if (isSafeDeployed)
      this.safeSdk = await Safe.create({ ethAdapter, safeAddress: predictedSafeAddress })
    else
      this.safeSdk = await Safe.create({ ethAdapter, predictedSafe: { safeAccountConfig } })
  }

  async #getSafeAccountConfig(): Promise<SafeAccountConfig> {
    const eoa = await this.#getSignerAddress()
    const config: SafeAccountConfig = { owners: [eoa], threshold: 1 } // 1/1 safe config
    return config
  }

  async #getSafeFactory(ethAdapter: EthersAdapter): Promise<SafeFactory> {
    const safeFactory = await SafeFactory.create({ ethAdapter })
    return safeFactory
  }

  async getSafeAddress(): Promise<string> {
    const safeSdk = this.safeSdk
    if (!safeSdk)
      throw ERROR.safeSdkNotInitialized

    const res = await safeSdk.getAddress()
    return res
  }

  async isSafeDeployed(): Promise<boolean> {
    const safeSdk = this.safeSdk
    if (!safeSdk)
      throw ERROR.safeSdkNotInitialized

    const res = await safeSdk.isSafeDeployed()
    return res
  }

  async topUpSafe(amount: string): Promise<TransactionResponse> {
    const safeSdk = this.safeSdk
    const signer = this.#signer

    if (!safeSdk)
      throw ERROR.safeSdkNotInitialized

    if (!signer)
      throw ERROR.signerNotInitialized

    const ethers = this.#config.ethereumLib
    const value = ethers.utils.parseEther(amount).toHexString()
    const safeAddress = await safeSdk.getAddress()

    if (this.#config.verbose) {
      const eoa = await signer.getAddress()
      console.log(`Sending ${amount} ETH from EOA: ${eoa} to Safe: ${safeAddress}`)
    }

    const tx = await signer.sendTransaction({ to: safeAddress, value })
    return tx
  }

  async relayTransaction(transactions: MetaTransactionData[], options?: MetaTransactionOptions): Promise<string> {
    const safeSdk = this.safeSdk
    const relayPack = this.#relayPack

    if (!safeSdk)
      throw ERROR.safeSdkNotInitialized

    if (!relayPack)
      throw ERROR.relayPackNotInitialized

    if (this.#config.verbose)
      console.log('Executing relay transaction...')

    const relayedTransaction = await relayPack.createRelayedTransaction({
      safe: safeSdk,
      transactions,
      options,
    })

    const signedRelayedTransaction = await safeSdk.signTransaction(relayedTransaction)
    const res = await relayPack.executeRelayTransaction(signedRelayedTransaction, safeSdk)
    return res.taskId
  }

  async deploySafe(): Promise<void> {
    const safeSdk = this.safeSdk
    const ethAdapter = this.#ethAdapter

    if (!safeSdk)
      throw ERROR.safeSdkNotInitialized

    if (!ethAdapter)
      throw ERROR.ethAdapterNotInitialized

    const isSafeDeployed = await safeSdk.isSafeDeployed()
    if (isSafeDeployed)
      throw ERROR.safeAlreadyDeployed

    const safeFactory = await this.#getSafeFactory(ethAdapter)
    const safeAccountConfig = await this.#getSafeAccountConfig()
    const predictedSafeAddress = await safeFactory.predictSafeAddress(safeAccountConfig)

    if (this.#config.verbose) {
      console.log('Deploying Safe...')
      console.log('Safe predicted address:', predictedSafeAddress)
    }

    this.safeSdk = await safeFactory.deploySafe({ safeAccountConfig })
    await this.#getSignerInfo()

    if (this.#config.verbose)
      console.log(`Safe succesfully deployed.`)
  }

  get eoa(): string | undefined {
    return this.#signerInfo?.eoa
  }

  get safes(): string[] | undefined {
    return this.#signerInfo?.safes
  }

  get safeAddress(): string | undefined {
    const safes = this.safes
    return safes && safes.length > 0 ? safes[0] : undefined
  }

  get signer(): Signer | undefined {
    return this.#signer
  }

  get ethAdapter(): EthersAdapter | undefined {
    return this.#ethAdapter
  }

  get relayPack(): RelayPack | undefined {
    return this.#relayPack
  }

  get safeApi(): SafeApiKit | undefined {
    return this.#safeApi
  }

  get txServiceUrl(): string {
    return this.#config.apiKit.txServiceUrl
  }
}

export { SafeAA }
export type { Config, InitOptions }
