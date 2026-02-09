export const MOCK_GAMES = [
  {
    gameId: "1",
    address: "0x1234567890123456789012345678901234567890",
    name: "Doge Racer",
    ticker: "DOGE",
    description:
      "The fastest doge in the universe. Race against AI and win big rewards!",
    coverImageUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Doge",
    user: {
      address: "0xUserAddress123",
    },
    createdAt: Date.now() - 100000,
    marketCap: "1000000000000000000000", // 1000 ETH wei roughly
    plays: 1250,
    stage: "inner", // or "outer"
  },
  {
    gameId: "2",
    address: "0xAbCdEf1234567890AbCdEf1234567890AbCdEf12",
    name: "Pepe Kombat",
    ticker: "PEPE",
    description:
      "Meme fighting game. Choose your fighter and dominate the arena.",
    coverImageUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Pepe",
    user: {
      address: "0xAnotherUser456",
    },
    createdAt: Date.now() - 500000,
    marketCap: "500000000000000000000",
    plays: 890,
    stage: "inner",
  },
  {
    gameId: "3",
    address: "0x9876543210987654321098765432109876543210",
    name: "Shiba Galaxy",
    ticker: "SHIB",
    description:
      "Explore the galaxy with Shiba Inu. Conquer planets and build your empire.",
    coverImageUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Shiba",
    user: {
      address: "0xWhale789",
    },
    createdAt: Date.now() - 1000000,
    marketCap: "2000000000000000000000",
    plays: 3400,
    stage: "inner",
  },
  {
    gameId: "4",
    address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    name: "Floki Adventure",
    ticker: "FLOKI",
    description: "A viking journey. Raid, trade, and become the king of memes.",
    coverImageUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Floki",
    user: {
      address: "0xViking999",
    },
    createdAt: Date.now() - 2000000,
    marketCap: "750000000000000000000",
    plays: 560,
    stage: "inner",
  },
];

export const MOCK_ALMOST_GAME = {
  ...MOCK_GAMES[0],
  name: "Almost Graduated Game",
  description: "This game is about to hit the bonding curve cap! Buy now!",
};
