# Clerk Authentication Setup Guide

This guide will help you configure Clerk authentication with Google and GitHub social providers for the CloseKit application.

## 1. Create a Clerk Account

1. Go to [clerk.com](https://clerk.com) and sign up for a free account
2. Create a new application in the Clerk dashboard

## 2. Configure Social Authentication

### Enable Google OAuth

1. In the Clerk dashboard, go to **User & Authentication** → **Social Connections**
2. Click on **Google**
3. Toggle **Enable** to turn on Google authentication
4. You can use Clerk's shared OAuth credentials for development, or configure your own:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback`
   - Copy the Client ID and Client Secret to Clerk

### Enable GitHub OAuth

1. In the Clerk dashboard, go to **User & Authentication** → **Social Connections**
2. Click on **GitHub**
3. Toggle **Enable** to turn on GitHub authentication
4. You can use Clerk's shared OAuth credentials for development, or configure your own:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click **New OAuth App**
   - Fill in the application details
   - Set the Authorization callback URL: `https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback`
   - Copy the Client ID and Client Secret to Clerk

## 3. Get Your API Keys

1. In the Clerk dashboard, go to **API Keys**
2. Copy your **Publishable Key** and **Secret Key**
3. Create a `.env.local` file in your project root with the following:

```env
# Database
DATABASE_URL_POSTGRES="your_postgres_connection_string"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

## 4. Configure Webhooks

Webhooks are used to sync user data from Clerk to your database.

1. In the Clerk dashboard, go to **Webhooks**
2. Click **Add Endpoint**
3. Enter your webhook URL: `https://your-domain.com/api/webhooks/clerk`
   - For local development, you can use a tool like [ngrok](https://ngrok.com/) or [Clerk's webhook forwarding](https://clerk.com/docs/webhooks/sync-data#local-development)
4. Select the following events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Click **Create**
6. Copy the **Signing Secret** and add it to your `.env.local` as `CLERK_WEBHOOK_SECRET`

## 5. Configure User Metadata

The application uses public metadata to store organization information for each user.

### Fields:
- `organizationId` - The ID of the organization the user belongs to
- `role` - The user's role in the organization (`admin` or `member`)

These fields are automatically set when:
- A user creates a new organization during onboarding
- A user accepts an invitation to join an existing organization

## 6. Test Your Setup

1. Start your development server: `npm run dev`
2. Navigate to `/sign-up`
3. Try signing up with Google or GitHub
4. You should be redirected to the onboarding page to create your organization
5. After creating an organization, you should be redirected to the dashboard

## 7. Invite Team Members

Admins can invite team members to their organization:

1. Send an invitation using the API:
```bash
POST /api/organizations/invites
{
  "email": "teammate@example.com",
  "role": "member"
}
```

2. The invited user will receive an email invitation from Clerk
3. When they sign up, their account will automatically be linked to your organization

## Multi-Tenancy Features

The application implements full multi-tenancy with:

- **Data Isolation**: All queries are filtered by `organizationId` to ensure users can only access their organization's data
- **Organization Management**: First user creates the organization, others join via invitation
- **Role-Based Access**: Admins can manage team members and send invitations
- **Middleware Protection**: All routes except public pages are protected by authentication

## Troubleshooting

### Webhook not working locally
- Use ngrok to expose your local server: `ngrok http 3000`
- Update the webhook URL in Clerk dashboard with the ngrok URL
- Make sure to copy the new webhook signing secret

### User not being synced to database
- Check that your webhook endpoint is receiving events
- Verify that `CLERK_WEBHOOK_SECRET` is set correctly
- Check the webhook logs in the Clerk dashboard

### Social login redirects to wrong page
- Verify the redirect URLs in your `.env.local` match your routes
- Make sure `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` is set to `/onboarding`
