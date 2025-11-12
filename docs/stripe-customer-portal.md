# Stripe Customer Portal Setup

The Stripe Customer Portal allows your users to manage their subscriptions directly through Stripe's hosted interface.

## Features Available in the Portal

Users can:
- ✅ View subscription details
- ✅ Update payment methods
- ✅ View billing history and invoices
- ✅ Cancel their subscription
- ✅ Update billing email

## How It Works

When an admin clicks **"Manage Subscription"** in Settings → Billing:

1. App calls `/api/billing-portal` endpoint
2. Endpoint creates a Stripe Customer Portal session
3. User is redirected to Stripe's hosted portal
4. User manages their subscription
5. User clicks "Return to app" to come back to `/settings/billing`

## Setup Instructions

### 1. Enable Customer Portal in Stripe

1. Go to [Stripe Customer Portal Settings](https://dashboard.stripe.com/settings/billing/portal)
2. Click **Activate test link** (for test mode)
3. Configure portal settings:
   - ✅ **Allow customers to update payment methods**
   - ✅ **Allow customers to update billing details**
   - ✅ **Allow customers to view invoices**
   - ✅ **Allow customers to cancel subscriptions** (optional)

### 2. Configure Subscription Cancellation (Optional)

In the Customer Portal settings, under **Subscription cancellation**:

- **Immediately**: Cancel subscription right away (recommended for testing)
- **At period end**: Let them use until billing cycle ends (recommended for production)

You can also add a cancellation survey to understand why users are leaving.

### 3. Customize Branding (Optional)

Make it match your brand:
1. Go to [Branding Settings](https://dashboard.stripe.com/settings/branding)
2. Upload your logo
3. Choose your brand colors
4. Add custom CSS if needed

## Testing Locally

1. Make sure your Stripe CLI is running:
   ```bash
   stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
   ```

2. Start your dev server:
   ```bash
   npm run dev
   ```

3. Navigate to Settings → Billing
4. If you have an active subscription, click **"Manage Subscription"**
5. You'll be redirected to Stripe's Customer Portal

## Test Scenarios

### Update Payment Method
1. Click "Manage Subscription"
2. Click "Update payment method"
3. Add a new test card: `4242 4242 4242 4242`
4. Save changes

### Cancel Subscription
1. Click "Manage Subscription"
2. Click "Cancel subscription"
3. Confirm cancellation
4. Webhook will fire and update your database
5. Return to your app - status should be "expired"

## Production Setup

For production, repeat the setup in **Live mode**:

1. Switch to Live mode in Stripe Dashboard
2. Go to Customer Portal settings
3. Click **Activate live link**
4. Configure the same settings as test mode
5. Ensure your production webhooks are set up

## Database Schema

The `Organization` model stores:
- `subscriptionId` - Stripe subscription ID
- `stripeCustomerId` - Stripe customer ID (for portal access)
- `subscriptionStatus` - Current status (active, trial, expired)

## Webhook Events

The portal may trigger these webhooks (already handled):
- `customer.subscription.updated` - When user changes subscription
- `customer.subscription.deleted` - When user cancels
- `payment_method.attached` - When user adds/updates card

## Security

- ✅ Only admins can access the portal (checked in API route)
- ✅ Only users with active subscriptions can open portal
- ✅ Portal sessions expire after user leaves
- ✅ Return URL is configured to your app

## Customization

You can customize what features are available in the portal by modifying the API call in `/app/api/billing-portal/route.ts`:

```typescript
const session = await stripe.billingPortal.sessions.create({
  customer: subscription.customer as string,
  return_url: `${appUrl}/settings/billing`,
  // Optional: Restrict what users can do
  flow_data: {
    type: 'subscription_cancel',
    subscription_cancel: {
      subscription: subscriptionId,
    },
  },
});
```

## Troubleshooting

**"No customer found for subscription"**
- The customer ID wasn't saved during checkout
- Run a checkout again to populate it
- Or manually add it to your database

**Portal link doesn't work**
- Ensure Customer Portal is activated in Stripe Dashboard
- Check that user has an active subscription
- Verify webhooks are working

**User cancelled but status not updated**
- Check webhook is receiving events
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check server logs for webhook errors

## Support

For more information:
- [Stripe Customer Portal Docs](https://stripe.com/docs/billing/subscriptions/customer-portal)
- [Portal Configuration](https://dashboard.stripe.com/settings/billing/portal)

