from datetime import datetime, timedelta
from app.models import Borrow, Notification
from app import db

class NotificationService:
    @staticmethod
    def create_notification(user_id: int, message: str, notification_type: str) -> Notification:
        """Create a new notification"""
        try:
            notification = Notification(
                user_id=user_id,
                notification_type=notification_type,
                notification_message=message,
                viewed=False
            )
            db.session.add(notification)
            db.session.commit()
            return notification
        except Exception as e:
            print(f"Error creating notification: {str(e)}")
            db.session.rollback()
            raise

    @staticmethod
    def check_upcoming_returns():
        """Check for books due in the next 3 days and create notifications"""
        today = datetime.now()
        three_days_from_now = today + timedelta(days=3)
        
        upcoming_returns = Borrow.query.filter(
            Borrow.end_date <= three_days_from_now,
            Borrow.end_date > today,
            Borrow.borrow_status == 'en cours'
        ).all()
        
        for borrow in upcoming_returns:
            existing_notification = Notification.query.filter(
                Notification.user_id == borrow.user_id,
                Notification.notification_type == 'date_echeance',
                db.cast(Notification.notification_message, db.String).like(f"%{borrow.borrow_id}%"),
                Notification.viewed == False
            ).first()
            
            if not existing_notification:
                days_remaining = (borrow.end_date - today).days
                NotificationService.create_notification(
                    user_id=borrow.user_id,
                    notification_type='date_echeance',
                    message=f"Le livre emprunté doit être retourné dans {days_remaining} jours. ID emprunt: {borrow.borrow_id}"
                )

    @staticmethod
    def check_overdue_returns():
        """Check for overdue books and create notifications"""
        today = datetime.now()
        
        overdue_returns = Borrow.query.filter(
            Borrow.end_date < today,
            Borrow.borrow_status == 'en cours'
        ).all()
        
        for borrow in overdue_returns:
            if borrow.borrow_status != 'en retard':
                borrow.borrow_status = 'en retard'
                
                NotificationService.create_notification(
                    user_id=borrow.user_id,
                    notification_type='rappel_emprunt',
                    message=f"Le livre emprunté est en retard! Veuillez le retourner dès que possible. ID emprunt: {borrow.borrow_id}"
                )
                
                try:
                    db.session.commit()
                except Exception as e:
                    print(f"Error updating borrow status: {str(e)}")
                    db.session.rollback()