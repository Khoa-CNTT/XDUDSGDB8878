try:
    from sklearn.base import BaseEstimator
except ImportError:

    class BaseEstimator:
        pass
