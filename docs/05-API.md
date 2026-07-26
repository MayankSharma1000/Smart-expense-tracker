# API

SmartMoney exposes REST APIs through Express route modules.

## API Groups

- Authentication: `authRoutes.js`
- Dashboard: `dashboardRoutes.js`
- Expenses: `expenseRoutes.js`
- Budgets: `budgetRoutes.js`
- Savings: `savingsRoutes.js`
- Investments: `investmentRoutes.js`
- Recurring Expenses: `recurringExpenseRoutes.js`
- AI and financial insights: `aiRoutes.js`
- Feedback: `feedbackRoutes.js`
- Administration: `adminRoutes.js`

## Authentication

Protected API operations use JWT-based authentication through the authentication middleware.

## Response Handling

Shared API response, async-handler, logging, and error-handling utilities are used by the backend.
