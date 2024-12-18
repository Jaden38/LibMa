import os
import base64
from flask import current_app
from app import db
from app.models import Book

def process_book_covers():
    """Process and update book covers from PNG and JPEG/JPG files"""
    
    basedir = os.path.dirname(current_app.root_path)
    covers_dir = os.path.join(basedir, 'covers')

    if not os.path.exists(covers_dir):
        try:
            os.makedirs(covers_dir)
            print(f"\nCreated covers directory at: {covers_dir}")
            print("\nPlease add your book cover images to this directory using the format:")
            print("- Name each file as 'book_id.extension' (e.g., '1.png' or '1.jpg' for book ID 1)")
            print("- Supported formats: PNG, JPG, JPEG")
            print(f"\nDirectory path: {covers_dir}")
            return
        except Exception as e:
            print(f"\nError creating covers directory: {str(e)}")
            return

    valid_extensions = ('.png', '.jpg', '.jpeg')
    files = [f for f in os.listdir(covers_dir) if f.lower().endswith(valid_extensions)]
    
    if not files:
        print(f"\nNo image files found in covers directory: {covers_dir}")
        print("\nPlease add your book cover images using the format:")
        print("- Name each file as 'book_id.extension' (e.g., '1.png' or '1.jpg' for book ID 1)")
        print("- Supported formats: PNG, JPG, JPEG")
        return

    try:
        print("\nProcessing book covers...")
        print("-" * 40)

        for filename in files:
            try:
                book_id = int(os.path.splitext(filename)[0])
                image_path = os.path.join(covers_dir, filename)
                
                print(f"Processing {filename} for book ID {book_id}")
                
                file_size = os.path.getsize(image_path)
                if file_size > 16 * 1024 * 1024:
                    print(f"Image {filename} is too large (max 16MB), skipping...")
                    continue

                try:
                    with open(image_path, 'rb') as image_file:
                        binary_data = image_file.read()
                        base64_data = base64.b64encode(binary_data).decode('utf-8')
                except IOError as e:
                    print(f"Error reading file {filename}: {str(e)}")
                    continue

                book = Book.query.get(book_id)
                if not book:
                    print(f"Book with ID {book_id} not found, skipping...")
                    continue

                book.cover_image = base64_data
                db.session.commit()
                print(f"Successfully updated cover for book: {book.title}")

            except ValueError as e:
                print(f"Error processing {filename}: {str(e)}")
                continue
            except Exception as e:
                print(f"Error updating cover for {filename}: {str(e)}")
                db.session.rollback()
                continue

        if not files:
            print("\nNo image files were processed.")
        else:
            print("\nBook cover update process completed!")

    except Exception as e:
        print(f"\nError: {str(e)}")
        db.session.rollback()