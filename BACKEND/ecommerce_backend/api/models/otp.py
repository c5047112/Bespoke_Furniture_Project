from django.db import models
import uuid
from django.utils import timezone
from datetime import timedelta

class OTP(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=10, null=True, blank=True)

    otp = models.CharField(max_length=6)

    purpose = models.CharField(
        max_length=20,
        default="REGISTER"
    )  
    # REGISTER / LOGIN / ORDER ✅ NEW

    is_verified = models.BooleanField(default=False)  # ✅ NEW

    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=5)

    def __str__(self):
        return f"{self.email or self.phone} - {self.otp}"