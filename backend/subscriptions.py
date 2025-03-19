from flask import jsonify, request, session
from database import get_clients_db
from models_clients import Subscription

def get_subscriptions_list():
    db = next(get_clients_db())
    subscriptions = db.query(Subscription).all()

    result = [{
        'ID': s.ID,
        'Name': s.Name,
        'Price': s.Price,
        'DurationDays': s.DurationDays
    } for s in subscriptions]

    return jsonify(result)


def subscribe_user():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    db = next(get_clients_db())
    data = request.get_json()

    subscription_id = data.get('subscription_id')
    if not subscription_id:
        return jsonify({"error": "Subscription ID is required"}), 400

    subscription = db.query(Subscription).filter_by(ID=subscription_id).first()
    if not subscription:
        return jsonify({"error": "Invalid subscription ID"}), 400

    user = db.query(User).filter_by(ID=session['user_id']).first()
    user.SubscriptionID = subscription.ID
    user.subscription = subscription
    db.commit()

    return jsonify({"message": f"Subscribed to {subscription.Name} successfully"}), 200