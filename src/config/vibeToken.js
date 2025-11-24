export const VIBE_TOKEN_CONFIG = {
  address: process.env.NEXT_PUBLIC_VIBE_TOKEN_ADDRESS || '0x600326079c6563630f92275A4E88573D54308832', // Use the provided default or env
  abi: [
    {
      inputs: [{ name: 'account', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'decimals',
      outputs: [{ name: '', type: 'uint8' }],
      stateMutability: 'view',
      type: 'function',
    },
  ],
  decimals: 18,
  symbol: 'VIBE',
  name: 'VIBEOFFICIAL',
  minHolding: 100, // Minimum tokens required for access
};
