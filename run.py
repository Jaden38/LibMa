from app import app
import os
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    port = int(os.getenv('FLASK_PORT', 5000))
    app.run(debug=True, port=port)