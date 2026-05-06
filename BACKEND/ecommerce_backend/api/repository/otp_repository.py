from api.models import OTP

# -------------------------
# Create OTP
# -------------------------
def create_otp(data):
    return OTP.objects.create(
        email=data.get("email"),
        phone=data.get("phone"),
        otp=data["otp"],
        purpose=data.get("purpose")  # ✅ added
    )

# -------------------------
# Get OTP
# -------------------------
def get_otp(email=None, phone=None, otp=None, purpose=None):
    filters = {
        "otp": otp,
        "purpose": purpose   # ✅ important
    }

    if email:
        filters["email"] = email
    if phone:
        filters["phone"] = phone

    return OTP.objects.filter(**filters).order_by("-id").first()