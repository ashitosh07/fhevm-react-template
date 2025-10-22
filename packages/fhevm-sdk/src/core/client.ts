import { Eip1193Provider } from "ethers";
import { FhevmInstance } from "../fhevmTypes.js";
import { createFhevmInstance } from "../internal/fhevm.js";

export type FhevmClientConfig = {
  provider: Eip1193Provider | string;
  mockChains?: Record<number, string>;
  onStatusChange?: (status: string) => void;
};

export type FhevmClientState = {
  instance: FhevmInstance | null;
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: Error | null;
};

export class FhevmClient {
  private config: FhevmClientConfig;
  private state: FhevmClientState = {
    instance: null,
    status: 'idle',
    error: null,
  };
  private abortController: AbortController | null = null;
  private listeners: Set<(state: FhevmClientState) => void> = new Set();

  constructor(config: FhevmClientConfig) {
    this.config = config;
  }

  getState(): FhevmClientState {
    return { ...this.state };
  }

  subscribe(listener: (state: FhevmClientState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private setState(updates: Partial<FhevmClientState>) {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach(listener => listener(this.getState()));
  }

  async connect(): Promise<FhevmInstance> {
    if (this.state.status === 'loading') {
      throw new Error('Connection already in progress');
    }

    this.abortController?.abort();
    this.abortController = new AbortController();

    this.setState({ status: 'loading', error: null });

    try {
      const instance = await createFhevmInstance({
        provider: this.config.provider,
        mockChains: this.config.mockChains,
        signal: this.abortController.signal,
        onStatusChange: this.config.onStatusChange,
      });

      this.setState({ instance, status: 'ready', error: null });
      return instance;
    } catch (error) {
      const err = error as Error;
      this.setState({ instance: null, status: 'error', error: err });
      throw err;
    }
  }

  disconnect() {
    this.abortController?.abort();
    this.abortController = null;
    this.setState({ instance: null, status: 'idle', error: null });
  }

  getInstance(): FhevmInstance | null {
    return this.state.instance;
  }
}