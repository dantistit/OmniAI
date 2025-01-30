# OmniAI

A modern AI assistant platform with support for chat, document processing, image generation, and subscription management.

## 🏗 Project Structure

```
omniai/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── features/      # Feature-based modules
│   │   ├── shared/        # Shared components & types
│   │   ├── store/         # Redux store configuration
│   │   └── utils/         # Utility functions
│   └── ...
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Custom middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   └── prisma/            # Database schema & migrations
└── docker-compose.yml     # Container orchestration
```

## 🚀 Features

- Real-time chat with AI assistance
- Document processing and analysis
- Image generation with AI
- User authentication and authorization
- Subscription management
- Real-time updates via WebSocket
- Redis caching for improved performance
- Comprehensive API documentation

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Vite, Redux Toolkit
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis
- **Real-time**: Socket.IO
- **Testing**: Jest, React Testing Library
- **DevOps**: Docker, GitHub Actions

## 🏃‍♂️ Getting Started

### Without Docker

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start the frontend:
\`\`\`bash
npm run dev:client
\`\`\`

3. Start the backend:
\`\`\`bash
npm run dev:server
\`\`\`

### With Docker

Simply run:
\`\`\`bash
docker-compose up
\`\`\`

## 🔒 Environment Variables

Create \`.env\` files in both client and server directories:

### Client (.env)
\`\`\`
VITE_API_URL=http://localhost:3000
\`\`\`

### Server (.env)
\`\`\`
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/omniai
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
\`\`\`

## 📚 API Documentation

Available routes:

- **Authentication**
  - POST `/api/auth/register`
  - POST `/api/auth/login`
  - GET `/api/auth/profile`

- **Chat**
  - GET `/api/chat`
  - POST `/api/chat`
  - GET `/api/chat/:id`

- **Image Generation**
  - POST `/api/image`
  - GET `/api/image/history`

- **Documents**
  - POST `/api/docs`
  - GET `/api/docs`
  - GET `/api/docs/:id`

- **Subscription**
  - POST `/api/subscribe`
  - GET `/api/subscribe/status`

## 🧪 Testing

Run tests:

\`\`\`bash
# Frontend tests
cd client && npm test

# Backend tests
cd server && npm test
\`\`\`

## 📈 Monitoring

- Winston for server-side logging
- Sentry for error tracking
- Prometheus + Grafana for metrics

## 🔐 Security Features

- JWT authentication
- Role-based access control
- Rate limiting
- CORS protection
- Security headers with Helmet
- Password hashing with bcrypt

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request