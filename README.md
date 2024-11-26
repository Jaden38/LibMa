# LibMa
Library management tool

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables:
Create a `.env` file in the root directory with the following structure:
```env
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_HOST=localhost
MYSQL_DATABASE=library_db
FLASK_DEBUG=1
```

For example:
```env
MYSQL_USER=root
MYSQL_PASSWORD=password123
MYSQL_HOST=localhost
MYSQL_DATABASE=library_db
FLASK_DEBUG=1
```

3. Initialize the database (optional - if you want to create fresh tables):
```bash
flask init-db
```

4. Run the application:
```bash
python run.py
```

## Development

The application will be available at `http://localhost:5000`

To check database status:
```bash
flask db-status
```

## Note
Make sure you have MySQL installed and running on your machine before starting the application.

## Environment Variables
- `MYSQL_USER`: MySQL username
- `MYSQL_PASSWORD`: MySQL password
- `MYSQL_HOST`: MySQL host address
- `MYSQL_DATABASE`: Database name
- `FLASK_DEBUG`: Debug mode (1 for development, 0 for production)