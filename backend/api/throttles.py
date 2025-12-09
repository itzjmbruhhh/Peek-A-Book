from rest_framework.throttling import UserRateThrottle

class ShelfScanThrottle(UserRateThrottle):
    rate = "5/minute"