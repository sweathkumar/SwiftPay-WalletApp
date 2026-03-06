# SwiftPay - Money Wallet App

A full-featured React Native Expo wallet app for Android with iOS-inspired blue design.

## Project Structure

```
SwiftPay/
├── app/
│   ├── _layout.tsx          # Root layout with AppProvider + auth guard
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx         # Login / Sign Up screen
│   │   ├── otp.tsx           # OTP verification screen
│   │   ├── create-wallet.tsx # Wallet creation onboarding
│   │   └── set-pin.tsx       # 4-digit PIN setup (2-step confirm)
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Bottom tab bar with 5 tabs
│   │   ├── index.tsx         # Dashboard / Home
│   │   ├── send.tsx          # Send Money flow (contacts → amount → PIN → success)
│   │   ├── scan.tsx          # Scan & Pay
│   │   ├── history.tsx       # Transaction History with filters
│   │   └── profile.tsx       # Profile & Settings + Logout
│   └── (modals)/
│       ├── _layout.tsx
│       ├── add-money.tsx     # Add Money modal with numpad + payment methods
│       ├── receive.tsx       # Receive Money with QR code + Wallet ID
│       └── transaction-detail.tsx  # Full transaction details
├── components/
│   ├── Button.tsx            # Primary/secondary/ghost/danger variants
│   ├── Card.tsx              # Surface card with shadow
│   ├── Input.tsx             # Text input with icons, secure, error
│   ├── PinInput.tsx          # Full keypad PIN entry with dots
│   ├── TransactionItem.tsx   # Transaction list row component
│   └── index.ts
├── constants/
│   ├── Colors.ts             # iOS blue design system colors
│   ├── Theme.ts              # Typography, spacing, border radii
│   ├── AppContext.tsx        # Global state + mock data + actions
│   └── index.ts
└── models/
    └── index.ts              # TypeScript interfaces: User, Wallet, Transaction, etc.
```

## Setup & Run

```bash
npm install
npx expo start --android
```

## Features Implemented

✅ Login / Sign Up with phone number  
✅ OTP verification (6-digit, any code works in demo)  
✅ Google Auth button  
✅ Wallet creation onboarding  
✅ 4-digit PIN setup with confirm step  
✅ Dashboard with balance (show/hide)  
✅ Add Money with numpad + quick amounts + payment method selection  
✅ Send Money with contacts, numpad, PIN verification  
✅ Receive Money with QR code + wallet ID + share  
✅ Scan & Pay simulation  
✅ Transaction History with filters (All/Sent/Received/Added/Paid)  
✅ Transaction Detail view  
✅ Profile screen with settings menu  
✅ Logout with confirmation  
✅ Auth guard routing  

## Design System

- **Color**: iOS blue (#007AFF) solid color theme — no gradients
- **Typography**: System sans-serif font throughout  
- **Corners**: Rounded (8–24px) on all surfaces  
- **Icons**: Ionicons (no emojis)  
- **Layout**: Tab-based navigation with 5 tabs + modal overlays
