import os
from dotenv import load_dotenv
import subprocess
import sys
from pathlib import Path
import click


@click.command()
@click.option('--output', default='app/models.py', help='Output file path')
@click.option('--overwrite', is_flag=True, help='Overwrite existing file')
def generate_models(output, overwrite):
    """Generate Flask-SQLAlchemy models from database schema"""
    load_dotenv()

    db_user = os.getenv('MYSQL_USER')
    db_pass = os.getenv('MYSQL_PASSWORD')
    db_host = os.getenv('MYSQL_HOST')
    db_port = os.getenv('MYSQL_PORT', '3306')
    db_name = os.getenv('MYSQL_DATABASE')

    db_url = f"mysql+pymysql://{db_user}:{
        db_pass}@{db_host}:{db_port}/{db_name}"

    output_path = Path(output)
    if output_path.exists() and not overwrite:
        if not click.confirm(f'File {output} already exists. Overwrite?'):
            click.echo('Aborted.')
            return

    try:
        subprocess.run([sys.executable, "-m", "pip", "show", "flask-sqlacodegen"],
                       capture_output=True, check=True)
    except subprocess.CalledProcessError:
        print("Installing flask-sqlacodegen...")
        subprocess.run([sys.executable, "-m", "pip", "install",
                       "flask-sqlacodegen"], check=True)

    print(f"Generating models from database {db_name}...")

    try:
        cmd = [
            "flask-sqlacodegen",
            "--flask",
            "--outfile", str(output_path),
            "--tables", "users,books,samples,borrows,reservations,notifications,logs",
            db_url
        ]

        result = subprocess.run(
            cmd, capture_output=True, text=True, check=True)

        with open(output_path, 'r', encoding='utf-8') as f:
            content = f.read()

        header = '''from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import Enum
from app import db

'''

        content = content.replace(
            'from flask_sqlalchemy import SQLAlchemy\n', '')
        content = content.replace('db = SQLAlchemy()', '')

        enums_definition = '''
# Enum definitions
class UserRole(str, Enum):
    MEMBER = 'membre'
    LIBRARIAN = 'bibliothecaire'
    ADMIN = 'administrateur'

class UserStatus(str, Enum):
    ACTIVE = 'actif'
    INACTIVE = 'inactif'
    SUSPENDED = 'suspendu'

class SampleStatus(str, Enum):
    AVAILABLE = 'disponible'
    BORROWED = 'emprunté'
    RESERVED = 'réservé'
    UNAVAILABLE = 'indisponible'

class BorrowStatus(str, Enum):
    ONGOING = 'en cours'
    COMPLETED = 'terminé'
    LATE = 'en retard'
    CANCELLED = 'annulé'

class ReservationStatus(str, Enum):
    ACTIVE = 'active'
    CONFIRMED = 'confirmée'
    CANCELLED = 'annulée'
    EXPIRED = 'expirée'

class NotificationType(str, Enum):
    BORROW_REMINDER = 'rappel_emprunt'
    NEW_RESERVATION = 'nouvelle_reservation'
    DUE_DATE = 'date_echeance'

'''

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(header + enums_definition + content)

        print(f"\nModels generated successfully in {output_path}")
        print("\nNext steps:")
        print("1. Review the generated models")
        print("2. Add any custom methods or properties")
        print("3. Verify relationships and backrefs")
        print("4. Add custom validation logic if needed")
        print("5. Check Enum types and constraints")

    except subprocess.CalledProcessError as e:
        print(f"Error generating models: {e.stderr}")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)


if __name__ == '__main__':
    generate_models()
