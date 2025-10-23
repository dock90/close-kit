# CloseKit - Sales Pipeline CRM

A multi-tenant Sales Pipeline CRM specifically designed for freelancers and agencies tracking client acquisition. The app helps users manage outreach campaigns, track deals through stages, monitor revenue goals, and stay accountable with weekly reporting.

## Features

-   **Multi-tenant Architecture**: Organizations can have multiple users with different roles
-   **Sales Pipeline Management**: Track deals through customizable stages (Lead → Contacted → Discovery → Proposal → Negotiation → Closed Won/Lost)
-   **Company & Contact Management**: Organize prospects with detailed company and contact information
-   **Activity Tracking**: Log and monitor sales activities (emails, calls, meetings, proposals)
-   **Revenue Goals**: Set and track progress toward revenue targets
-   **Weekly Reporting**: Accountability system with weekly progress reports
-   **Dashboard Analytics**: Real-time insights into pipeline performance

## Tech Stack

-   **Frontend**: Next.js 15 with App Router, React 19, TypeScript
-   **Styling**: Tailwind CSS with custom components
-   **Authentication**: Clerk with Google & GitHub OAuth
-   **Database**: PostgreSQL with Prisma ORM
-   **UI Components**: Custom components with Radix UI primitives
-   **State Management**: Zustand for client-side state

## Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn
-   PostgreSQL database
-   Clerk account for authentication (supports Google & GitHub OAuth)

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd close-kit
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    ```bash
    cp env.example .env.local
    ```

    Update `.env.local` with your credentials:

    ```env
    DATABASE_URL_POSTGRES="postgresql://user:password@host:port/database"
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...
    CLERK_WEBHOOK_SECRET=whsec_...
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
    ```

    See `CLERK_SETUP.md` for detailed authentication setup instructions.

4. **Set up the database**

    ```bash
    npm run db:generate
    npm run db:push
    ```

5. **Start the development server**

    ```bash
    npm run dev
    ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following main entities:

-   **Organizations**: Multi-tenant organizations
-   **Users**: Organization members with roles
-   **Companies**: Prospect companies
-   **Contacts**: Individual contacts at companies
-   **Deals**: Sales opportunities with stages and values
-   **Activities**: Sales activities and touchpoints
-   **Revenue Goals**: Revenue targets and progress tracking
-   **Weekly Reports**: Accountability and progress reports

## API Routes

The application provides RESTful API endpoints for all entities:

-   `/api/organizations` - Organization management
-   `/api/organizations/invites` - Team invitation system
-   `/api/organizations/members/[id]` - Team member management
-   `/api/webhooks/clerk` - User synchronization webhook
-   `/api/companies` - Company CRUD operations
-   `/api/contacts` - Contact management
-   `/api/deals` - Deal pipeline management
-   `/api/activities` - Activity tracking
-   `/api/revenue-goals` - Revenue goal management
-   `/api/weekly-reports` - Weekly reporting

All endpoints enforce organization-level data isolation. See `API_EXAMPLES.md` for usage examples.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (sign-in, sign-up)
│   ├── dashboard/         # Protected dashboard pages
│   │   └── settings/      # Settings and team management
│   ├── api/               # API routes
│   │   ├── webhooks/      # Webhook endpoints (Clerk sync)
│   │   ├── organizations/ # Org and team management
│   │   └── [resources]/   # Data management APIs
│   └── onboarding/        # New user onboarding flow
├── components/            # Reusable UI components
│   ├── settings/          # Settings-related components
│   └── ui/                # Base UI components
├── lib/                   # Utility functions and configurations
│   ├── auth.ts            # Authentication helpers
│   └── prisma.ts          # Database client
├── prisma/                # Database schema and migrations
├── middleware.ts          # Route protection and auth
└── [docs].md              # Documentation files
```

## Key Features Implementation

### Authentication & Multi-tenancy

-   **Social Authentication**: Google and GitHub OAuth via Clerk
-   **Email/Password**: Traditional authentication also supported
-   **Organization Isolation**: All data filtered by organizationId
-   **Role-Based Access**: Admin and member roles with different permissions
-   **Team Invitations**: Admins can invite team members via email
-   **Webhook Sync**: User data automatically synced from Clerk to database

See `AUTHENTICATION_IMPLEMENTATION.md` for technical details.

### Sales Pipeline

-   Kanban-style deal board with customizable stages
-   Deal values, probabilities, and close dates
-   Activity tracking linked to deals

### Weekly Reporting

-   Automated weekly report generation
-   Activity metrics tracking
-   Revenue progress monitoring
-   Roadblocks and challenges documentation

## Development

### Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Create and run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio
```

### Adding New Features

1. Update the Prisma schema in `prisma/schema.prisma`
2. Run `npm run db:push` to update the database
3. Create API routes in `app/api/`
4. Add pages and components as needed

## Documentation

-   **CLERK_SETUP.md**: Step-by-step guide to configure Clerk authentication with Google and GitHub OAuth
-   **AUTHENTICATION_IMPLEMENTATION.md**: Technical implementation details of authentication and multi-tenancy
-   **API_EXAMPLES.md**: API usage examples, testing guides, and helper function documentation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (especially authentication and data isolation)
5. Submit a pull request

## License

This project is licensed under the MIT License.
