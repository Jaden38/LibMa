# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import pymysql
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os
import click

# Load environment variables
load_dotenv()

# Required for PyMySQL to work with SQLAlchemy
pymysql.install_as_MySQLdb()

# Create the flask app
app = Flask(__name__)
# Config options
app.config.from_object('config')

# Create database connection object
db = SQLAlchemy(app)

@app.cli.command()
def init_db():
    """Initialize the database using schema.sql and populate.sql"""
    try:
        # Connect to MySQL server (not database)
        conn = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST'),
            user=os.getenv('MYSQL_USER'),
            password=os.getenv('MYSQL_PASSWORD')
        )
        
        if conn.is_connected():
            cursor = conn.cursor()
            
            # Check if database exists
            cursor.execute("SHOW DATABASES")
            databases = [db[0] for db in cursor]
            db_name = os.getenv('MYSQL_DATABASE')
            
            if db_name in databases:
                # Database exists, ask for confirmation
                if not click.confirm(f'Database "{db_name}" already exists. Do you want to drop and recreate it? This will delete all existing data!', default=False):
                    print('Database initialization cancelled.')
                    return
                
                # User confirmed, proceed with drop
                print(f'Dropping database {db_name}...')
                cursor.execute(f"DROP DATABASE {db_name}")
            
            # Create fresh database
            print(f'Creating database {db_name}...')
            cursor.execute(f"CREATE DATABASE {db_name}")
            cursor.execute(f"USE {db_name}")
            
            # Execute schema.sql
            print('Applying schema...')
            try:
                with open('schema.sql', 'r', encoding='utf-8') as f:
                    schema_sql = f.read()
                    # Split into individual statements and execute
                    for statement in schema_sql.split(';'):
                        if statement.strip():
                            cursor.execute(statement)
                print('Schema applied successfully.')
            except FileNotFoundError:
                print('Warning: schema.sql not found')
            except mysql.connector.Error as e:
                print(f'Error applying schema: {e}')
                return
            
            # Execute populate.sql
            print('Populating database...')
            try:
                with open('populate.sql', 'r', encoding='utf-8') as f:
                    populate_sql = f.read()
                    # Split into individual statements and execute
                    for statement in populate_sql.split(';'):
                        if statement.strip():
                            cursor.execute(statement)
                print('Data populated successfully.')
            except FileNotFoundError:
                print('Warning: populate.sql not found')
            except mysql.connector.Error as e:
                print(f'Error populating database: {e}')
                return
            
            conn.commit()
            print('Database initialization completed successfully!')
            
    except Error as e:
        print(f"Error: {e}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

# Add a new command to check database status
@app.cli.command()
def db_status():
    """Check the status of the database"""
    try:
        conn = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST'),
            user=os.getenv('MYSQL_USER'),
            password=os.getenv('MYSQL_PASSWORD')
        )
        
        if conn.is_connected():
            cursor = conn.cursor()
            db_name = os.getenv('MYSQL_DATABASE')
            
            # Check if database exists
            cursor.execute("SHOW DATABASES")
            databases = [db[0] for db in cursor]
            
            if db_name in databases:
                print(f'Database "{db_name}" exists')
                
                # Get table information
                cursor.execute(f"USE {db_name}")
                cursor.execute("SHOW TABLES")
                tables = cursor.fetchall()
                
                if tables:
                    print("\nTables:")
                    for table in tables:
                        cursor.execute(f"SELECT COUNT(*) FROM {table[0]}")
                        count = cursor.fetchone()[0]
                        print(f"- {table[0]}: {count} records")
                else:
                    print("No tables found in database")
            else:
                print(f'Database "{db_name}" does not exist')
                
    except Error as e:
        print(f"Error: {e}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

# Import views and models after db is created
from app import views
from app import models