import type { Transaction, ethers } from 'ethers'

type Ethers = typeof ethers
type Signer = ethers.Signer

interface TransactionResponse extends Transaction {
  wait: () => Promise<any>
}

export type {
  Ethers,
  Signer,
  TransactionResponse,
}
