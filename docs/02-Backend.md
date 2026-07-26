# Backend

SmartMoney uses Node.js and Express.js for its backend.

## Structure

- `server/routes` defines API routes.
- `server/controllers` handles HTTP requests and responses.
- `server/services` contains application logic.
- `server/repositories` handles persistence operations.
- `server/models` contains Mongoose schemas.
- `server/middleware` provides authentication, administration, and error handling.
- `server/analytics` contains financial analytics and insight engines.
- `server/utils` contains shared backend utilities.
- `server/tests` contains automated backend tests.

## Security

The backend uses JWT authentication, bcryptjs password hashing, Helmet, rate limiting, CORS configuration, and MongoDB sanitization.

## Analytics

Financial analytics modules provide reporting, financial scoring, goal analysis, predictions, risk analysis, chart generation, and financial insights.

## Testing

Backend tests use Jest, Supertest, and MongoDB Memory Server.
