export const ERROR = {
  safeSdkNotInitialized: new Error('Safe sdk not initialized.'),
  safeAlreadyDeployed: new Error('Safe already deployed.'),
  safeApiNotInitialized: new Error('Safe api not initialized.'),
  safeFactoryNotInitialized: new Error('Safe factory not initialized.'),
  ethAdapterNotInitialized: new Error('Ethereum adapter not initialized.'),
  relayPackNotInitialized: new Error('Relay pack not initialized.'),
  signerNotInitialized: new Error('Signer not initialized.'),
  signerNoProvider: new Error('Signer not connected to provider.'),
}
