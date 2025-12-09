from rest_framework.throttling import UserRateThrottle

class ShelfScanThrottle(UserRateThrottle):
    rate = "2/minute"