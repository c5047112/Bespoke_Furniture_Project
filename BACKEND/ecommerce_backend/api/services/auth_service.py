import random
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.hashers import check_password

from api.models.temp_verification_model import TempVerification
from api.repository.user_repo import create_user, get_user_by_email, get_user_by_phone
from api.repository.admin_repository import get_admin_by_email, get_admin_by_phone
from api.repository.otp_repository import create_otp, get_otp

# -------------------------
# Generate OTP
# -------------------------
def generate_otp():
    return str(random.randint(100000, 999999))

# -------------------------
# Get or create temp record
# -------------------------
def get_or_create_temp(email=None, phone=None):
    temp = None

    if email and phone:
        temp = TempVerification.objects.filter(email=email, phone=phone).first()
    if not temp and email:
        temp = TempVerification.objects.filter(email=email).first()
    if not temp and phone:
        temp = TempVerification.objects.filter(phone=phone).first()

    if not temp:
        temp = TempVerification.objects.create(email=email, phone=phone)
    else:
        if email:
            temp.email = email
        if phone:
            temp.phone = phone
        temp.save()

    return temp

# -------------------------
# Send Email OTP
# -------------------------
def send_email_otp_service(email, purpose=None):
    otp = generate_otp()
    get_or_create_temp(email=email)

    create_otp({
        "email": email,
        "otp": otp,
        "purpose": purpose
    })

    send_mail(
        subject=f"{purpose} OTP" if purpose else "Your OTP Code",
        message=f"Your OTP code is {otp}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )

    return True, "OTP sent to email"

# -------------------------
# Verify Email OTP
# -------------------------
def verify_email_otp_service(email, otp, purpose=None):
    otp_obj = get_otp(email=email, otp=otp, purpose=purpose)

    if not otp_obj:
        return False, "Invalid OTP"

    temp = get_or_create_temp(email=email)
    temp.email_verified = True
    temp.save()

    return True, "Email verified"

# -------------------------
# Send Phone OTP (auto verify)
# -------------------------
def send_phone_otp_service(phone, purpose=None):
    temp = get_or_create_temp(phone=phone)

    temp.phone_verified = True
    temp.save()

    return True, "Phone verified (no OTP)"

# -------------------------
# Verify Phone OTP
# -------------------------
def verify_phone_otp_service(phone, otp, purpose=None):
    otp_obj = get_otp(phone=phone, otp=otp, purpose=purpose)

    if not otp_obj:
        return False, "Invalid OTP"

    temp = TempVerification.objects.filter(phone=phone).first()
    if not temp:
        return False, "Temp record not found"

    temp.phone_verified = True
    temp.save()

    return True, "Phone verified"

# -------------------------
# Register User
# -------------------------
def register_user_service(data):
    email = data.get("email")
    phone = data.get("phone")

    temp = TempVerification.objects.filter(email=email).first()
    if not temp:
        temp = TempVerification.objects.filter(phone=phone).first()
    if not temp:
        return None, "Start verification first"

    if not temp.email_verified:
        return None, "Email not verified yet"

    user_data = {
        "name": data["name"],
        "email": email,
        "phone": phone,
        "password": data["password"],
        "role": "CUSTOMER"
    }

    print("REGISTER RAW PASSWORD:", repr(data.get("password")))
    
    user = create_user(user_data)
    temp.delete()

    return user, "User registered successfully"

# -------------------------
# Login
# -------------------------
def login_user_service(identifier, password):

    identifier = identifier.strip().lower()   # ✅ FIX
    password = password.strip()

    user = get_user_by_email(identifier) or get_user_by_phone(identifier)

    if user and check_password(password, user.password):
        return {
            "id": str(user.id),
            "name": user.name,
            "role": user.role
        }, "Login successful"

    admin = get_admin_by_email(identifier) or get_admin_by_phone(identifier)

    if admin and check_password(password, admin.password):
        return {
            "id": admin.id,
            "name": admin.name,
            "role": "ADMIN"
        }, "Admin login successful"

    return None, "Invalid credentials"