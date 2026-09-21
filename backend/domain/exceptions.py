class DomainError(Exception):
    """Raised when a game operation violates a business rule."""


class ResourceNotFoundError(DomainError):
    """Raised when a requested domain resource does not exist."""
