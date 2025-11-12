# Trial System Documentation

## Overview

CloseKit implements a 14-day free trial system. Users can sign up and use the full platform for 14 days without entering a credit card. After the trial expires, they must subscribe to continue using the platform.

## How It Works

### 1. Trial Creation

When a new organization is created during onboarding:
- `trialEndsAt` is set to 14 days from the signup date
- `subscriptionStatus` is set to `"trial"`
- User gets full access to all features

### 2. During Trial

- A dismissible banner appears at the top of the dashboard showing days remaining
- Users have full access to all features
- The banner includes a link to the upgrade page

### 3. Trial Expiration

On day 15 (when trial expires):
- Users are automatically redirected to `/upgrade` when accessing the dashboard
- All dashboard routes are blocked
- The upgrade page shows:
  - Trial expired message
  - $29/month pricing
  - List of features included
  - "Subscribe Now" button (ready for payment integration)

## Database Schema

### Organization Model Fields

```prisma
trialEndsAt         DateTime?  // When the trial ends
subscriptionStatus  String     @default("trial") // "trial" | "active" | "expired"
subscriptionId      String?    // For future payment integration
```

### Subscription Status Values

- `trial` - Active trial period
- `active` - Paid subscription active
- `expired` - Trial ended, no active subscription

## Key Files

### Backend
- `/app/api/organizations/route.ts` - Sets trial dates on organization creation
- `/app/api/organizations/[id]/subscription/route.ts` - Updates subscription status
- `/prisma/schema.prisma` - Database schema with trial fields

### Frontend
- `/app/(dashboard)/layout.tsx` - Checks trial status and blocks access
- `/app/upgrade/page.tsx` - Upgrade/payment page
- `/components/trial-banner.tsx` - Trial countdown banner

### Scripts
- `/scripts/backfill-trial-dates.ts` - Backfills trial dates for existing orgs

## Testing Trial Expiration

To test the trial expiration flow:

1. **Via Database:**
   ```sql
   -- Set trial to expire yesterday
   UPDATE "Organization"
   SET "trialEndsAt" = NOW() - INTERVAL '1 day'
   WHERE "id" = 'your-org-id';
   ```

2. **Via Prisma Studio:**
   ```bash
   npx prisma studio
   ```
   Navigate to Organization table and modify the `trialEndsAt` field.

3. **Via API (Admin Only):**
   ```bash
   curl -X PATCH http://localhost:3000/api/organizations/[org-id]/subscription \
     -H "Content-Type: application/json" \
     -d '{"subscriptionStatus": "expired"}'
   ```

## Future Payment Integration

The system is ready for payment integration (Stripe, etc.):

1. Update the "Subscribe Now" button in `/app/upgrade/page.tsx` to trigger payment flow
2. After successful payment, call the subscription API:
   ```typescript
   await fetch(`/api/organizations/${orgId}/subscription`, {
     method: 'PATCH',
     body: JSON.stringify({
       subscriptionStatus: 'active',
       subscriptionId: 'stripe_subscription_id'
     })
   });
   ```
3. User will regain full access to the dashboard

## Migration Notes

Existing organizations have been backfilled with trial dates using:
```bash
npx tsx scripts/backfill-trial-dates.ts
```

This sets `trialEndsAt` to 14 days from the organization's `createdAt` date.

