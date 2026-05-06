from django.db import models

class Van(models.Model):
    AVAILABILITY_CHOICES = [
        ("AVAILABLE", "Available"),
        ("IN_USE", "In Use"),
    ]

    vehicle_number = models.CharField(max_length=50)
    type = models.CharField(max_length=50) 

    # ✅ NEW FIELD
    capacity = models.IntegerField(default=0)

    availability = models.CharField(
        max_length=20,
        choices=AVAILABILITY_CHOICES,
        default="AVAILABLE"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.vehicle_number