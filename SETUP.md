# Gurtar Backend Setup Guide

## Overview
Gurtar is a Too Good To Go clone for Turkish Republic of North Cyprus. This is the backend API built with NestJS, TypeORM, and PostgreSQL.

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gurtar-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   Edit `.env` file with your database credentials and other configurations.

4. **Database Setup**
   - Create a PostgreSQL database named `gurtar`
   - Update the database credentials in `.env` file
   - The application will automatically create tables on first run (in development mode)

5. **Run the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

## Project Structure

```
src/
├── common/           # Shared utilities, decorators, guards, etc.
├── config/           # Configuration files
├── database/         # Database entities, migrations, seeds
├── features/         # Feature-based modules (auth, users, restaurants, etc.)
└── app.module.ts     # Main application module
```

## Features

- **TypeORM Integration**: Full database ORM with PostgreSQL
- **Configuration Management**: Environment-based configuration
- **JWT Authentication**: Secure token-based authentication
- **Swagger Documentation**: API documentation at `/docs`
- **GitGuardian**: Secret scanning in pre-commit hooks
- **Dependabot**: Automatic dependency updates

## Development

- **Database Migrations**: TypeORM will handle migrations automatically
- **Entity Creation**: Create entities in `src/database/entities/`
- **Feature Modules**: Add new features in `src/features/` directory
- **API Documentation**: Swagger UI available at `/docs` endpoint

## Security

- GitGuardian is configured to scan for secrets in pre-commit hooks
- JWT tokens for authentication
- Environment variables for sensitive configuration
- CORS protection enabled

## API Endpoints

- Base URL: `http://localhost:3000/api`
- Documentation: `http://localhost:3000/docs`
- Health Check: `http://localhost:3000/api/health`

## Contributing

1. Follow the feature-based folder structure
2. Use TypeORM decorators for database entities
3. Implement proper validation using class-validator
4. Write tests for new features
5. Follow NestJS best practices

## License

This project is private and proprietary.
