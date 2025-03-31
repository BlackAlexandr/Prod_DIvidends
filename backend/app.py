from flask import Flask, jsonify, request, session
from flask_cors import CORS
from database import init_databases, get_dividends_db
from models_clients import User
from models_dividends import Company, DividendForecast, Dividend, HistoricalDividends
from auth import register_user, login_user, logout_user
from subscriptions import get_subscriptions_list, subscribe_user
import base64
import requests
from datetime import datetime, timedelta
from flask_session import Session
import asyncio
import aiomoex
import aiohttp
import sys

# Установка правильного цикла событий для Windows
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "supports_credentials": True}})

app.secret_key = 'your_secret_key_here'
app.config['SESSION_TYPE'] = 'filesystem'  # Хранение сессий на сервере
app.config['SESSION_PERMANENT'] = False  # Сессии не постоянные
Session(app)  # Инициализация Flask-Session

# Словарь для преобразования интервалов в значения MOEX
MOEX_INTERVALS = {
    '1h': 60,  # Часовые данные
    '1d': 24,   # Дневные данные
    '1w': 7,   # Недельные данные
    '4h': 240  # 4-часовые данные
}

# Словарь для преобразования периодов в количество дней
PERIOD_TO_DAYS = {
    "1y": 365,  # 1 год
    "2y": 730,  # 2 года
    "3y": 1095,  # 3 года
    "4y": 1460,  # 4 года
    "5y": 1825,  # 5 лет
}

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

from datetime import datetime, timedelta
from flask import request, jsonify

@app.route('/api/companies', methods=['GET'])
def get_companies():
    db = next(get_dividends_db())  # Получаем сессию базы данных
    ticker = request.args.get('ticker')  # Получаем параметр запроса

    try:
        query = db.query(
            Dividend.ID,
            Company.Name,
            Company.Ticker,
            Company.Icon,
            Dividend.Is_Approved,
            Dividend.Date.label('Dividend_Date'),
            Dividend.Profit_rub.label('Actual_Profit_rub'),
            Dividend.Profit_interest,
            DividendForecast.Forecast_Profit_rub,
            DividendForecast.Forecast_Profit_interest
        ).join(Company, Dividend.Ticker == Company.Ticker)\
         .outerjoin(DividendForecast, Company.Ticker == DividendForecast.Ticker)

        if ticker:
            query = query.filter(Company.Ticker == ticker)

        dividends = query.all()

        result = [{
            'ID': d.ID,
            'Name': d.Name,
            'Ticker': d.Ticker,
            'Icon': base64.b64encode(d.Icon).decode('utf-8') if d.Icon else None,
            'Dividend_Date': d.Dividend_Date.strftime('%d.%m.%Y') if d.Dividend_Date else None,
            'Actual_Profit_rub': d.Actual_Profit_rub,
            'Profit_interest': d.Profit_interest if d.Profit_interest is not None else '-',
            'Forecast_Profit_rub': d.Forecast_Profit_rub if d.Forecast_Profit_rub is not None else '-',
            'Forecast_Profit_interest': d.Forecast_Profit_interest if d.Forecast_Profit_interest is not None else '-',
            'Is_Approved': d.Is_Approved == 1
        } for d in dividends]

        return jsonify(result)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
@app.route('/api/freecompanies', methods=['GET'])
def get_freecompanies():
    db = next(get_dividends_db())  # Получаем сессию базы данных
    ticker = request.args.get('ticker')  # Получаем параметр запроса

    try:
        query = db.query(
            Dividend.ID,
            Company.Name,
            Company.Ticker,
            Company.Icon,
            Dividend.Is_Approved,
            Dividend.Date.label('Dividend_Date'),
            Dividend.Profit_rub.label('Actual_Profit_rub'),
            Dividend.Profit_interest,
            DividendForecast.Forecast_Profit_rub,
            DividendForecast.Forecast_Profit_interest
        ).join(Company, Dividend.Ticker == Company.Ticker)\
         .outerjoin(DividendForecast, Company.Ticker == DividendForecast.Ticker)

        # Если пользователь НЕ авторизован, ограничиваем данные ближайшими двумя месяцами
        current_date = datetime.now()
        two_months_later = current_date + timedelta(days=60)  # Два месяца вперед
        query = query.filter(Dividend.Date >= current_date, Dividend.Date <= two_months_later)

        if ticker:
            query = query.filter(Company.Ticker == ticker)

        dividends = query.all()

        result = [{
            'ID': d.ID,
            'Name': d.Name,
            'Ticker': d.Ticker,
            'Icon': base64.b64encode(d.Icon).decode('utf-8') if d.Icon else None,
            'Dividend_Date': d.Dividend_Date.strftime('%d.%m.%Y') if d.Dividend_Date else None,
            'Actual_Profit_rub': d.Actual_Profit_rub,
            'Profit_interest': d.Profit_interest if d.Profit_interest is not None else '-',
            'Forecast_Profit_rub': d.Forecast_Profit_rub if d.Forecast_Profit_rub is not None else '-',
            'Forecast_Profit_interest': d.Forecast_Profit_interest if d.Forecast_Profit_interest is not None else '-',
            'Is_Approved': d.Is_Approved == 1
        } for d in dividends]

        return jsonify(result)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route('/api/hourly_data', methods=['GET'])
