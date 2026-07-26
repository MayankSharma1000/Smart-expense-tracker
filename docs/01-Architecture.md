# SmartMoney Architecture

SmartMoney follows a full-stack client-server architecture.

## Client

The frontend is a React and Vite application. Pages communicate with backend APIs through dedicated service modules. Shared state such as authentication and theme configuration is managed through React Context.

## Server

The backend uses Node.js and Express. Routes delegate requests to controllers and services, while repositories provide database access.

## Architecture Flow

```text
React UI
   |
Service Layer
   |
REST API
   |
Express Routes
   |
Controllers
   |
Services / Analytics Engines
   |
Repositories
   |
Mongoose Models
   |
MongoDB
```

## Main Modules

- Authentication
- Dashboard
- Expenses
- Budgets
- Savings
- Investments
- Recurring expenses
- Analytics
- Financial reports
- Feedback and administration
