from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from api.services.user_service import (
    get_users_service,
    toggle_user_status_service
)


@csrf_exempt
def get_users_view(request):
    if request.method != "GET":
        return JsonResponse({"error": "GET required"}, status=400)

    users, message = get_users_service()

    return JsonResponse({
        "success": True,
        "message": message,
        "data": list(users)
    })


@csrf_exempt
def toggle_user_status_view(request, user_id):
    if request.method != "PATCH":
        return JsonResponse({"error": "PATCH required"}, status=400)

    uid, message = toggle_user_status_service(user_id)

    if not uid:
        return JsonResponse({"success": False, "error": message}, status=400)

    return JsonResponse({"success": True, "message": message})


from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models.user_model import User


@api_view(["GET"])
def admin_users_view(request):
    users = User.objects.filter(role="CUSTOMER")

    data = []

    for u in users:
        data.append({
            "id": str(u.id),
            "name": u.name,
            "email": u.email,
            "phone": u.phone,
            "order_count": u.order_set.count()
        })

    return Response({"success": True, "data": data})