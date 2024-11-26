from flask import render_template, jsonify
from app import app, db
from app.models import Book

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/base')
def view_base():
    return render_template('base.html')

@app.route('/test_db')
def test_db():
    try:
        books = Book.query.all()
        return jsonify([{'id': book.id, 'title': book.title} for book in books])
    except Exception as e:
        return f'Database error: {str(e)}'
    
    
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response