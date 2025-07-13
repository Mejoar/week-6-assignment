# MERN Bug Tracker

A full-stack bug tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- ✅ Create, view, update, and delete bug reports
- ✅ Responsive user interface with React
- ✅ RESTful API with Express.js
- ✅ MongoDB database integration
- ✅ Form validation and error handling
- ✅ Unit and integration testing
- ✅ End-to-end testing with Cypress
- ✅ Error boundaries for better user experience

## Tech Stack

### Frontend
- **React** 18.2.0 - UI library
- **React Router DOM** 6.14.2 - Client-side routing
- **Axios** 1.4.0 - HTTP client
- **React Query** 3.39.3 - Data fetching and caching
- **React Hook Form** 7.45.2 - Form management
- **React Error Boundary** 4.0.11 - Error handling

### Backend
- **Node.js** - Runtime environment
- **Express.js** 4.18.2 - Web framework
- **MongoDB** - Database
- **Mongoose** 7.3.2 - MongoDB object modeling

### Testing
- **Jest** - Unit testing framework
- **React Testing Library** - React component testing
- **Cypress** - End-to-end testing
- **Supertest** - HTTP testing
- **MongoDB Memory Server** - In-memory database for testing

## Project Structure

```
mern-bug-tracker/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   ├── tests/          # Unit tests
│   │   └── utils/          # Utility functions
│   ├── cypress/            # E2E tests
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── config/         # Configuration files
│   │   ├── utils/          # Utility functions
│   │   └── __tests__/      # Test files
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mejoar/week-6-assignment.git
   cd mern-bug-tracker
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   # or
   pnpm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   # or
   pnpm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bug-tracker
   NODE_ENV=development
   ```

5. **Start MongoDB**
   
   Make sure MongoDB is running on your system or set up a MongoDB Atlas connection.

### Running the Application

#### Development Mode

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:5000`

2. **Start the frontend client** (in a new terminal)
   ```bash
   cd client
   npm start
   ```
   Client will run on `http://localhost:3000`

#### Production Mode

1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Start the server**
   ```bash
   cd server
   npm start
   ```

## Testing

### Backend Tests
```bash
cd server
npm test                    # Run all tests
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run tests with coverage report
```

### Frontend Tests
```bash
cd client
npm test                    # Run unit tests
npm run test:coverage       # Run tests with coverage
npm run e2e                 # Run Cypress E2E tests (interactive)
npm run e2e:headless        # Run Cypress E2E tests (headless)
```

## API Endpoints

### Bug Routes

- `GET /api/bugs` - Get all bugs
- `POST /api/bugs` - Create a new bug
- `GET /api/bugs/:id` - Get a specific bug
- `PUT /api/bugs/:id` - Update a bug
- `DELETE /api/bugs/:id` - Delete a bug

### Bug Model

```javascript
{
  title: String (required),
  description: String (required),
  severity: String (enum: ['low', 'medium', 'high', 'critical']),
  status: String (enum: ['open', 'in-progress', 'resolved', 'closed']),
  assignedTo: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Happy Bug Tracking! 🐛**
