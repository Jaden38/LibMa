# app/routes/__init__.py
from . import auth, books, loans, admin

# app/routes/auth.py
from flask import Blueprint, render_template, redirect, url_for
from flask_login import login_user, logout_user, login_required

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/login')
def login():
    return render_template('auth/login.html')

@bp.route('/logout')
def logout():
    return redirect(url_for('auth.login'))

# app/routes/books.py
from flask import Blueprint

bp = Blueprint('books', __name__, url_prefix='/books')

# app/routes/loans.py
from flask import Blueprint

bp = Blueprint('loans', __name__, url_prefix='/loans')

# app/routes/admin.py
from flask import Blueprint

bp = Blueprint('admin', __name__, url_prefix='/admin')