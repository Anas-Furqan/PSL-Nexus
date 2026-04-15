# PSL NEXUS

PSL NEXUS is a premium Web3 cricket platform built for WireFluid Entangled 2026.

It combines:
- A cinematic Next.js frontend with immersive 3D stadium visuals.
- Wallet connectivity via Wagmi + RainbowKit.
- Smart-contract powered staking and NFT land ownership flows.
- A live rewards dashboard with GSAP-powered animated earnings.

## Competition Submission

- Competition: WireFluid Entangled 2026
- Team: Dettol Warriors
- Members: Anas Furqan, Anas Sheikh, Ali Adeel, Hammad Sheikh

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- Wagmi + Viem + RainbowKit
- @tanstack/react-query
- GSAP, Framer Motion
- Three.js via @react-three/fiber and @react-three/drei

## Network Configuration

- Network: WireFluid Testnet
- RPC URL: https://evm.wirefluid.com
- Chain ID: 92533
- Currency Symbol: WIRE
- Explorer: https://wirefluidscan.com/

## Project Structure

- `src/app/page.tsx`: landing page
- `src/app/dashboard/page.tsx`: dashboard page
- `src/app/layout.tsx`: global provider/layout shell
- `src/providers/Web3Provider.tsx`: Wagmi/RainbowKit setup
- `src/components/Web3Console.tsx`: staking, minting, rewards, ownership map
- `src/components/StadiumMetaverse.tsx`: main 3D stadium renderer
- `src/components/LandingStadiumPreview.tsx`: landing preview section
- `src/constants/addresses.ts`: deployed contract addresses
- `remix-ide-files/contracts/NexusEconomy.sol`: ERC20 + staking logic
- `remix-ide-files/contracts/NexusLand.sol`: ERC721 land NFTs

## Smart Contracts

### NexusEconomy
- Token standard: OpenZeppelin ERC20 + ERC20Permit
- Security: ReentrancyGuard + Ownable admin mint
- Staking with reward accrual and claim/withdraw support

### NexusLand
- Token standard: OpenZeppelin ERC721 + ERC721URIStorage
- Open mint for demo/judge accessibility

## Setup

1. Install dependencies.

```bash
npm install
```

2. Add environment variables.

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

3. Run development server.

```bash
npm run dev
```

4. Build production bundle.

```bash
npm run build
npm run start
```

## Contract Addresses

Current frontend contract addresses are stored in `src/constants/addresses.ts`.

If contracts are redeployed, update both entries:
- `CONTRACT_ADDRESSES.ECONOMY`
- `CONTRACT_ADDRESSES.LAND`

## Web3 UX Features

- Wallet connect/disconnect via RainbowKit
- Stake and withdraw with amount sanitization
- Open NFT plot mint flow
- Ownership map with highlighted zone coordinates
- Live earning ticker with high precision and smooth GSAP transitions
- Toast feedback for pending/success/failure/timeout states

## Security and Quality Notes

- No private keys or mnemonics are stored in frontend local storage.
- Token inputs are sanitized and decimals are capped.
- Displayed token values are normalized in Ether units using Viem formatters.
- Polling intervals are tuned to reduce RPC pressure.

## Scripts

- `npm run dev`: local development
- `npm run build`: production build
- `npm run start`: run production server
- `npm run lint`: lint codebase

## Troubleshooting

### Hydration warning on body attributes
This can be caused by browser extensions that inject attributes before hydration.
The app layout already uses hydration-safe handling for this scenario.

### Wallet shows wrong network
Switch wallet to WireFluid Testnet (Chain ID 92533).

### Rewards not updating
Confirm:
- wallet is connected
- user has staked amount
- contract addresses in `src/constants/addresses.ts` are current

## Repository

- GitHub: https://github.com/Anas-Furqan/PSL-Nexus
