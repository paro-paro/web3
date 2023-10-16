# web3-auth

### `@paro-paro/web3-auth`

Based on the [Safe Auth Kit](https://docs.safe.global/safe-core-aa-sdk/auth-kit) but developed with a different purpose.

The main reason for creating this package was to decouple the Authentication Logic from the Account Abstraction Logic provided by Safe. The Safe Auth Kit currently merges boths.

In hopes I could release a public version (1.x) of the package, it will allow interface/frontend developers to integrate any authentication provider of their choosing (both web2/web3 providers) by providing a common interface for all of them.

Authentication Providers available:
* [Web3AuthModal](https://web3auth.io/docs/sdk/pnp/web/modal/)
