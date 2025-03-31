from sqlalchemy import Boolean, Column, Integer, String, Float, Date, LargeBinary, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

# Создаем базовый класс для моделей
Base = declarative_base()

# Модель Company
class Company(Base):
    __tablename__ = 'Companies'
    ID = Column(Integer, primary_key=True)  # Первичный ключ
    Name = Column(String, nullable=False)  # Название компании
    Ticker = Column(String, unique=True, nullable=False)  # Тикер компании
    Icon = Column(LargeBinary, nullable=True)  # Иконка компании (BLOB)

    def to_dict(self):
        """
        Преобразует объект модели в словарь.
        """
        return {
            'ID': self.ID,
            'Name': self.Name,
            'Ticker': self.Ticker,
            'Icon': self.Icon.decode('utf-8') if self.Icon else None # Преобразуем BLOB в Base64
        }

# Модель Dividend
class Dividend(Base):
    __tablename__ = 'Dividends'
    ID = Column(Integer, primary_key=True)  # Первичный ключ
    Ticker = Column(String, ForeignKey('Companies.Ticker'), nullable=False)  # Связь с компанией
    Date = Column(Date, nullable=False)  # Дата выплаты дивидендов
    Profit_rub = Column(Float, nullable=False)  # Размер дивидендов в рублях
    Profit_interest = Column(Float, nullable=False)
    Is_Approved = Column(Integer, default=0, nullable=False)

    def to_dict(self):
        """
        Преобразует объект модели в словарь.
        """
        return {
            'ID': self.ID,
            'Ticker': self.Ticker,
            'Date': self.Date.strftime('%d.%m.%Y') if self.Date else None,  # Форматируем дату
            'Profit_rub': self.Profit_rub,
            'Profit_interest': self.Profit_interest,
            'Is_Approved': self.Is_Approved
        }

# Модель DividendForecast

class DividendForecast(Base):
    __tablename__ = 'DividendForecast'
    ID = Column(Integer, primary_key=True)
    Ticker = Column(String, nullable=False)
    Forecast_Date = Column(Date, nullable=False)
    Forecast_Profit_rub = Column(Float, nullable=False)
    Forecast_Profit_interest = Column(Float, nullable=False)
    def to_dict(self):
        return {
            'ID': self.ID,
            'Ticker': self.Ticker,
            'Forecast_Date': self.Forecast_Date,
            'Forecast_Profit_rub': self.Forecast_Profit_rub,
            'Forecast_Profit_interest': self.Forecast_Profit_interest
        }

class HistoricalDividends(Base):
    __tablename__ = 'HistoricalDividends'
    ID = Column(Integer, primary_key=True)
    Ticker = Column(String, ForeignKey('Companies.Ticker'), nullable=False)  # Связь с компанией
    Date = Column(Date, nullable=False)
    Profit_rub = Column(Float, nullable=False)
    Profit_interest = Column(Float, nullable=False)
    def to_dict(self):
        return {
            'ID': self.ID,
            'Ticker': self.Ticker,
            'Date': self.Forecast_Date,
            'Profit_rub': self.Forecast_Profit_rub,
            'Profit_interest': self.Forecast_Profit_interest
        }