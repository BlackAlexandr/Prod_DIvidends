import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Определяем пути к базам данных
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CLIENTS_DB_PATH = os.path.join(BASE_DIR, 'clients.sqlite3')
FACE_DB_PATH = os.path.join(BASE_DIR, 'face.sqlite3')

# Создаем движки для двух баз данных
clients_engine = create_engine(f"sqlite:///{CLIENTS_DB_PATH}", connect_args={"check_same_thread": False})
face_engine = create_engine(f"sqlite:///{FACE_DB_PATH}", connect_args={"check_same_thread": False})

# Создаем сессии для каждой базы данных
ClientsSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=clients_engine)
DividendSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=face_engine)

# Общие базы декларативных моделей
ClientsBase = declarative_base()
FaceBase = declarative_base()

def init_databases():
    """Инициализация обеих баз данных."""
    ClientsBase.metadata.create_all(bind=clients_engine)
    FaceBase.metadata.create_all(bind=face_engine)

def get_clients_db():
    """Генератор для получения сессии базы данных clients.sqlite3."""
    db = ClientsSessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_dividends_db():
    """Генератор для получения сессии базы данных face.sqlite3."""
    db = DividendSessionLocal()
    try:
        yield db
    finally:
        db.close()