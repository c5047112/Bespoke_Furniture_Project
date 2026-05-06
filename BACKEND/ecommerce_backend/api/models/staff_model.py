from django.contrib.auth.hashers import make_password
from django.db import models

class Staff(models.Model):
    ROLE_CHOICES = [
        ("DRIVER", "Driver"),
        ("HELPER", "Helper"),
    ]

    AVAILABILITY_CHOICES = [
        ("AVAILABLE", "Available"),
        ("BUSY", "Busy"),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField(null=True, blank=True)  
    phone = models.CharField(max_length=15)
    password = models.CharField(max_length=255, null=True, blank=True)

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="DRIVER")
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, default="AVAILABLE")

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # 🔐 hash password
        if not self.password.startswith("pbkdf2_"):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)