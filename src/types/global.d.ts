declare global {
  interface Window {
    // Add properties and methods you need
    gtag: (...args: any[]) => void;
  }
}

// Ensure this file is treated as a module
export {};
