import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from api.services.admin_service import admin_login_service


@csrf_exempt
def admin_login_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    data = json.loads(request.body)

    admin, message = admin_login_service(
        data.get("identifier"),
        data.get("password")
    )

    if not admin:
        return JsonResponse({"success": False, "error": message}, status=400)

    return JsonResponse({"success": True, "message": message, "admin": admin})
