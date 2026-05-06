import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from api.services.auth_service import (
    send_email_otp_service,
    send_phone_otp_service,
    verify_email_otp_service,
    verify_phone_otp_service,
    register_user_service
)

# -------------------------
# Send Email OTP View
# -------------------------
@csrf_exempt
def send_email_otp_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        success, message = send_email_otp_service(email, purpose="REGISTER")
        return JsonResponse({"success": success, "message": message})

# -------------------------
# Verify Email OTP View
# -------------------------
@csrf_exempt
def verify_email_otp_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        otp = data.get("otp")
        success, message = verify_email_otp_service(email, otp, purpose="REGISTER")
        return JsonResponse({"success": success, "message": message})

# -------------------------
# Send Phone OTP View
# -------------------------
@csrf_exempt
def send_phone_otp_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        phone = data.get("phone")
        success, message = send_phone_otp_service(phone, purpose="REGISTER")
        return JsonResponse({"success": success, "message": message})

# -------------------------
# Verify Phone OTP View
# -------------------------
@csrf_exempt
def verify_phone_otp_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        phone = data.get("phone")
        otp = data.get("otp")
        success, message = verify_phone_otp_service(phone, otp, purpose="REGISTER")
        return JsonResponse({"success": success, "message": message})

# -------------------------
# Register User View
# -------------------------
@csrf_exempt
def register_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user, message = register_user_service(data)
        if not user:
            return JsonResponse({"error": message}, status=400)
        return JsonResponse({"message": message, "email": data["email"]})
    

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.hashers import check_password
from api.repository.user_repo import get_user_by_email, get_user_by_phone

@csrf_exempt
def login_user(request):
    data = json.loads(request.body)

    identifier = data.get("identifier")
    password = data.get("password")

    print("IDENTIFIER:", identifier)
    print("PASSWORD:", password)

    user = get_user_by_email(identifier) or get_user_by_phone(identifier)

    if not user:
        return JsonResponse({"success": False, "error": "User not found"}, status=400)

    # ✅ IMPORTANT FIX
    if not check_password(password, user.password):
        return JsonResponse({"success": False, "error": "Invalid credentials"}, status=400)

    print("LOGIN SUCCESS:", user.email)

    return JsonResponse({
        "success": True,
        "user": {
            "id": str(user.id),
            "name": user.name,
            "role": user.role
        }
    })