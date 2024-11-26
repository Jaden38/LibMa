from app import db

# Example model - update this based on your schema.sql
class Book(db.Model):
    __tablename__ = 'books'
    __table_args__ = {'extend_existing': True}
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    isbn = db.Column(db.String(13), unique=True)

    def __repr__(self):
        return f'<Book {self.title}>'