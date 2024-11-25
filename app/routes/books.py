from flask import Blueprint, render_template
from app.models import Book
from flask_login import login_required

bp = Blueprint('books', __name__)

@bp.route('/books')
@login_required
def list_books():
    books = Book.query.all()
    return render_template('books/list.html', books=books)

@bp.route('/books/<int:id>')
@login_required
def book_detail(id):
    book = Book.query.get_or_404(id)
    return render_template('books/detail.html', book=book)