from django.contrib import admin
from .models.temp_verification_model import TempVerification
from .models.user_model import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "role", "created_at")
    search_fields = ("name", "email", "phone")

@admin.register(TempVerification)
class TempVerificationAdmin(admin.ModelAdmin):
    list_display = ("email", "phone", "email_verified", "phone_verified", "created_at")
    search_fields = ("email", "phone")