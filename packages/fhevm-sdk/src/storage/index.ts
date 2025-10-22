export * from "./GenericStringStorage";

// Convenience function to create in-memory storage
import { GenericStringInMemoryStorage } from "./GenericStringStorage";

export function createInMemoryStorage() {
  return new GenericStringInMemoryStorage();
}

