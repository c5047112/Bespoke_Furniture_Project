from django.db import models
from api.models.user_model import User
from api.models.address_model import Address
from api.models.product_model import Product
from api.models.staff_model import Staff
from api.models.van_model import Van

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)
    total_price = models.FloatField()
    tax = models.FloatField()
    delivery_charge = models.FloatField()
    discount = models.FloatField(default=0)
    grand_total = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    estimated_delivery = models.DateTimeField(null=True, blank=True)
    transaction_id = models.CharField(max_length=100, null=True, blank=True)

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("CONFIRMED", "Confirmed"),
        ("ASSIGNED", "Assigned"),  
        ("SHIPPED", "Shipped"),
        ("DELIVERED", "Delivered"),
        ("CANCELLED", "Cancelled"),
    ]

    PAYMENT_STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("SUCCESS", "Success"),
    ]

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="PENDING"
    )

    DELIVERY_STATUS_CHOICES = [
        ("NOT_ASSIGNED", "Not Assigned"),
        ("ASSIGNED", "Assigned"),
        ("OUT_FOR_DELIVERY", "Out for Delivery"),
        ("DELIVERED", "Delivered"),
    ]

    delivery_status = models.CharField(
        max_length=30,
        choices=DELIVERY_STATUS_CHOICES,
        default="NOT_ASSIGNED"
    )

    driver = models.ForeignKey(
        Staff,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    van = models.ForeignKey(
        Van,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def save(self, *args, **kwargs):
        if self.status == "DELIVERED":
            self.payment_status = "SUCCESS"
        super().save(*args, **kwargs)

    def mark_delivered(self):
        self.status = "DELIVERED"
        self.delivery_status = "DELIVERED"
        self.payment_status = "SUCCESS"
        self.save()

    


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.FloatField()