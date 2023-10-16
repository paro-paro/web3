import type { ModalConfig, Web3AuthOptions } from '@web3auth/modal'
import type { IAdapter } from '@web3auth/base'

interface Config {
  options: Web3AuthOptions
  adapters?: IAdapter<unknown>[]
  modalConfig?: Record<string, ModalConfig>
}

export type { Config }
