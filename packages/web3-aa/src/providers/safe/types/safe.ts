import type { SafeAccountConfig } from '@safe-global/protocol-kit'
import type { RelayPack } from '@safe-global/relay-kit'
import type { MetaTransactionData, MetaTransactionOptions } from '@safe-global/safe-core-sdk-types'
import type { Ethers, Signer } from './ethers'

interface ApiKitConfig {
  txServiceUrl: string
}

interface Config {
  ethereumLib: Ethers
  apiKit: ApiKitConfig
  verbose?: boolean
}

interface InitOptions {
  signer: Signer
  relayPack: RelayPack
}

interface SignerInfo {
  eoa: string
  safes: string[]
}

export type {
  Config,
  InitOptions,
  SafeAccountConfig,
  RelayPack,
  MetaTransactionData,
  MetaTransactionOptions,
  SignerInfo,
}
