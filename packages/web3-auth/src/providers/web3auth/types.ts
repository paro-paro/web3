import type { ModalConfig, Web3AuthOptions } from '@web3auth/modal'
import type { IAdapter, IProvider, UserAuthInfo, UserInfo } from '@web3auth/base'

type EventName = string | symbol
type EventHandler = (...args: unknown[]) => void

interface Config {
  options: Web3AuthOptions
  adapters?: IAdapter<unknown>[]
  modalConfig?: Record<string, ModalConfig>
}

export type {
  Config,
  EventName,
  EventHandler,
  IProvider,
  UserAuthInfo,
  UserInfo,
}
