from app import create_app, db

app = create_app()

@app.cli.command("init-db")
def init_db():
    """Initialize the database."""
    db.create_all()
    print("Database initialized!")

@app.cli.command("reset-db")
def reset_db():
    """Drop all tables and recreate."""
    db.drop_all()
    db.create_all()
    print("Database reset complete!")

if __name__ == '__main__':
    with app.app_context():
        try:
            db.create_all()
            print("Database tables created successfully")
        except Exception as e:
            print(f"Error creating tables: {e}")
    app.run(debug=True, host='0.0.0.0', port=5000)