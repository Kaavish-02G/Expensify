# Expensify - Personal Expense Tracker

A modern, full-stack expense tracking application built with Next.js, MongoDB, and Tailwind CSS.

## Features

- 📊 **Expense Tracking**: Add, edit, and delete expenses with categories
- 💰 **Budget Management**: Set monthly budgets and track spending
- 📈 **Analytics Dashboard**: Visual charts showing expense breakdown by category
- 🔍 **Advanced Filtering**: Filter expenses by date range, category, and search terms
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Beautiful UI**: Modern gradient-based design with smooth animations

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Date Utilities**: date-fns

## Project Structure

```
Expensify/
├── app/
│   ├── api/              # API routes
│   │   ├── analytics/    # Analytics API
│   │   ├── budget/       # Budget API
│   │   └── expenses/     # Expenses CRUD API
│   ├── globals.css        # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/           # React components
│   ├── Analytics.tsx     # Analytics dashboard
│   ├── BudgetCard.tsx    # Budget tracking card
│   ├── ExpenseForm.tsx   # Add/edit expense form
│   ├── ExpenseList.tsx   # Expense list table
│   └── Filters.tsx       # Filtering controls
├── lib/
│   └── mongodb.ts        # MongoDB connection
├── models/               # Mongoose models
│   ├── Budget.ts
│   └── Expense.ts
├── types/
│   └── index.ts          # TypeScript type definitions
├── .env.local            # Environment variables
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Expensify
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with:
```env
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

The following environment variables are required:

- `MONGODB_URI`: Your MongoDB connection string (e.g., `mongodb://localhost:27017/expensify` or MongoDB Atlas connection string)

## Usage

### Adding an Expense
1. Fill out the expense form at the top of the page
2. Enter title, amount, category, and date
3. Click "Add Expense" to save

### Managing Budget
1. Click "Set Budget" in the Budget Overview card
2. Enter your monthly budget amount
3. Click "Save Budget" to track your spending

### Viewing Analytics
1. Navigate through months using the arrow buttons
2. View expense breakdown by category in the pie chart
3. Check monthly spending trends in the bar chart

### Filtering Expenses
1. Use the search box to find expenses by title
2. Select a category from the dropdown
3. Set date ranges to filter by specific periods
4. Click "Clear Filters" to reset all filters

## API Endpoints

### Expenses
- `GET /api/expenses` - Get all expenses (with optional filters)
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses/[id]` - Update an expense
- `DELETE /api/expenses/[id]` - Delete an expense

### Budget
- `GET /api/budget` - Get budget for a month
- `POST /api/budget` - Set/update budget for a month

### Analytics
- `GET /api/analytics?month=YYYY-MM` - Get analytics for a specific month

## Expense Categories

- 🍔 Food
- 🚗 Transport
- 🎬 Entertainment
- 🛍️ Shopping
- 💡 Bills
- 🏥 Healthcare
- 📦 Other

## Development

### Build for Production
```bash
npm run build
npm start
```

### Lint Code
```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

ISC License

## Author

Built with ❤️ using Next.js and MongoDB
