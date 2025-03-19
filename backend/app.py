from flask import Flask, jsonify, request
from flask_cors import CORS
from flask import Flask, jsonify, request
from flask_cors import CORS
from database import init_databases, get_clients_db, get_dividends_db
from models_clients import User
from models_dividends import Company, DividendForecast, Dividend
from auth import register_user, login_user, logout_user
from subscriptions import get_subscriptions_list, subscribe_user
import base64

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "supports_credentials": True}})


app.secret_key = 'your_secret_key_here'

@app.route('/api/register', methods=['POST'])
def register():
    return register_user()

@app.route('/api/login', methods=['POST'])
def login():
    return login_user()

@app.route('/api/logout', methods=['POST'])
def logout():
    return logout_user()

@app.route('/api/subscriptions', methods=['GET'])
def subscriptions():
    return get_subscriptions_list()

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    return subscribe_user()


@app.route('/api/companies', methods=['GET'])
def get_companies():
    db = next(get_dividends_db())  # Получаем сессию базы данных
    ticker = request.args.get('ticker')  # Получаем параметр запроса

    try:
        # Используем сессию из get_db()
        query = db.query(
            Dividend.ID,
            Company.Name,
            Company.Ticker,
            Company.Icon,
            Dividend.Is_Approved,  # Добавляем поле is_approved
            Dividend.Date.label('Dividend_Date'),
            Dividend.Profit_rub.label('Actual_Profit_rub'),
            Dividend.Profit_interest,  # Добавляем Actual Interest
            DividendForecast.Forecast_Profit_rub,
            DividendForecast.Forecast_Profit_interest
        ).join(Company, Dividend.Ticker == Company.Ticker)\
         .outerjoin(DividendForecast, Company.Ticker == DividendForecast.Ticker)

        if ticker:
            query = query.filter(Company.Ticker == ticker)

        dividends = query.all()

        # Преобразуем результат в словарь
        result = [{
            'ID': d.ID,
            'Name': d.Name,  # Передаем только название компании
            'Ticker': d.Ticker,
            'Icon': base64.b64encode(d.Icon).decode('utf-8') if d.Icon else None,  # Преобразуем BLOB в Base64
            'Dividend_Date': d.Dividend_Date.strftime('%d.%m.%Y') if d.Dividend_Date else None,  # Проверяем на None
            'Actual_Profit_rub': d.Actual_Profit_rub,
            'Profit_interest': d.Profit_interest if d.Profit_interest is not None else '-',  # Новый столбец
            'Forecast_Profit_rub': d.Forecast_Profit_rub if d.Forecast_Profit_rub is not None else '-',  # Проверяем на None
            'Forecast_Profit_interest': d.Forecast_Profit_interest if d.Forecast_Profit_interest is not None else '-',  # Проверяем на None
            'Is_Approved': d.Is_Approved == 1  # Добавляем HasCheckbox на основе Is_Approved
        } for d in dividends]

        print("Data sent to frontend:", result)  # Логируем данные для отладки
        return jsonify(result)
    except Exception as e:
        print(f"Error: {e}")  # Логируем ошибку
        return jsonify({"error": "Internal Server Error"}), 500


if __name__ == '__main__':
    init_databases()  # Инициализация базы данных
    app.run(debug=True)