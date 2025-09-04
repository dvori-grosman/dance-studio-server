# Dance Studio Backend API

Backend server for the Dance Studio management system - "ריקוד ברוח הטובה"

## Features

- **Authentication**: JWT-based admin authentication
- **Classes Management**: CRUD operations for dance classes
- **Teachers Management**: CRUD operations for teachers
- **Branches Management**: CRUD operations for studio branches
- **Schedule API**: Get classes organized by day/branch
- **Statistics**: Basic analytics for admin dashboard

## Tech Stack

- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **Helmet** - Security headers
- **Rate Limiting** - API protection

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### Classes
- `GET /api/classes` - Get all active classes (public)
- `GET /api/classes/schedule` - Get classes grouped by day (public)
- `GET /api/classes/admin` - Get all classes (admin only)
- `POST /api/classes` - Create new class (admin only)
- `PUT /api/classes/:id` - Update class (admin only)
- `DELETE /api/classes/:id` - Soft delete class (admin only)

### Teachers
- `GET /api/teachers` - Get all active teachers (public)
- `GET /api/teachers/admin` - Get all teachers (admin only)
- `POST /api/teachers` - Create new teacher (admin only)
- `PUT /api/teachers/:id` - Update teacher (admin only)
- `DELETE /api/teachers/:id` - Soft delete teacher (admin only)

### Branches
- `GET /api/branches` - Get all active branches (public)
- `GET /api/branches/admin` - Get all branches (admin only)
- `POST /api/branches` - Create new branch (admin only)
- `PUT /api/branches/:id` - Update branch (admin only)
- `DELETE /api/branches/:id` - Soft delete branch (admin only)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/dance-studio
JWT_SECRET=your-super-secret-jwt-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Data Models

### Class
```javascript
{
  day: String, // ראשון, שני, שלישי, etc.
  time: String, // HH:MM format
  branch: ObjectId, // Reference to Branch
  teacher: ObjectId, // Reference to Teacher
  description: String, // Class description
  level: String, // מתחילות, ממשיכות, מתקדמות, etc.
  maxStudents: Number,
  duration: Number, // in minutes
  isActive: Boolean
}
```

### Teacher
```javascript
{
  name: String,
  phone: String,
  email: String,
  specialties: [String], // Array of specialties
  isActive: Boolean
}
```

### Branch
```javascript
{
  name: String,
  address: String,
  phone: String,
  email: String,
  description: String,
  isActive: Boolean
}
```

## Security Features

- JWT authentication for admin routes
- Rate limiting (100 requests per 15 minutes)
- Helmet for security headers
- CORS configuration
- Input validation and sanitization
- Soft delete (data is never actually deleted)

## Deployment

See `cloud-deployment-guide.md` for detailed deployment instructions using:
- **MongoDB Atlas** (Database)
- **Render.com** (Backend hosting)
- **Netlify** (Frontend hosting)

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/dance-studio` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key` |
| `ADMIN_USERNAME` | Admin username | `admin` |
| `ADMIN_PASSWORD` | Admin password | `admin123` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |

## Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start
```

## License

Private project for "ריקוד ברוח הטובה" dance studio.
