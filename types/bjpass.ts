// Types pour le widget BjPass
export interface BjPassUIConfig {
  showEnvSelector?: boolean
  container?: string
  language?: "fr" | "en"
  primaryColor?: string
  theme?: "default" | "dark" | "modern" | "minimal"
  backgroundColor?: string
  borderColor?: string
  textColor?: string
}

export interface BjPassBackendEndpoints {
  start?: string
  status?: string
  user?: string
  logout?: string
  refresh?: string
}

export interface BjPassConfig {
  // Configuration de base
  environment?: "test" | "production"
  clientId?: string
  authServer?: string
  scope?: string
  redirectUri?: string

  // Configuration OAuth
  pkce?: boolean
  verifyAccessToken?: boolean
  tokenVerificationScopes?: string[]

  // Configuration Backend
  beUrl?: string
  beBearer?: string
  header?: Record<string, string>
  backendUrl?: string
  backendEndpoints?: BjPassBackendEndpoints
  useBackend?: boolean

  // Configuration de sécurité
  frontendOrigin?: string
  backendOrigin?: string

  // Configuration UI
  ui?: BjPassUIConfig

  // Options de popup
  popupMode?: boolean
  autoClosePopup?: boolean

  // Options avancées
  analytics?: boolean
  debug?: boolean
  maxRetries?: number

  // Callbacks
  onSuccess?: (tokenData: any) => void
  onError?: (error: { error: string; error_description: string }) => void
  onLogout?: () => void
}

export interface TokenData {
  access_token?: string
  id_token?: string
  refresh_token?: string
  token_type?: string
  expires_in?: number
  scope?: string
}

export interface BjPassWidget {
  startAuthFlow(): Promise<void>
  getUserInfo(): Promise<any>
  logout(): Promise<void>
  refreshToken(): Promise<any>
  destroy(): void
  refresh(): void
  getConfig(): BjPassConfig
  updateConfig(config: Partial<BjPassConfig>): void
  use(name: string, plugin: any): BjPassWidget
  unuse(name: string): BjPassWidget
  addHook(hookName: string, callback: Function): BjPassWidget
}

export interface PresetConfig {
  name: string
  description: string
  config: Partial<BjPassConfig>
}

declare global {
  interface Window {
    BjPassAuthWidget: new (config?: BjPassConfig) => BjPassWidget
    BjPassWidgetFactory: {
      create(config?: BjPassConfig): BjPassWidget
      createWithTheme(theme: string, config?: BjPassConfig): BjPassWidget
    }
  }
}
