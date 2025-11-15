# ovalife-node

Express boilerplate created in the `ovalife-node` folder (root of workspace).

How to run:

```bash
cd "C:\\Users\\adeel\\Documents\\MrRetailer\\ovalife-node"
npm install
npm run dev   # requires nodemon (dev)
# or
npm start
```

## API Endpoints

### Health Check

- GET / -> health
- GET /api/hello -> sample API

### Authentication

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile (Protected)

### Invitations

- POST /api/invitation/send (Protected) - Send multiple invitations
- GET /api/invitation/list (Protected) - Get all invitations with filters
- GET /api/invitation/stats (Protected) - Get invitation statistics
- GET /api/invitation/by/:id (Protected) - Get single invitation
- PATCH /api/invitation/:id/status (Protected) - Update invitation status
- POST /api/invitation/:id/resend (Protected) - Resend invitation
- DELETE /api/invitation/:id (Protected) - Delete invitation

### Escrows

- POST /api/escrow/create (Protected)
- PUT /api/escrow/:id (Protected)
- PATCH /api/escrow/:id/process-status (Protected)
- GET /api/escrow/list (Protected)

### Tasks

- POST /api/task/create (Protected)
- GET /api/task/list (Protected)

### Users

- GET /api/user/list (Protected)
