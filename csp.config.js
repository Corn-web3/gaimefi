// craco.config.js

const connectSrc = [
  "'self'",
  "https://*.privy.io",
  "https://*.walletconnect.org",
  "https://*.walletconnect.com",
  "wss://*.walletconnect.org",
  "https://*.infura.io",
  "https://*.ethereum.org",
  "https://mainnet.base.org",
  "https://metamask-sdk.api.cx.metamask.io",
  "https://api.gaime.fun",
  'wss://relay.walletconnect.com',
  'wss://relay.walletconnect.org',
  'wss://www.walletlink.org',
  'https://*.rpc.privy.systems',
  'wss://www.walletlink.org',
  'https://*.g.alchemy.com/',
  '*'
];

const childSrc = [
  "https://auth.privy.io",
  "https://verify.walletconnect.com",
  "https://verify.walletconnect.org",
];

const frameSrc = [
  "'self'",
  "https://*.privy.io",
  "https://*.walletconnect.org",
  "https://*.walletconnect.com",
  "https://challenges.cloudflare.com",
];

const imgSrc = [
  "*",
  "'self'",
  "https://*.privy.io",
  "https://api.gaime.fun",
  "data:",
  "blob:",
];

const scriptSrc = [
  "'self'",
  "'unsafe-eval'",
  "'unsafe-inline'",
  "https://*.privy.io",
  "https://challenges.cloudflare.com",
  '*',
];

const styleSrc = ["'self'", "'unsafe-inline'", "https://*.privy.io"];

const cspConfig = {
  development: {
    "default-src": ["'self'",'data:'],
    "child-src": [...childSrc],
    "connect-src": [...connectSrc, "ws://localhost:*", "http://localhost:*"],
    "frame-src": [...frameSrc],
    "img-src": [...imgSrc],
    "script-src": [...scriptSrc],
    "style-src": [...styleSrc],
  },
  production: {
    "default-src": ["'self'",'data:'],
    "child-src": [...childSrc],
    "connect-src": [...connectSrc, "https://www.gaime.fun/"],
    "frame-src": [...frameSrc],
    "img-src": [...imgSrc],
    "script-src": [...scriptSrc],
    "style-src": [...styleSrc],
  },
};

const generateCSPString = (config) => {
  return Object.entries(config)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ");
};

module.exports = {
  generateCSPString,
  cspConfig,
};
