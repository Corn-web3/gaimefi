// Set to false for production
export const isTest = true;
export const SCAN_URL = isTest
  ? "https://sepolia.etherscan.io"
  : "https://basescan.org";

// USDC address on Base chain
export const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

// Base Uniswap V2 Router address
export const SWAP_ROUTER_ADDRESS = isTest
  ? "0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3"
  : "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24";

// gaime entry address
export const GAME_ENTRY_ADDRESS = isTest
  ? "0xC1036d878BCdf37C4C5533d0161EDDD214d05B97"
  : "0x17Fa232e899626dC7A8d8E342cBF8F0A372d47Be";

//router
export const ROUTER_ADDRESS = isTest
  ? "0x4bbA50facd763123BBd0C5530BBdB1c29D173329"
  : "0xA7446bc41ad09C71cc5b1D9DA62733eB6D9887d9";

// gaime token address
export const GAME_TOKEN_ADDRESS = isTest
  ? "0x4b24252952f1fF3E105d23877CB177fbbefc66db"
  : "0x191364ade309d53af07ea7db6a809d43ba9eceaf";

export const TRADE_ADDRESS = isTest
  ? "0xd82ccf79a67e9d47464546ab3dbeae8eb6823942"
  : "0xd82ccf79a67e9d47464546ab3dbeae8eb6823942";
