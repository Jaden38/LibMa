# LibMa
Library management tool

## Project Structure
```
/
├── frontend/     # Next.js frontend application
└── backend/      # Flask backend application
```

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install backend dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
Create a `.env` file in the backend directory with the following structure:
```env
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_HOST=localhost
MYSQL_DATABASE=library_db
MYSQL_PORT=3306
FLASK_DEBUG=1
FLASK_PORT=5000
```

For example:
```env
MYSQL_USER=root
MYSQL_PASSWORD=password123
MYSQL_HOST=localhost
MYSQL_DATABASE=library_db
MYSQL_PORT=3306
FLASK_DEBUG=1
FLASK_PORT=5000
```

4. Initialize the database (optional - if you want to create fresh tables):
```bash
flask init-db
```

5. Run the backend application:
```bash
python run.py
```

The backend API will be available at `http://localhost:5000`

To check database status:
```bash
flask db-status
```

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:3000`

## Development

To work on the full application, you'll need to run both the frontend and backend servers:

1. Terminal 1 - Backend:
```bash
cd backend
python run.py
```

2. Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## Requirements

### Backend
- Python 3.8+
- MySQL installed and running
- Required Python packages listed in `backend/requirements.txt`

### Frontend
- Node.js 18+
- npm or yarn
- Required npm packages listed in `frontend/package.json`

## Environment Variables

### Backend Variables
- `MYSQL_USER`: MySQL username
- `MYSQL_PASSWORD`: MySQL password
- `MYSQL_HOST`: MySQL host address
- `MYSQL_PORT`: MySQL port (default: 3306)
- `MYSQL_DATABASE`: Database name
- `FLASK_DEBUG`: Debug mode (1 for development, 0 for production)
- `FLASK_PORT`: Port for Flask application (default: 5000)

## Note
Make sure you have MySQL installed and running on your machine before starting the backend application.