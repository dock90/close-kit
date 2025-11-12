# Stripe Integration Setup Guide

This guide will help you set up Stripe payment integration for CloseKit.

## 1. Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign in or create an account
3. Navigate to **Developers > API keys**
4. Copy your **Publishable key** and **Secret key**
    - For testing: Use the keys that start with `pk_test_` and `sk_test_`
    - For production: Toggle to "Live mode" and use `pk_live_` and `sk_live_` keys

## 2. Add Environment Variables

Add the following to your `.env.local` file (or create it if it doesn't exist):

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_your_actual_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note:** For production, use your production URL (e.g., `https://yourapp.com`)

## 3. Set Up Stripe Webhook

Stripe needs to notify your app when payments succeed or subscriptions change.

### For Local Development (using Stripe CLI):

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to Stripe CLI:
    ```bash
    stripe login
    ```
3. Forward webhooks to your local server:
    ```bash
    stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
    ```
4. Copy the webhook signing secret that appears (starts with `whsec_`) and add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

### For Production:

1. Go to [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourapp.com/api/webhooks/stripe`
4. Select these events to listen to:
    - `checkout.session.completed`
    - `customer.subscription.updated`
    - `customer.subscription.deleted`
    - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** and add it to your production environment variables as `STRIPE_WEBHOOK_SECRET`

## 4. Test the Integration

1. Start your development server:

    ```bash
    npm run dev
    ```

2. If testing locally, start the Stripe CLI webhook forwarding (in a separate terminal):

    ```bash
    stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
    ```

3. Navigate to `/upgrade` in your app
4. Click "Subscribe Now"
5. You'll be redirected to Stripe's hosted checkout page
6. Use a test card:

    - Card number: `4242 4242 4242 4242`
    - Expiry: Any future date
    - CVC: Any 3 digits
    - ZIP: Any 5 digits

7. Complete the payment
8. You'll be redirected back to your dashboard
9. The webhook should update your organization's subscription status to "active"

## 5. Verify Subscription Status

Check your database to confirm the organization's `subscriptionStatus` is now "active" and `subscriptionId` is populated.

## How It Works

1. **User clicks "Subscribe Now"** → App calls `/api/checkout` endpoint
2. **Checkout endpoint** → Creates a Stripe Checkout Session and returns the URL
3. **User is redirected** → To Stripe's hosted checkout page
4. **User completes payment** → Stripe processes the payment
5. **Stripe sends webhook** → To `/api/webhooks/stripe` with payment confirmation
6. **Webhook handler** → Updates organization's subscription status in database
7. **User is redirected back** → To dashboard with active subscription

## Pricing Configuration

The current setup charges **$29/month**. To change this:

Edit `app/api/checkout/route.ts` and modify the `unit_amount`:

```typescript
unit_amount: 2900, // Amount in cents ($29.00)
```

## Troubleshooting

### "No signature" error

-   Make sure your `STRIPE_WEBHOOK_SECRET` is correct
-   Verify the webhook is being sent to the correct endpoint

### Webhook not firing

-   Check Stripe CLI is running (for local dev)
-   Verify webhook endpoint is configured correctly in Stripe Dashboard (for production)
-   Check your server logs for any errors

### Payment succeeded but subscription not activated

-   Check webhook logs in Stripe Dashboard
-   Verify your webhook handler is processing the `checkout.session.completed` event
-   Check your database to see if the update was attempted

## Support

For more information:

-   [Stripe Documentation](https://stripe.com/docs)
-   [Stripe Testing Guide](https://stripe.com/docs/testing)
-   [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
