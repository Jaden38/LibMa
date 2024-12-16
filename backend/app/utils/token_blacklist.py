class TokenBlacklist:
    """
    Simple in-memory token blacklist
    Note: In production, use a persistent storage like Redis
    """
    def __init__(self):
        self.blacklisted_tokens = set()

    def blacklist_token(self, token):
        """Add token to blacklist"""
        self.blacklisted_tokens.add(token)

    def is_blacklisted(self, token):
        """Check if token is blacklisted"""
        return token in self.blacklisted_tokens

token_blacklist = TokenBlacklist()