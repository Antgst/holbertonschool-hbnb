"""Service layer entry points exposed to the API package."""

from app.services.facade import HBnBFacade

# A single facade instance centralizes access to business operations.
facade = HBnBFacade()
