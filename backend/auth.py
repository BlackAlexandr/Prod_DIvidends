from flask import jsonify, request, session
from database import get_clients_db
from models_clients import User


def register_user():
    db = next(get_clients_db())
    data = request.get_json()

    name = data.get('name')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not all([name, username, email, password]):
        return jsonify({"error": "All fields are required"}), 400

    existing_user = db.query(User).filter_by(Username=username).first()
    if existing_user:
        return jsonify({"error": "Username already exists"}), 409

    new_user = User(
        Name=name,
        Username=username,
        Email=email,
        PasswordHash=User.hash_password(password)
    )
    db.add(new_user)
    db.commit()

    # Устанавливаем сессию для нового пользователя
    session['user_id'] = new_user.ID
    return jsonify({"message": "Registration successful"}), 201


def login_user():
    db = next(get_clients_db())
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = db.query(User).filter_by(Username=username).first()
    if not user or not user.verify_password(password):
        return jsonify({"error": "Invalid username or password"}), 401

    # Устанавливаем сессию для пользователя
    session['user_id'] = user.ID
    return jsonify({"message": "Login successful"}), 200


def logout_user():
    session.pop('user_id', None)
    return jsonify({"message": "Logout successful"}), 200