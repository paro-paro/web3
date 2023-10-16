export const ERROR = {
  notInitialized: new Error('Web3AuthModal is not initialized.'),
  userAlreadyConnected: new Error('User is already connected.'),
  userAlreadyDisconnected: new Error('User is already disconnected.'),
  noInfoForNonConnectedUser: new Error('Cannot fetch info for a non connected user.'),
  noIdTokenForNonConnectedUser: new Error('Cannot fetch id token for a non connected user.'),
}
