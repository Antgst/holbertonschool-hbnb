import os


class Config:
    """Base application configuration shared by every environment."""
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt_secret_key')
    DEBUG = False


class DevelopmentConfig(Config):
    """Configuration used during local development."""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///development.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class TestingConfig(Config):
    """Configuration used by the automated test suite."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SQLALCHEMY_TRACK_MODIFICATIONS = False


# Friendly aliases used by Flask when loading configuration by name.
config = {
    'development': DevelopmentConfig,
    'testing':     TestingConfig,
    'default':     DevelopmentConfig
}
