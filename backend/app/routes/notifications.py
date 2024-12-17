from flask import Blueprint, jsonify, Response
from app import db
from app.models import Notification
import logging
import time
import json

logger = logging.getLogger(__name__)
notifications_bp = Blueprint('notifications', __name__)

def format_sse(data: str, event=None) -> str:
    msg = f'data: {data}\n'
    if event is not None:
        msg = f'event: {event}\n{msg}'
    return f'{msg}\n'

@notifications_bp.route('/notifications/stream/<int:user_id>')
def stream_notifications(user_id):
    def event_stream(user_id):
        last_check = time.time()
        while True:
            notifications = Notification.query.filter(
                Notification.user_id == user_id,
                Notification.viewed == False,
                Notification.creation_date >= db.func.from_unixtime(last_check)
            ).all()
            
            if notifications:
                data = [{
                    'id': notif.notification_id,
                    'type': notif.notification_type,
                    'message': notif.notification_message,
                    'creation_date': notif.creation_date.isoformat(),
                    'viewed': bool(notif.viewed)
                } for notif in notifications]
                yield format_sse(json.dumps(data), event='notification')
            
            last_check = time.time()
            time.sleep(3)

    return Response(
        event_stream(user_id),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'text/event-stream'
        }
    )

@notifications_bp.route('/notifications/<int:user_id>')
def get_user_notifications(user_id):
    try:
        notifications = Notification.query.filter_by(
            user_id=user_id,
            viewed=False
        ).order_by(Notification.creation_date.desc()).all()

        result = [{
            'id': notif.notification_id,
            'type': notif.notification_type,
            'message': notif.notification_message,
            'creation_date': notif.creation_date.isoformat(),
            'viewed': bool(notif.viewed)
        } for notif in notifications]

        return jsonify(result)
    except Exception as e:
        logger.error(f"Error fetching notifications: {str(e)}")
        return jsonify({'error': 'Database error', 'message': str(e)}), 500

@notifications_bp.route('/notifications/<int:notification_id>/mark-read', methods=['POST'])
def mark_notification_read(notification_id):
    try:
        notification = Notification.query.get_or_404(notification_id)
        notification.viewed = True
        db.session.commit()
        return jsonify({'message': 'Notification marked as read'})
    except Exception as e:
        logger.error(f"Error marking notification as read: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Database error', 'message': str(e)}), 500