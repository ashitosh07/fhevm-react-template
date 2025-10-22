import { useEffect, useState, useCallback } from "react";
import { FhevmClient, FhevmClientConfig, FhevmClientState } from "../core/client.js";

export function useFhevmClient(config: FhevmClientConfig) {
  const [client] = useState(() => new FhevmClient(config));
  const [state, setState] = useState<FhevmClientState>(client.getState());

  useEffect(() => {
    const unsubscribe = client.subscribe(setState);
    return unsubscribe;
  }, [client]);

  const connect = useCallback(async () => {
    try {
      return await client.connect();
    } catch (error) {
      throw error;
    }
  }, [client]);

  const disconnect = useCallback(() => {
    client.disconnect();
  }, [client]);

  const refresh = useCallback(() => {
    client.disconnect();
    return connect();
  }, [client, connect]);

  return {
    ...state,
    client,
    connect,
    disconnect,
    refresh,
  };
}