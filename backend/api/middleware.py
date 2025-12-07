from django.http import JsonResponse

EXEMPT_PATHS = [
    '/admin/',
    '/static/',
    '/favicon.ico',
]

class DeviceAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        # Skip exempt paths
        if any(request.path.startswith(path) for path in EXEMPT_PATHS):
            return self.get_response(request)
        
        device_id = request.headers.get('X-DEVICE-ID')
        if not device_id:
            return JsonResponse({'error' : 'Device ID Required'}, status=401)
        request.device_id = device_id
        return self.get_response(request)