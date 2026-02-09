export const MOCK_GAME_DETAIL = {
  id: "mock-game-id-1",
  address: "0x1234567890123456789012345678901234567890",
  name: "Doge Racer",
  ticker: "DOGE",
  description:
    "The fastest doge in the universe. Race against AI and win big rewards!",
  coverImageUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Doge",
  creator: "0xCreatorAddress",
  marketCap: "1000000000000000000000",
  createdAt: Date.now() - 100000,
  user: {
    address: "0xUserAddress123",
    username: "DogeMaster",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DogeMaster",
  },
  stage: "inner", // inner or outer
  // Bonding curve specific
  reserve: "50000000000000000000", // 50 ETH
  maxSupply: "1000000000000000000000000",
  // Game code
  code: `
    // Simple game code mock
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'blue';
    ctx.fillRect(10, 10, 100, 100);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Hello Web3 Game!', 20, 60);
  `,
  createCodeStatus: 1, // 1: success, -1: failed
  nextProposalPassTime: Date.now() + 86400000,
};

export const MOCK_KLINE_DATA = (() => {
  const data: any[] = [];
  let currentPrice = 100;
  const now = Date.now();

  for (let i = 0; i < 100; i++) {
    const time = now - (100 - i) * 60000;
    // Small random walk: -1% to +1% change
    const changePercent = (Math.random() - 0.5) * 0.02;
    const open = currentPrice;
    const close = open * (1 + changePercent);

    // High and Low are slightly extended from Open/Close
    const high = Math.max(open, close) * (1 + Math.random() * 0.005);
    const low = Math.min(open, close) * (1 - Math.random() * 0.005);

    const volume = Math.floor(Math.random() * 1000 + 500); // 500-1500 volume

    data.push({
      t: time,
      o: Number(open.toFixed(2)),
      h: Number(high.toFixed(2)),
      l: Number(low.toFixed(2)),
      c: Number(close.toFixed(2)),
      v: volume,
    });

    currentPrice = close;
  }
  return data;
})();

export const MOCK_COMMENTS = [
  {
    id: "c1",
    content: "This game is going to the moon! 🚀",
    username: "MoonBoy",
    address: "0xUserA",
    createdAt: Date.now() - 3600000,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MoonBoy",
  },
  {
    id: "c2",
    content: "Dev is based. Bonding curve looking healthy.",
    username: "DeFiChad",
    address: "0xUserB",
    createdAt: Date.now() - 1800000,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DeFiChad",
  },
  {
    id: "c3",
    content: "When exchange listing?",
    username: "WenLambo",
    address: "0xUserC",
    createdAt: Date.now() - 900000,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=WenLambo",
  },
];

export const MOCK_PROPOSALS = [
  {
    id: "p1",
    name: "Increase Game Speed",
    description: "Make the doge run 2x faster to make gameplay more exciting.",
    createdAt: Date.now() - 86400000,
    proposalStatus: 0, // 0: ongoing, 1: approved, -1: rejected/failed
    voteCount: 150,
    isVoted: 0,
    user: {
      address: "0xProposerA",
      username: "SpeedDemon",
    },
    code: "// Updated code snippet...",
  },
  {
    id: "p2",
    name: "Add Double Jump",
    description: "Allow players to double jump to reach higher platforms.",
    createdAt: Date.now() - 172800000,
    proposalStatus: 1,
    voteCount: 500,
    isVoted: 1,
    user: {
      address: "0xProposerB",
      username: "Jumper",
    },
    code: "// Updated code snippet...",
  },
];

export const MOCK_BONDING_CURVE = {
  progress: 65, // 65%
  reserve: "65000000000000000000", // 65 ETH
  target: "100000000000000000000", // 100 ETH target
};

export const MOCK_HOLDERS = [
  {
    ownerAddress: "0xBondingCurveAddress",
    percentage: 80,
    bondingCurve: 1,
  },
  {
    ownerAddress: "0xCreatorAddress",
    percentage: 5,
    dev: 1,
  },
  {
    ownerAddress: "0xHolder1",
    percentage: 3,
  },
  {
    ownerAddress: "0xHolder2",
    percentage: 2,
  },
  {
    ownerAddress: "0xHolder3",
    percentage: 1,
  },
  {
    ownerAddress: "0xHolder4",
    percentage: 9, // Others
  },
];
