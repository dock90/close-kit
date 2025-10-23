# CloseKit API Examples

This document provides examples of how to use the authentication and multi-tenancy APIs.

## Authentication

All API requests require authentication via Clerk. The middleware automatically handles this.

## Team Management APIs

### 1. Send an Invitation

Send an email invitation to a new team member.

**Endpoint**: `POST /api/organizations/invites`

**Permissions**: Admin only

**Request**:
```json
{
  "email": "newmember@example.com",
  "role": "member"
}
```

**Response**:
```json
{
  "success": true,
  "invitation": {
    "id": "inv_123",
    "emailAddress": "newmember@example.com",
    "status": "pending",
    "publicMetadata": {
      "organizationId": "org_123",
      "role": "member"
    }
  }
}
```

**Example using fetch**:
```javascript
const response = await fetch('/api/organizations/invites', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'colleague@example.com',
    role: 'member', // or 'admin'
  }),
});

const data = await response.json();
console.log(data);
```

### 2. List Team Members

Get all team members in the organization.

**Endpoint**: `GET /api/organizations/invites`

**Permissions**: Admin only

**Response**:
```json
[
  {
    "id": "user_1",
    "email": "admin@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  {
    "id": "user_2",
    "email": "member@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "member",
    "createdAt": "2024-01-02T00:00:00Z"
  }
]
```

### 3. Update Member Role

Change a team member's role.

**Endpoint**: `PATCH /api/organizations/members/[id]`

**Permissions**: Admin only

**Request**:
```json
{
  "role": "admin"
}
```

**Response**:
```json
{
  "id": "user_2",
  "email": "member@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "admin",
  "organizationId": "org_123",
  "createdAt": "2024-01-02T00:00:00Z",
  "updatedAt": "2024-01-03T00:00:00Z"
}
```

### 4. Remove Team Member

Remove a member from the organization.

**Endpoint**: `DELETE /api/organizations/members/[id]`

**Permissions**: Admin only

**Response**:
```json
{
  "success": true
}
```

**Note**: You cannot remove yourself.

## User Management

### Get Current User

**Endpoint**: `GET /api/users/me`

**Response**:
```json
{
  "id": "user_1",
  "clerkId": "clerk_user_123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "admin",
  "organizationId": "org_123",
  "organization": {
    "id": "org_123",
    "name": "Acme Inc",
    "slug": "acme-inc",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## Organization Management

### Create Organization (During Onboarding)

**Endpoint**: `POST /api/organizations`

**Request**:
```json
{
  "name": "Acme Inc",
  "slug": "acme-inc"
}
```

**Response**:
```json
{
  "id": "org_123",
  "name": "Acme Inc",
  "slug": "acme-inc",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Note**: This endpoint automatically:
1. Creates the organization
2. Creates a user record linked to the organization
3. Updates the user's Clerk metadata with organizationId and role

## Data Isolation Examples

All data endpoints automatically filter by the user's organizationId.

### Get Companies

**Endpoint**: `GET /api/companies`

This returns only companies belonging to your organization.

### Create Deal

**Endpoint**: `POST /api/deals`

**Request**:
```json
{
  "name": "New Enterprise Deal",
  "value": 5000000,
  "stage": "discovery",
  "companyId": "company_123",
  "contactId": "contact_456"
}
```

The `organizationId` is automatically added to the deal.

## Helper Functions for API Routes

When building new API routes, use the helper functions from `lib/auth.ts`:

```typescript
import { requireAuth, getCurrentUserWithOrg, getOrganizationId } from '@/lib/auth';

// Example 1: Require authentication and get user
export async function GET(request: NextRequest) {
  const user = await requireAuth(); // Throws error if not authenticated
  const organizationId = user.organizationId;
  
  // Your logic here...
}

// Example 2: Just get organizationId
export async function POST(request: NextRequest) {
  const organizationId = await getOrganizationId(); // Throws if not authenticated
  
  // Your logic here...
}

// Example 3: Get full user with organization
export async function PATCH(request: NextRequest) {
  const user = await getCurrentUserWithOrg(); // Returns null if not authenticated
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Your logic here...
}
```

## Testing the Invite Flow

### Step 1: Admin Sends Invitation

```bash
curl -X POST http://localhost:3000/api/organizations/invites \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "role": "member"
  }'
```

### Step 2: New User Receives Email

The new user receives an invitation email from Clerk with a link to sign up.

### Step 3: New User Signs Up

When the new user clicks the link and signs up:
1. Clerk creates their account
2. Webhook triggers and creates user in database with organizationId from metadata
3. User is automatically part of the organization

### Step 4: New User Accesses Dashboard

The new user can immediately access the dashboard and see the organization's data.

## Error Responses

### Unauthorized (401)
```json
{
  "error": "Unauthorized"
}
```

### Forbidden (403)
```json
{
  "error": "Only admins can send invites"
}
```

### Not Found (404)
```json
{
  "error": "User not found"
}
```

### Bad Request (400)
```json
{
  "error": "Email is required"
}
```

### Internal Server Error (500)
```json
{
  "error": "Internal server error"
}
```

## Role-Based Access Control

| Action | Admin | Member |
|--------|-------|--------|
| View organization data | ✅ | ✅ |
| Create/update/delete data | ✅ | ✅ |
| Send invitations | ✅ | ❌ |
| View team members | ✅ | ❌ |
| Update member roles | ✅ | ❌ |
| Remove team members | ✅ | ❌ |

## Webhook Events

The webhook endpoint handles these Clerk events:

### user.created
- Creates user in database
- If invitation metadata exists, links to organization
- Otherwise, user goes through onboarding

### user.updated
- Updates user information in database

### user.deleted
- Removes user from database

## Security Best Practices

1. **Always filter by organizationId**: Never allow users to access data from other organizations
2. **Check roles**: Use role checks for admin-only actions
3. **Validate input**: Always validate and sanitize user input
4. **Use helper functions**: Leverage `lib/auth.ts` helpers for consistency
5. **Verify webhooks**: Always verify webhook signatures with Svix

## Example: Building a New Protected Route

```typescript
// app/api/my-resource/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth();
    
    // Query with organizationId filter
    const resources = await prisma.myResource.findMany({
      where: {
        organizationId: user.organizationId,
      },
    });
    
    return NextResponse.json(resources);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth();
    
    const data = await request.json();
    
    // Create with organizationId
    const resource = await prisma.myResource.create({
      data: {
        ...data,
        organizationId: user.organizationId,
      },
    });
    
    return NextResponse.json(resource);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```