def get_hourly_data():
    """
    Получает часовые данные через API MOEX за последние две недели.
    """
    ticker = request.args.get('ticker')
    if not ticker:
        return jsonify({"error": "Ticker is required"}), 400

    try:
        # Даты для запроса (последние две недели)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=14)

        url = f"https://iss.moex.com/iss/engines/stock/markets/shares/securities/{ticker}/candles.json"
        params = {
            "interval": 60,  # Часовые данные
            "from": start_date.strftime("%Y-%m-%d"),
            "till": end_date.strftime("%Y-%m-%d"),
        }
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            candles = data["candles"]["data"]
            columns = data["candles"]["columns"]
            result = [dict(zip(columns, row)) for row in candles]

            # Форматируем данные для графика
            formatted_data = [{
                'Timestamp': item['begin'],
                'Open': item['open'],
                'Close': item['close'],
                'High': item['high'],
                'Low': item['low'],
                'Volume': item['value']
            } for item in result]
            return jsonify(formatted_data)
        else:
            return jsonify({"error": "Failed to fetch hourly data from MOEX"}), 500
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


@app.route('/api/data/<interval>', methods=['GET'])
def get_data(interval):
    ticker = request.args.get('ticker')
    period = request.args.get('period')

    if not ticker:
        return jsonify({"error": "Ticker is required"}), 400

    # Проверяем, существует ли указанный интервал
    moex_interval = MOEX_INTERVALS.get(interval)
    if not moex_interval:
        return jsonify({"error": "Invalid interval"}), 400

    try:
        # Если указан период (например, 1y, 2y), рассчитываем start_date и end_date
        if period:
            days = PERIOD_TO_DAYS.get(period)
            if not days:
                return jsonify({"error": "Invalid period"}), 400

            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)
        else:
            # Если период не указан, используем последние 7 дней по умолчанию
            end_date = datetime.now()
            start_date = end_date - timedelta(days=365)

        # Запускаем асинхронную задачу
        result = asyncio.run(fetch_data(ticker, moex_interval, start_date, end_date))
        return jsonify(result)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


async def fetch_data(ticker, moex_interval, start_date, end_date):
    """
    Асинхронная функция для получения данных по тикеру и IMOEX.
    """
    async with aiohttp.ClientSession() as session:
        # Запрос данных для тикера
        ticker_data = await aiomoex.get_market_candles(
            session,
            security=ticker,
            interval=moex_interval,
            start=start_date.strftime("%Y-%m-%d"),
            end=end_date.strftime("%Y-%m-%d"),
        )

        # Запрос данных для IMOEX
        imoex_data = await aiomoex.get_market_candles(
            session,
            security="IMOEX",
            interval=moex_interval,
            start=start_date.strftime("%Y-%m-%d"),
            end=end_date.strftime("%Y-%m-%d"),
            market="index",
        )

        # Форматируем данные для графика
        formatted_data_ticker = [
            {
                "Timestamp": item["begin"],
                "Open": item["open"],
                "Close": item["close"],
                "High": item["high"],
                "Low": item["low"],
                "Volume": item["value"],
            }
            for item in ticker_data
        ]

        formatted_data_imoex = [
            {"Timestamp": item["begin"], "Close": item["close"]} for item in imoex_data
        ]

        return {
            "ticker": formatted_data_ticker,
            "imoex": formatted_data_imoex,
        }
    
@app.route('/api/historicaldividends', methods=['GET'])
def get_historical_dividends():
    db = next(get_dividends_db())  # Получаем сессию базы данных
    ticker = request.args.get('ticker')  # Получаем параметр запроса

    try:
        query = db.query(
            HistoricalDividends.ID,
            Company.Name,
            Company.Ticker,
            Company.Icon,
            HistoricalDividends.Date,
            HistoricalDividends.Profit_rub,
            HistoricalDividends.Profit_interest
        ).join(Company, HistoricalDividends.Ticker == Company.Ticker)

        if ticker:
            query = query.filter(Company.Ticker == ticker)

        # Сортируем по дате в убывающем порядке (сначала самые новые)
        query = query.order_by(HistoricalDividends.Date.desc())

        dividends = query.all()

        result = [{
            'ID': d.ID,
            'Name': d.Name,
            'Ticker': d.Ticker,
            'Icon': base64.b64encode(d.Icon).decode('utf-8') if d.Icon else None,
            'Date': d.Date.strftime('%d.%m.%Y') if d.Date else None,
            'Profit_rub': d.Profit_rub,
            'Profit_interest': d.Profit_interest
        } for d in dividends]

        return jsonify(result)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500  

    
if __name__ == '__main__':
    init_databases()  # Инициализация базы данных
    app.run(debug=True)