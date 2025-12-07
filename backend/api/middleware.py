from django.http import JsonResponse

class DeviceAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        device_id = request.headers.get('X-DEVICE-ID')
        if not device_id:
            return JsonResponse({'error' : 'Device ID Required'}, status=401)
        request.device_id = device_id
        return self.get_response(request)