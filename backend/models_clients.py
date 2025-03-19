from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import ClientsBase
import bcrypt

class User(ClientsBase):
    __tablename__ = 'User'

    ID = Column(Integer, primary_key=True, index=True)
    Name = Column(String, nullable=False)
    Username = Column(String, unique=True, nullable=False)
    Email = Column(String, unique=True, nullable=False)
    PasswordHash = Column(String, nullable=False)
    SubscriptionID = Column(Integer, ForeignKey('Subscription.ID'), nullable=True)

    subscription = relationship("Subscription", back_populates="users")

    @staticmethod
    def hash_password(password: str) -> str:
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def verify_password(self, password: str) -> bool:
        return bcrypt.checkpw(password.encode('utf-8'), self.PasswordHash.encode('utf-8'))


class Subscription(ClientsBase):
    __tablename__ = 'Subscription'

    ID = Column(Integer, primary_key=True, index=True)
    Name = Column(String, nullable=False)
    Price = Column(Integer, nullable=False)
    DurationDays = Column(Integer, nullable=False)

    users = relationship("User", back_populates="subscription")