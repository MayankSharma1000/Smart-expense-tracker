# Database

SmartMoney uses MongoDB with Mongoose for data persistence.

## Models

### User
Stores user account and profile information.

### Expense
Stores individual financial transactions and expense information.

### Budget
Stores budget configuration and monthly budget information.

### Savings
Stores savings goals and progress.

### Investment
Stores investment and portfolio information.

### RecurringExpense
Stores repeating financial obligations.

### Feedback
Stores application feedback.

## Data Access

Database operations are separated through repository modules for users, expenses, budgets, savings, investments, and recurring expenses.
