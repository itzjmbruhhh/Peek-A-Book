from rest_framework.throttling import UserRateThrottle

class ShelfScanThrottle(UserRateThrottle):
    rate = "10/minute"