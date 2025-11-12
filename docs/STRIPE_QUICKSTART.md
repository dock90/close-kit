# Stripe Integration - Quick Start

## What Was Implemented

✅ Stripe payment integration with hosted checkout
✅ Subscription management via webhooks
✅ Success notification when returning from Stripe
✅ Automatic subscription status updates

## Setup Steps (5 minutes)

### 1. Add Environment Variables

Add these to your `.env.local` file:

```bash
# Get from https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Your app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Get Your Stripe Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **test mode** keys (they start with `pk_test_` and `sk_test_`)
3. Paste them into your `.env.local`

### 3. Set Up Webhooks (Local Development)

**Option A: Stripe CLI (Recommended)**

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to your local server
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret (starts with `whsec_`) and add it to `.env.local`

**Option B: Skip for now**

You can test checkout without webhooks, but subscriptions won't be activated automatically.

### 4. Test It Out

```bash
npm run dev
```

1. Go to `/upgrade`
2. Click "Subscribe Now"
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. You'll be redirected back with a success message!

## Test Cards

-   **Success**: `4242 4242 4242 4242`
-   **Decline**: `4000 0000 0000 0002`
-   Use any future expiry, any CVC, any ZIP

## Production Setup

Before going live:

1. Switch to **Live mode** in Stripe Dashboard
2. Get your live keys (`pk_live_` and `sk_live_`)
3. Set up webhook endpoint: `https://yourapp.com/api/webhooks/stripe`
4. Update environment variables in your hosting platform
5. Set `NEXT_PUBLIC_APP_URL` to your production URL

## Files Created

-   `/app/api/checkout/route.ts` - Creates Stripe checkout session
-   `/app/api/webhooks/stripe/route.ts` - Handles subscription events
-   `/app/upgrade/UpgradePageClient.tsx` - Upgrade page with working button
-   `/components/SubscriptionSuccessHandler.tsx` - Success notification
-   `/components/ui/toast.tsx` - Toast notification component

## Pricing

Currently set to **$29/month**. To change:

Edit `app/api/checkout/route.ts`:

```typescript
unit_amount: 2900, // Amount in cents
```

## Need Help?

See the full guide: `/docs/stripe-setup.md`

## Webhook Events Handled

-   `checkout.session.completed` - Activates subscription
-   `customer.subscription.updated` - Updates subscription status
-   `customer.subscription.deleted` - Marks as expired
-   `invoice.payment_failed` - Marks as expired
