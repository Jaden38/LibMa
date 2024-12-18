from flask.cli import with_appcontext
from app import app, db
import click
import mysql.connector
from mysql.connector import Error
import os
from datetime import datetime
from sqlalchemy import text
from scripts.generate_models import generate_models
from scripts.cover_processor import process_book_covers

def execute_sql_file(cursor, filename):
    """Execute SQL commands from a file"""
    print(f"Executing {filename}...")
    with open(os.path.join("database", filename), "r", encoding="utf-8") as f:

        sql_commands = f.read().split(";")

        for command in sql_commands:

            if command.strip():
                try:
                    cursor.execute(command)
                except Error as e:
                    print(f"Error executing command: {command[:100]}...")
                    print(f"Error message: {str(e)}")
                    raise e


@app.cli.command()
@with_appcontext
def init_db():
    """Initialize the database using schema.sql and populate.sql"""
    try:

        conn = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            port=int(os.getenv("MYSQL_PORT", 3306)),
        )

        if conn.is_connected():
            cursor = conn.cursor()

            cursor.execute("SHOW DATABASES")
            databases = [db[0] for db in cursor]
            db_name = os.getenv("MYSQL_DATABASE")

            if db_name in databases:

                if not click.confirm(
                    f'Database "{db_name}" already exists. Do you want to drop and recreate it? This will delete all existing data!',
                    default=False,
                ):
                    print("Database initialization cancelled.")
                    return

                print(f"Dropping database {db_name}...")
                cursor.execute(f"DROP DATABASE {db_name}")

            print(f"Creating database {db_name}...")
            cursor.execute(
                f"CREATE DATABASE {db_name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
            )
            cursor.execute(f"USE {db_name}")

            try:
                execute_sql_file(cursor, "schema.sql")
                conn.commit()
                print("Schema created successfully!")
            except Error as e:
                print(f"Error creating schema: {str(e)}")
                return

            try:
                execute_sql_file(cursor, "populate.sql")
                conn.commit()
                print("Data populated successfully!")
            except Error as e:
                print(f"Error populating data: {str(e)}")
                return

            print("Database initialization completed successfully!")

    except Error as e:
        print(f"Error: {e}")
    finally:
        if "conn" in locals() and conn.is_connected():
            cursor.close()
            conn.close()


@app.cli.command()
@with_appcontext
def db_status():
    """Check the status of the database and display table counts"""
    try:
        with app.app_context():

            from app.models import (
                Book,
                User,
                Sample,
                Borrow,
                Reservation,
                Notification,
                Log,
            )

            models = [
                ("Users", User),
                ("Books", Book),
                ("Samples", Sample),
                ("Borrows", Borrow),
                ("Reservations", Reservation),
                ("Notifications", Notification),
                ("Logs", Log),
            ]

            print("\nStatut de la base de données :")
            print("-" * 40)

            for name, model in models:
                count = model.query.count()
                print(f"{name}: {count} enregistrements")

            active_users = User.query.filter_by(statut="actif").count()
            available_books = Sample.query.filter_by(statut="disponible").count()
            active_loans = Borrow.query.filter_by(statut="en cours").count()

            print("\nStatistiques :")
            print("-" * 40)
            print(f"Utilisateurs actifs: {active_users}")
            print(f"Exemplaires disponibles: {available_books}")
            print(f"Emprunts en cours: {active_loans}")

    except Exception as e:
        print(f"Erreur lors de la vérification de la base de données : {str(e)}")


@app.cli.command()
@with_appcontext
def reset_db():
    """Reset the database by dropping all tables and recreating them"""
    if click.confirm(
        "Are you sure you want to reset the database? This will delete all data!",
        default=False,
    ):
        try:
            with app.app_context():
                db.drop_all()
                db.create_all()
                print("Database has been reset successfully!")
        except Exception as e:
            print(f"Error resetting database: {str(e)}")
    else:
        print("Database reset cancelled.")


@app.cli.command()
@with_appcontext
def check_connections():
    """Check database connections and configuration"""
    print("\nDatabase Configuration:")
    print("-" * 40)
    print(f"Host: {os.getenv('MYSQL_HOST')}")
    print(f"Database: {os.getenv('MYSQL_DATABASE')}")
    print(f"User: {os.getenv('MYSQL_USER')}")
    print(f"Port: {os.getenv('MYSQL_PORT', 3306)}")

    try:

        with app.app_context():

            result = db.session.execute(text("SELECT 1"))
            print("\nSQLAlchemy connection: SUCCESS")
            print("Database version:", end=" ")
            version = db.session.execute(text("SELECT VERSION()")).scalar()
            print(version)
    except Exception as e:
        print(f"\nSQLAlchemy connection: FAILED")
        print(f"Error: {str(e)}")

    try:

        conn = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            database=os.getenv("MYSQL_DATABASE"),
            port=int(os.getenv("MYSQL_PORT", 3306)),
        )
        if conn.is_connected():
            print("Direct MySQL connection: SUCCESS")
            conn.close()
    except Error as e:
        print("Direct MySQL connection: FAILED")
        print(f"Error: {str(e)}")
        
app.cli.add_command(generate_models, name='generate-models')

@app.cli.command()
@with_appcontext
def update_covers():
    """Update book cover images from PNG files in the covers directory"""
    try:
        process_book_covers()
    except Exception as e:
        print(f"Error in update_covers: {str(e)}")