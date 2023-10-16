/**
 * Common interface for all authentication providers.
 * Check each provider's documentation to get more details.
 */
export abstract class AuthProviderBase {
  authenticationProvider: string

  constructor(authProvider: string) {
    this.authenticationProvider = authProvider
  }

  /**
   * Initialize the provider
   * @param options The provider specific options
   */
  abstract init(options?: unknown): Promise<void>

  /**
   * Start the provider sign in flow
   */
  abstract signIn(): Promise<void>

  /**
   * Start the provider sign out flow
   */
  abstract signOut(): Promise<void>
}
