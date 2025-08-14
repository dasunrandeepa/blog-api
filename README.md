# Blog API

A robust, secure, and scalable REST API for blog management built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with refresh tokens
- **User Management**: Complete CRUD operations for users
- **Security**: Rate limiting, CORS protection, Helmet security headers
- **Validation**: Request validation using express-validator
- **Logging**: Winston-based logging system
- **Database**: MongoDB with Mongoose ODM
- **TypeScript**: Full TypeScript support with type definitions
- **Performance**: Response compression and optimized middleware

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **Logging**: Winston
- **Development**: Nodemon, Prettier

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB instance
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/blog-api
   JWT_ACCESS_SECRET=your_access_secret_here
   JWT_REFRESH_SECRET=your_refresh_secret_here
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d
   LOG_LEVEL=info
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000/api/v1`

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh-token` - Refresh access token

### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/me` - Get current user profile
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/me` - Update current user
- `DELETE /api/v1/users/me` - Delete current user

## 🔐 Authentication

The API uses JWT tokens for authentication:

- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for token renewal
- **Protected Routes**: Require valid access token in Authorization header

## 🏗️ Project Structure

```
src/
├── @types/          # TypeScript type definitions
├── config/          # Configuration files
├── controllers/     # Route controllers
├── lib/            # Core libraries (JWT, MongoDB, etc.)
├── middlewares/    # Express middlewares
├── models/         # Mongoose models
├── routes/         # API route definitions
├── server.ts       # Main server file
└── utils/          # Utility functions
```

## 🚀 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload

### Code Quality

- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting
- **ESLint**: Code linting (if configured)

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **CORS Protection**: Configurable origin whitelist
- **Security Headers**: Helmet middleware
- **Input Validation**: Request body validation
- **JWT Security**: Secure token handling

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |
| `MONGO_URI` | MongoDB connection string | - |
| `JWT_ACCESS_SECRET` | JWT access token secret | - |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | - |
| `ACCESS_TOKEN_EXPIRY` | Access token expiry time | 15m |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiry time | 7d |
| `LOG_LEVEL` | Logging level | info |

## 🤝 Contributing

This is an open source project. We welcome contributions!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues
2. Create a new issue with detailed information
3. Include error logs and reproduction steps

## 🔮 Roadmap

- [ ] Blog post CRUD operations
- [ ] Comment system
- [ ] File upload support
- [ ] Search functionality
- [ ] API documentation with Swagger
- [ ] Docker support
- [ ] Unit and integration tests

---

**Happy Coding! 🎉**
