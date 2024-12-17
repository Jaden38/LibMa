from datetime import datetime, timedelta
from app.models import Borrow, Notification, NotificationType
from app import db

class NotificationService:
    @staticmethod
    def check_upcoming_returns():
        """Check for books due in the next 3 days and create notifications"""
        today = datetime.now()
        three_days_from_now = today + timedelta(days=3)
        
        # Find active borrows that are due in the next 3 days
        upcoming_returns = Borrow.query.filter(
            Borrow.end_date <= three_days_from_now,
            Borrow.end_date > today,
            Borrow.borrow_status == 'en cours'
        ).all()
        
        for borrow in upcoming_returns:
            # Check if a notification already exists for this borrow
            existing_notification = Notification.query.filter(
                Notification.user_id == borrow.user_id,
                Notification.notification_type == 'date_echeance',  # Using string instead of enum
                db.cast(Notification.notification_message, db.String).like(f"%{borrow.borrow_id}%"),
                Notification.viewed == False
            ).first()
            
            if not existing_notification:
                days_remaining = (borrow.end_date - today).days
                notification = Notification(
                    user_id=borrow.user_id,
                    notification_type='date_echeance',  # Using string instead of enum
                    notification_message=f"Le livre emprunté doit être retourné dans {days_remaining} jours. ID emprunt: {borrow.borrow_id}",
                    viewed=False
                )
                db.session.add(notification)
        
        try:
            db.session.commit()
        except Exception as e:
            print(f"Error in check_upcoming_returns: {str(e)}")
            db.session.rollback()

    @staticmethod
    def check_overdue_returns():
        """Check for overdue books and create notifications"""
        today = datetime.now()
        
        # Find active borrows that are overdue
        overdue_returns = Borrow.query.filter(
            Borrow.end_date < today,
            Borrow.borrow_status == 'en cours'
        ).all()
        
        for borrow in overdue_returns:
            # Update borrow status to 'en retard'
            if borrow.borrow_status != 'en retard':
                borrow.borrow_status = 'en retard'
                
                # Create notification for overdue book
                notification = Notification(
                    user_id=borrow.user_id,
                    notification_type='rappel_emprunt',  # Using string instead of enum
                    notification_message=f"Le livre emprunté est en retard! Veuillez le retourner dès que possible. ID emprunt: {borrow.borrow_id}",
                    viewed=False
                )
                db.session.add(notification)
        
        try:
            db.session.commit()
        except Exception as e:
            print(f"Error in check_overdue_returns: {str(e)}")
            db.session.rollback()