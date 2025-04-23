# NeroWork

## Tagline

Clients pay fees, freelancers keep 100%, and grandma can use it—powered by **NERO’s** gasless magic.

## 🚀 Features

- Gasless withdrawals & Invoicing
- Token agnostic payments
- Reputation NFTs for freelancers
- Nero x Paymaster (AA integration)

## Core Problem & Solution

### Problem:

- Freelancers in Web3 face **gas fees when withdrawing earnings**, making micropayments impractical.
- Clients and freelancers might **use different tokens**, adding conversion friction.
- Traditional gig platforms (Upwork, Fiverr) charge **high fees (10–20%)** and tend to delay payouts

### Solution:

A **decentralized gig platform** where:

- Platform sponsors gas fees it via Paymaster.
- **Freelancers earn in their preferred token** (auto-converted via AA).
- **Zero gas withdrawals** for freelancers.

## How It Works

### Job Creation and Client Onboarding

- Client posts a job (e.g., "Build a website, $1,000") and **locks payment in escrow** (USDC/ETH/NERO).
- Platform estimates **gas cost** and adds it to the total or uses Paymaster to sponsor it.
- Freelancer sends invoice via `nerowork.com/invoice/123` and Client get Nero Tokens as credits to offset onboarding stress
- Tokens can be used in offsetting fees.
- Client sees: *"Use credits to post a job or pay next invoice gas-free!"*.
- Client pays any token → auto-converted.
- Paymaster sponsor gas for **first invoice per client**.

### Freelancer Onboarding

- Freelancer signs up with **AA wallet** (email/social login, no seed phrases).
- Reputation is tracked via **Soulbound NFTs** (e.g., "Verified Web3 Dev").

### Work & Milestones\*\*

- Smart contract releases **50% upfront**, **50% on delivery**.
- Disputes are voted on by a **DAO** (gasless votes via Paymaster).

### Payment

- Client pays invoice in **any token** (e.g., ETH → auto-converted to USDC via Paymaster).
- Freelancer withdraws **without paying gas** sponsored by platform.

Key NERO Chain Features Used\*\*

| **Feature**           | **How We Use It**                                                                 | **Why It Matters**                               |
| --------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Paymaster (AA)**    | Sponsors gas for withdrawals, disputes, and token conversions.                    | Eliminates crypto’s biggest UX hurdle: gas fees. |
| **Blockspace 2.0**    | Clients pay in any token (e.g., pay in NERO, freelancer gets USDC).               | No more "I only accept ETH."                     |
| **EVM Compatibility** | Integrates with existing DeFi (Sablier for streaming, Chainlink for USD pricing). | Leverages existing tools for faster development. |

### User Experience (Web2-Like Simplicity)

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

### For Clients:

1. Post job → pay with credit card/crypto.
2. Freelancer delivers → auto-payout (no gas fuss).
3. Discover Platform: Pay a freelancer’s invoice → **Auto-onboarded with AA wallet**.
4. Earn Credits: Get **NERO Tokens** for paying invoices → Use for future gigs
5. Post Jobs: Spend credits to offset fees (e.g., "Post a job for 10% less").

### For Freelancers:

1. Accept job → get paid in preferred coin.
2. Get Paid: Auto-convert payments to preferred token → **Gasless withdrawals**.
3. Send Invoices: Use `/invoice` links to bill clients outside the platform.
4. Earn Credits for successful projects

## Continuity and Long-Term Viability

### Premium Subscriptions (Freemium Model)

- **Free Tier**: Basic features (e.g., 5 gasless invoices/month).
- **Pro Tier ($10-20/month)**:
  - Unlimited gasless transactions.
  - Advanced analytics (e.g., invoice tracking, tax tools).
  - Priority dispute resolution.

### Fiat On-Ramp/Off-Ramp Fees

- Charge up to **3%** for crypto ↔ bank transfers (like MoonPay).
- Optional for users who want “cash out” convenience.

### Tokenomics & Ecosystem Fees

- **Transaction Fees**: Charge **5%** on payments off client budget .
  - Fee is **paid in $NERO tokens** (drives demand).
  - Discounts for users who stake/hold $NERO.

### Monetization Mix (Client-Focused)

| **Revenue Stream**         | **How It Works**                                   | **Target**              |
| -------------------------- | -------------------------------------------------- | ----------------------- |
| **Client Job Posting Fee** | Charge clients 5% of budget                        | Small businesses, DAOs. |
| **Token-Fueled Discounts** | Clients pay fees in **$NERO for 25% off**.         | Crypto-savvy users.     |
| **Premium Subscriptions**  | **$10/month** for unlimited gasless gigs/invoices. | Agencies, power users.  |
| **Fiat On-Ramp Fee**       | Charge **3%** for card/bank deposits.              | Web2 freelancers.       |
| **Off-Ramp Fee**           | Charge **3.5%** for instant bank withdrawals.      | Non-crypto users.       |

### Bank Recharges for Non-Tech Users

#### Virtual IBANs + Auto-Conversion

- Clients deposit via **bank transfer** (no crypto needed).
- Platform converts fiat to **stablecoins (USDC)** → used to pay freelancers.
- **Friendly flow**:
  1. Client posts job → enters credit card/bank details.
  2. Platform auto-converts 100 to USDC → freelancer gets 100 to USDC → freelancer gets 100 (gasless).
  3. Freelancer cashes out to bank (3.5% fee).

### Dollar Stability (No Volatility)

#### Auto-Convert to Stablecoins

- **For Clients**: Deposit $100 → instantly converted to **USDC** (no crypto risk).
- **For Freelancers**: Earnings held in **USDC by default** (can opt for other tokens).
- **For Token Rewards**: Distribute _NERO_ but show USD value(e.g., "You earned NERO∗∗ but show USD value like, "You earned $10 in NERO").

**Key**: Users **never hold volatile crypto** unless they choose to.

Creating a svelte project

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
