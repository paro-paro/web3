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

  /**
   * Get info from the authenticated user
   * @returns The user info from the provider as JSON object
   */
  abstract getUserInfo(): Promise<unknown>

  /**
   * Subscribe to an event
   * @param event The event to subscribe to
   * @param handler The handler to be called when the event is triggered
   */
  abstract subscribe(event: unknown, handler: unknown): void

  /**
   * Unsubscribe from an event
   * @param event The event to unsubscribe from
   * @param handler The handler to be removed from the event
   */
  abstract unsubscribe(event: unknown, handler: unknown): void
}
