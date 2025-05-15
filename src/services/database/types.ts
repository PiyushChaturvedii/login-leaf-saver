
export interface DatabaseConfig {
  apiUrl: string;
  apiKey?: string;
}

export interface DbServiceHookResult {
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
}
